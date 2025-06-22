const mongoose = require('mongoose');
const { config } = require('dotenv');

// Carregar variáveis de ambiente
config();

async function testMongoDBConnection() {
    try {
        console.log('🔗 Testando conexão com MongoDB...');
        
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error('❌ MONGODB_URI não configurada no arquivo .env');
        }

        console.log('📡 Conectando ao MongoDB...');
        
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('✅ Conectado ao MongoDB com sucesso!');
        
        // Testar operações básicas
        console.log('🧪 Testando operações básicas...');
        
        // Testar criação de produto
        const Product = require('../src/models/Product');
        const testProduct = new Product({
            name: 'Produto Teste',
            description: 'Produto para teste de conexão',
            price: 99.99,
            stock: 10,
            category: 'Teste'
        });
        
        await testProduct.save();
        console.log('✅ Produto criado com sucesso!');
        
        // Testar busca de produtos
        const products = await Product.find();
        console.log(`✅ Encontrados ${products.length} produtos`);
        
        // Limpar produto de teste
        await Product.findByIdAndDelete(testProduct._id);
        console.log('✅ Produto de teste removido');
        
        console.log('🎉 Todos os testes passaram! MongoDB está funcionando perfeitamente.');
        
    } catch (error) {
        console.error('❌ Erro ao testar MongoDB:', error.message);
        console.error('💡 Verifique se:');
        console.error('   1. MONGODB_URI está configurada no .env');
        console.error('   2. A string de conexão está correta');
        console.error('   3. O MongoDB está acessível');
    } finally {
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
            console.log('🔌 Conexão fechada');
        }
        process.exit(0);
    }
}

// Executar teste
testMongoDBConnection(); 