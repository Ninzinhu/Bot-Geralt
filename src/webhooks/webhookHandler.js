const { EmbedBuilder, WebhookClient } = require('discord.js');
const crypto = require('crypto');

class WebhookHandler {
    constructor(client, database) {
        this.client = client;
        this.database = database;
        this.webhookSecret = process.env.WEBHOOK_SECRET;
    }

    async handleSaasWebhook(req, res) {
        try {
            // Verificar assinatura do webhook (se configurada)
            if (this.webhookSecret) {
                const signature = req.headers['x-webhook-signature'];
                if (!this.verifySignature(req.body, signature)) {
                    return res.status(401).json({ error: 'Assinatura inválida' });
                }
            }

            const { event, data } = req.body;

            switch (event) {
                case 'sale.completed':
                    await this.handleSaleCompleted(data);
                    break;
                case 'sale.refunded':
                    await this.handleSaleRefunded(data);
                    break;
                case 'subscription.created':
                    await this.handleSubscriptionCreated(data);
                    break;
                case 'subscription.cancelled':
                    await this.handleSubscriptionCancelled(data);
                    break;
                default:
                    console.log(`📦 Evento não reconhecido: ${event}`);
            }

            res.status(200).json({ success: true });
        } catch (error) {
            console.error('❌ Erro ao processar webhook:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    verifySignature(payload, signature) {
        if (!signature) return false;
        
        const expectedSignature = crypto
            .createHmac('sha256', this.webhookSecret)
            .update(JSON.stringify(payload))
            .digest('hex');
        
        return crypto.timingSafeEqual(
            Buffer.from(signature),
            Buffer.from(expectedSignature)
        );
    }

    async handleSaleCompleted(data) {
        try {
            const {
                customer_id,
                customer_name,
                product_name,
                product_id,
                quantity,
                total_price,
                payment_method,
                transaction_id,
                channel_id
            } = data;

            // Registrar venda no banco de dados
            const saleId = await this.database.createSale(
                product_id,
                customer_id,
                customer_name,
                quantity,
                total_price,
                payment_method,
                transaction_id
            );

            // Atualizar estoque
            const product = await this.database.getProduct(product_id);
            if (product) {
                const newStock = Math.max(0, product.stock - quantity);
                await this.database.updateStock(product_id, newStock);
            }

            // Enviar notificação no canal de vendas
            await this.sendSaleNotification(data, saleId);

            console.log(`💰 Venda registrada: ${product_name} - R$ ${total_price}`);
        } catch (error) {
            console.error('❌ Erro ao processar venda:', error);
        }
    }

    async handleSaleRefunded(data) {
        try {
            const { transaction_id, quantity, product_id } = data;

            // Atualizar status da venda
            const sales = await this.database.getSales();
            const sale = sales.find(s => s.transaction_id === transaction_id);
            
            if (sale) {
                await this.database.updateSaleStatus(sale._id, 'refunded');
                
                // Restaurar estoque
                const product = await this.database.getProduct(product_id);
                if (product) {
                    const newStock = product.stock + quantity;
                    await this.database.updateStock(product_id, newStock);
                }
            }

            // Enviar notificação de reembolso
            await this.sendRefundNotification(data);

            console.log(`🔄 Reembolso processado: ${transaction_id}`);
        } catch (error) {
            console.error('❌ Erro ao processar reembolso:', error);
        }
    }

    async handleSubscriptionCreated(data) {
        try {
            const {
                customer_id,
                customer_name,
                plan_name,
                amount,
                billing_cycle,
                next_billing_date
            } = data;

            // Enviar notificação de nova assinatura
            await this.sendSubscriptionNotification(data, 'created');

            console.log(`📅 Nova assinatura: ${customer_name} - ${plan_name}`);
        } catch (error) {
            console.error('❌ Erro ao processar nova assinatura:', error);
        }
    }

    async handleSubscriptionCancelled(data) {
        try {
            const {
                customer_id,
                customer_name,
                plan_name,
                cancellation_reason
            } = data;

            // Enviar notificação de cancelamento
            await this.sendSubscriptionNotification(data, 'cancelled');

            console.log(`❌ Assinatura cancelada: ${customer_name} - ${plan_name}`);
        } catch (error) {
            console.error('❌ Erro ao processar cancelamento:', error);
        }
    }

    async sendSaleNotification(data, saleId) {
        try {
            const embed = new EmbedBuilder()
                .setTitle('💰 Nova Venda Realizada!')
                .setColor('#00FF00')
                .setDescription(`Venda #${saleId} foi processada com sucesso!`)
                .addFields(
                    { name: '👤 Cliente', value: data.customer_name, inline: true },
                    { name: '📦 Produto', value: data.product_name, inline: true },
                    { name: '💰 Valor', value: `R$ ${data.total_price.toFixed(2)}`, inline: true },
                    { name: '🔢 Quantidade', value: data.quantity.toString(), inline: true },
                    { name: '💳 Método', value: data.payment_method, inline: true },
                    { name: '🆔 Transação', value: data.transaction_id, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: 'Bot Geralt - Sistema de Vendas' });

            await this.sendToSalesChannel(embed);
        } catch (error) {
            console.error('❌ Erro ao enviar notificação de venda:', error);
        }
    }

    async sendRefundNotification(data) {
        try {
            const embed = new EmbedBuilder()
                .setTitle('🔄 Reembolso Processado')
                .setColor('#FFA500')
                .setDescription(`Reembolso processado para a transação ${data.transaction_id}`)
                .addFields(
                    { name: '👤 Cliente', value: data.customer_name, inline: true },
                    { name: '📦 Produto', value: data.product_name, inline: true },
                    { name: '💰 Valor', value: `R$ ${data.total_price.toFixed(2)}`, inline: true },
                    { name: '🔢 Quantidade', value: data.quantity.toString(), inline: true },
                    { name: '📝 Motivo', value: data.refund_reason || 'Não especificado', inline: true }
                )
                .setTimestamp()
                .setFooter({ text: 'Bot Geralt - Sistema de Vendas' });

            await this.sendToSalesChannel(embed);
        } catch (error) {
            console.error('❌ Erro ao enviar notificação de reembolso:', error);
        }
    }

    async sendSubscriptionNotification(data, type) {
        try {
            const title = type === 'created' ? '📅 Nova Assinatura' : '❌ Assinatura Cancelada';
            const color = type === 'created' ? '#00FF00' : '#FF0000';
            const description = type === 'created' 
                ? 'Uma nova assinatura foi criada!' 
                : 'Uma assinatura foi cancelada.';

            const embed = new EmbedBuilder()
                .setTitle(title)
                .setColor(color)
                .setDescription(description)
                .addFields(
                    { name: '👤 Cliente', value: data.customer_name, inline: true },
                    { name: '📋 Plano', value: data.plan_name, inline: true },
                    { name: '💰 Valor', value: `R$ ${data.amount.toFixed(2)}`, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: 'Bot Geralt - Sistema de Assinaturas' });

            if (type === 'created') {
                embed.addFields(
                    { name: '🔄 Ciclo', value: data.billing_cycle, inline: true },
                    { name: '📅 Próximo Pagamento', value: new Date(data.next_billing_date).toLocaleDateString('pt-BR'), inline: true }
                );
            } else if (data.cancellation_reason) {
                embed.addFields({ name: '📝 Motivo', value: data.cancellation_reason, inline: true });
            }

            await this.sendToSalesChannel(embed);
        } catch (error) {
            console.error('❌ Erro ao enviar notificação de assinatura:', error);
        }
    }

    async sendToSalesChannel(embed) {
        try {
            // Buscar canal de vendas (você pode configurar o ID do canal nas variáveis de ambiente)
            const salesChannelId = process.env.SALES_CHANNEL_ID;
            
            if (salesChannelId) {
                const channel = this.client.channels.cache.get(salesChannelId);
                if (channel) {
                    await channel.send({ embeds: [embed] });
                }
            }

            // Também enviar para webhook configurado (se houver)
            const webhookUrl = process.env.SALES_WEBHOOK_URL;
            if (webhookUrl) {
                const webhook = new WebhookClient({ url: webhookUrl });
                await webhook.send({ embeds: [embed] });
            }
        } catch (error) {
            console.error('❌ Erro ao enviar para canal de vendas:', error);
        }
    }
}

module.exports = WebhookHandler; 