const mongoose = require('mongoose');
const { config } = require('dotenv');

// Carregar variáveis de ambiente
config();

async function testMongoDBConnection() {
    console.log('🔍 Testando conexão com MongoDB...\n');

    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
        console.log('❌ MONGODB_URI não configurada!');
        console.log('📋 Configure a variável MONGODB_URI no seu .env');
        return;
    }

    console.log('📋 URI do MongoDB:');
    console.log(mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Oculta credenciais
    console.log('');

    try {
        console.log('🔄 Tentando conectar...');
        
        // Configurar timeout de conexão
        const connectionOptions = {
            serverSelectionTimeoutMS: 10000, // 10 segundos
            socketTimeoutMS: 45000, // 45 segundos
            connectTimeoutMS: 10000, // 10 segundos
        };

        await mongoose.connect(mongoUri, connectionOptions);
        
        console.log('✅ Conexão com MongoDB estabelecida com sucesso!');
        console.log('📊 Informações da conexão:');
        console.log(`   - Host: ${mongoose.connection.host}`);
        console.log(`   - Port: ${mongoose.connection.port}`);
        console.log(`   - Database: ${mongoose.connection.name}`);
        console.log(`   - Ready State: ${mongoose.connection.readyState}`);
        
        // Testar operação básica
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log(`   - Collections: ${collections.length}`);
        
        console.log('\n🎉 MongoDB está funcionando perfeitamente!');
        
    } catch (error) {
        console.log('❌ Erro ao conectar com MongoDB:');
        console.log('');
        
        if (error.name === 'MongooseServerSelectionError') {
            console.log('🔍 Tipo de erro: Server Selection Error');
            console.log('📋 Possíveis causas:');
            console.log('   1. IP não liberado no MongoDB Atlas');
            console.log('   2. Credenciais incorretas');
            console.log('   3. Cluster offline ou em manutenção');
            console.log('   4. Firewall bloqueando conexão');
            console.log('');
            console.log('🛠️ Soluções:');
            console.log('   1. Libere o IP 0.0.0.0/0 no MongoDB Atlas');
            console.log('   2. Verifique usuário e senha');
            console.log('   3. Teste a URI no MongoDB Compass');
            console.log('   4. Verifique se o cluster está ativo');
        } else if (error.name === 'MongoParseError') {
            console.log('🔍 Tipo de erro: Parse Error');
            console.log('📋 Possível causa: URI malformada');
            console.log('🛠️ Solução: Verifique a sintaxe da MONGODB_URI');
        } else if (error.name === 'MongoNetworkError') {
            console.log('🔍 Tipo de erro: Network Error');
            console.log('📋 Possível causa: Problema de rede');
            console.log('🛠️ Solução: Verifique sua conexão de internet');
        } else {
            console.log(`🔍 Tipo de erro: ${error.name}`);
            console.log(`📋 Mensagem: ${error.message}`);
        }
        
        console.log('');
        console.log('📋 Detalhes técnicos:');
        console.log(`   - Nome do erro: ${error.name}`);
        console.log(`   - Código: ${error.code || 'N/A'}`);
        console.log(`   - Mensagem: ${error.message}`);
        
        if (error.reason) {
            console.log(`   - Razão: ${error.reason}`);
        }
        
    } finally {
        // Fechar conexão
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
            console.log('\n🔌 Conexão fechada.');
        }
    }
}

// Executar teste
testMongoDBConnection().catch(console.error); 