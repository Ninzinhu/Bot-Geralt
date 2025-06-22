const axios = require('axios');
const crypto = require('crypto');

// Configurações
const WEBHOOK_URL = 'http://localhost:3000/webhook/saas';
const WEBHOOK_SECRET = 'seu_secret_aqui'; // Deve ser o mesmo do .env

// Função para gerar assinatura
function generateSignature(payload, secret) {
    return crypto
        .createHmac('sha256', secret)
        .update(JSON.stringify(payload))
        .digest('hex');
}

// Dados de exemplo para teste
const testData = {
    event: 'sale.completed',
    data: {
        customer_id: '123456789',
        customer_name: 'João Silva',
        product_name: 'Produto Premium',
        product_id: 1,
        quantity: 1,
        total_price: 99.90,
        payment_method: 'PIX',
        transaction_id: 'txn_' + Date.now()
    }
};

// Teste de venda
async function testSale() {
    try {
        const signature = generateSignature(testData, WEBHOOK_SECRET);
        
        const response = await axios.post(WEBHOOK_URL, testData, {
            headers: {
                'Content-Type': 'application/json',
                'x-webhook-signature': signature
            }
        });

        console.log('✅ Venda testada com sucesso!');
        console.log('Status:', response.status);
        console.log('Resposta:', response.data);
    } catch (error) {
        console.error('❌ Erro ao testar venda:', error.response?.data || error.message);
    }
}

// Teste de reembolso
async function testRefund() {
    try {
        const refundData = {
            event: 'sale.refunded',
            data: {
                customer_id: '123456789',
                customer_name: 'João Silva',
                product_name: 'Produto Premium',
                product_id: 1,
                quantity: 1,
                total_price: 99.90,
                payment_method: 'PIX',
                transaction_id: 'txn_' + Date.now(),
                refund_reason: 'Solicitação do cliente'
            }
        };

        const signature = generateSignature(refundData, WEBHOOK_SECRET);
        
        const response = await axios.post(WEBHOOK_URL, refundData, {
            headers: {
                'Content-Type': 'application/json',
                'x-webhook-signature': signature
            }
        });

        console.log('✅ Reembolso testado com sucesso!');
        console.log('Status:', response.status);
        console.log('Resposta:', response.data);
    } catch (error) {
        console.error('❌ Erro ao testar reembolso:', error.response?.data || error.message);
    }
}

// Teste de nova assinatura
async function testSubscription() {
    try {
        const subscriptionData = {
            event: 'subscription.created',
            data: {
                customer_id: '123456789',
                customer_name: 'João Silva',
                plan_name: 'Plano Premium',
                amount: 99.90,
                billing_cycle: 'Mensal',
                next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            }
        };

        const signature = generateSignature(subscriptionData, WEBHOOK_SECRET);
        
        const response = await axios.post(WEBHOOK_URL, subscriptionData, {
            headers: {
                'Content-Type': 'application/json',
                'x-webhook-signature': signature
            }
        });

        console.log('✅ Assinatura testada com sucesso!');
        console.log('Status:', response.status);
        console.log('Resposta:', response.data);
    } catch (error) {
        console.error('❌ Erro ao testar assinatura:', error.response?.data || error.message);
    }
}

// Executar testes
async function runTests() {
    console.log('🧪 Iniciando testes do webhook...\n');
    
    console.log('📦 Testando venda...');
    await testSale();
    console.log('');
    
    console.log('🔄 Testando reembolso...');
    await testRefund();
    console.log('');
    
    console.log('📅 Testando assinatura...');
    await testSubscription();
    console.log('');
    
    console.log('✅ Todos os testes concluídos!');
}

// Executar se chamado diretamente
if (require.main === module) {
    runTests();
}

module.exports = {
    testSale,
    testRefund,
    testSubscription,
    runTests
}; 