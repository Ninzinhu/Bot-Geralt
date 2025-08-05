const { Events, ActivityType } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`✅ ${client.user.tag} está online!`);
        console.log(`🛡️ Bot de Moderação ativo em ${client.guilds.cache.size} servidor(es)`);
        console.log(`👥 Total de usuários: ${client.users.cache.size}`);
        console.log(`📊 Ping: ${client.ws.ping}ms`);

        // Configuração do Rich Presence
        this.setupRichPresence(client);

        console.log('🎯 Rich Presence configurado com imagens personalizadas!');
    },

    setupRichPresence(client) {
        // Configurações do Rich Presence
        const richPresenceConfig = {
            // Imagens principais (definidas no Developer Portal)
            largeImage: 'embedded_cover', // Nome da imagem grande (Geralt de Rivia)
            largeText: 'Bot Geralt - Sistema de Moderação', // Texto ao passar o mouse
            smallImage: 'embedded_background', // Nome da imagem pequena (personagem fantástico)
            smallText: 'Protegendo comunidades', // Texto ao passar o mouse

            // Estados dinâmicos
            states: [
                {
                    name: '🛡️ Protegendo a comunidade',
                    details: 'Moderação automática ativa',
                    largeImage: 'embedded_cover',
                    smallImage: 'embedded_background'
                },
                {
                    name: '⚔️ Comandos de moderação',
                    details: '/ban, /kick, /mute, /clear',
                    largeImage: 'embedded_cover',
                    smallImage: 'embedded_background'
                },
                {
                    name: '🎵 Player de música',
                    details: '/play, /pause, /skip, /queue',
                    largeImage: 'embedded_cover',
                    smallImage: 'embedded_background'
                },
                {
                    name: '📋 Sistema de tickets',
                    details: 'Suporte 24/7 disponível',
                    largeImage: 'embedded_cover',
                    smallImage: 'embedded_background'
                },
                {
                    name: '👮 Moderação 24/7',
                    details: 'Proteção automática ativa',
                    largeImage: 'embedded_cover',
                    smallImage: 'embedded_background'
                },
                {
                    name: '🤖 Bot Geralt Online',
                    details: `${client.guilds.cache.size} servidores protegidos`,
                    largeImage: 'embedded_cover',
                    smallImage: 'embedded_background'
                }
            ],

            // Botões do Rich Presence
            buttons: [
                {
                    label: '🛡️ Adicionar ao Servidor',
                    url: `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`
                },
                {
                    label: '📖 Documentação',
                    url: 'https://github.com/seu-usuario/bot-geralt'
                }
            ]
        };

        // Função para atualizar o Rich Presence
        const updateRichPresence = () => {
            const currentState = richPresenceConfig.states[Math.floor(Math.random() * richPresenceConfig.states.length)];
            
            client.user.setPresence({
                activities: [{
                    name: currentState.name,
                    type: ActivityType.Playing,
                    details: currentState.details,
                    state: `Servindo ${client.guilds.cache.size} servidores`,
                    largeImageKey: currentState.largeImage,
                    largeText: richPresenceConfig.largeText,
                    smallImageKey: currentState.smallImage,
                    smallText: richPresenceConfig.smallText,
                    buttons: richPresenceConfig.buttons
                }],
                status: 'online'
            });
        };

        // Atualizar Rich Presence a cada 30 segundos
        updateRichPresence(); // Primeira atualização
        setInterval(updateRichPresence, 30000);

        // Atualizar quando o bot entra/sai de servidores
        client.on('guildCreate', () => {
            updateRichPresence();
        });

        client.on('guildDelete', () => {
            updateRichPresence();
        });
    }
}; 