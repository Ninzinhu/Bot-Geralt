const { Events, ActivityType } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`🤖 ${client.user.tag} está online e pronto para a aventura!`);
        console.log(`📊 Servindo ${client.guilds.cache.size} servidores`);
        console.log(`👥 Total de usuários: ${client.users.cache.size}`);

        const activities = [
            { name: 'Bem-vindo à NihonTech! ⛩️', type: ActivityType.Watching },
            { name: 'Acesse nossa loja em /info produtos', type: ActivityType.Watching },
            { name: 'O melhor da tecnologia japonesa!', type: ActivityType.Watching },
            { name: 'Precisando de ajuda? Use /ticket', type: ActivityType.Watching }
        ];

        // Definir status do bot
        setInterval(() => {
            const randomActivity = activities[Math.floor(Math.random() * activities.length)];
            client.user.setActivity(randomActivity.name, { type: randomActivity.type });
        }, 15000); // Muda a cada 15 segundos

        client.user.setPresence({
            status: 'online',
        });

        // Log de informações do sistema
        console.log('🗡️ Bot Geralt - Sistema de Vendas e Suporte');
        console.log('📦 Funcionalidades disponíveis:');
        console.log('   • Sistema de Vendas');
        console.log('   • Gerenciamento de Estoque');
        console.log('   • Sistema de Tickets');
        console.log('   • Webhooks para SaaS');
        console.log('   • Informações da Loja');
        console.log('');
        console.log('🌐 Webhook server rodando na porta:', process.env.WEBHOOK_PORT || 3000);
        console.log('🗄️ Banco de dados inicializado');
        console.log('✅ Bot pronto para uso!');
    },
}; 