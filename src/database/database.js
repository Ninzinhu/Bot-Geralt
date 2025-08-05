const mongoose = require('mongoose');
const Product = require('../models/Product');
const Sale = require('../models/Sale');
const Ticket = require('../models/Ticket');
const TicketMessage = require('../models/TicketMessage');
const StoreConfig = require('../models/StoreConfig');

class Database {
    constructor() {
        this.isConnected = false;
    }

    async init() {
        try {
            const mongoUri = process.env.MONGODB_URI;
            if (!mongoUri) {
                throw new Error('MONGODB_URI não configurada no arquivo .env');
            }

            await mongoose.connect(mongoUri);

            this.isConnected = true;
            console.log('🗄️ Conectado ao MongoDB com sucesso!');

            // Inicializar configurações padrão da loja
            await this.initializeDefaultConfig();

        } catch (error) {
            console.error('❌ Erro ao conectar ao MongoDB:', error);
            throw error;
        }
    }

    async initializeDefaultConfig() {
        const defaultConfigs = [
            { key: 'store_name', value: process.env.STORE_NAME || 'Sua Loja' },
            { key: 'store_website', value: process.env.STORE_WEBSITE || 'https://sualoja.com' },
            { key: 'store_support', value: process.env.STORE_SUPPORT || 'https://discord.gg/seulink' },
            { key: 'store_email', value: process.env.STORE_EMAIL || 'contato@sualoja.com' }
        ];

        for (const config of defaultConfigs) {
            await StoreConfig.findOneAndUpdate(
                { key: config.key },
                { value: config.value },
                { upsert: true, new: true }
            );
        }

        console.log('⚙️ Configurações padrão da loja inicializadas');
    }

    // Métodos para produtos
    async addProduct(name, description, price, stock, category) {
        const product = new Product({
            name,
            description,
            price,
            stock,
            category
        });
        await product.save();
        return product._id;
    }

    async getProducts() {
        return await Product.find().sort({ createdAt: -1 });
    }

    async getProduct(id) {
        return await Product.findById(id);
    }

    async updateStock(productId, newStock) {
        const result = await Product.findByIdAndUpdate(
            productId,
            { stock: newStock },
            { new: true }
        );
        return result ? 1 : 0;
    }

    async deleteProduct(id) {
        const result = await Product.findByIdAndDelete(id);
        return result ? 1 : 0;
    }

    // Métodos para vendas
    async createSale(productId, customerId, customerName, quantity, totalPrice, paymentMethod, transactionId) {
        const sale = new Sale({
            product: productId,
            customer_id: customerId,
            customer_name: customerName,
            quantity,
            total_price: totalPrice,
            payment_method: paymentMethod,
            transaction_id: transactionId
        });
        await sale.save();
        return sale._id;
    }

    async getSales() {
        return await Sale.find()
            .populate('product', 'name')
            .sort({ createdAt: -1 });
    }

    async updateSaleStatus(saleId, status) {
        const result = await Sale.findByIdAndUpdate(
            saleId,
            { status },
            { new: true }
        );
        return result ? 1 : 0;
    }

    // Métodos para tickets
    async createTicket(channelId, userId, userName, subject, priority = 'medium') {
        const ticket = new Ticket({
            channel_id: channelId,
            user_id: userId,
            user_name: userName,
            subject,
            priority
        });
        await ticket.save();
        return ticket._id;
    }

    async getTicket(channelId) {
        return await Ticket.findOne({ channel_id: channelId });
    }

    async getTickets(status = null) {
        const query = status ? { status } : {};
        return await Ticket.find(query).sort({ createdAt: -1 });
    }

    async closeTicket(channelId) {
        const result = await Ticket.findOneAndUpdate(
            { channel_id: channelId },
            { 
                status: 'closed',
                closed_at: new Date()
            },
            { new: true }
        );
        return result ? 1 : 0;
    }

    async addTicketMessage(ticketId, userId, userName, message, isStaff = false) {
        const ticketMessage = new TicketMessage({
            ticket: ticketId,
            user_id: userId,
            user_name: userName,
            message,
            is_staff: isStaff
        });
        await ticketMessage.save();
        return ticketMessage._id;
    }

    async getTicketMessages(ticketId) {
        return await TicketMessage.find({ ticket: ticketId })
            .sort({ createdAt: 1 });
    }

    // Métodos para configurações da loja
    async getStoreConfig() {
        const configs = await StoreConfig.find();
        const config = {};
        configs.forEach(item => {
            config[item.key] = item.value;
        });
        return config;
    }

    async updateStoreConfig(key, value) {
        const result = await StoreConfig.findOneAndUpdate(
            { key },
            { value },
            { upsert: true, new: true }
        );
        return result ? 1 : 0;
    }

    // Método para verificar conexão
    isConnected() {
        return this.isConnected && mongoose.connection.readyState === 1;
    }

    // Método para fechar conexão
    async close() {
        if (this.isConnected) {
            await mongoose.connection.close();
            this.isConnected = false;
        }
    }
}

module.exports = Database; 