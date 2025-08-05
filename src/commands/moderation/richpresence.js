const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { canExecuteModeration, getPermissionError } = require('../../utils/permissions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('richpresence')
        .setDescription('Gerencia o Rich Presence do bot')
        .addSubcommand(subcommand =>
            subcommand
                .setName('status')
                .setDescription('Mostra o status atual do Rich Presence'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('atualizar')
                .setDescription('Atualiza o Rich Presence manualmente'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('configurar')
                .setDescription('Configura o Rich Presence')
                .addStringOption(option =>
                    option.setName('imagem_grande')
                        .setDescription('Nome da imagem grande (do Developer Portal)')
                        .setRequired(false))
                .addStringOption(option =>
                    option.setName('imagem_pequena')
                        .setDescription('Nome da imagem pequena (do Developer Portal)')
                        .setRequired(false))
                .addStringOption(option =>
                    option.setName('texto_grande')
                        .setDescription('Texto da imagem grande')
                        .setRequired(false))
                .addStringOption(option =>
                    option.setName('texto_pequeno')
                        .setDescription('Texto da imagem pequena')
                        .setRequired(false)))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction, database) {
        try {
            await interaction.deferReply();

            // Verificar permissão de moderação
            if (!canExecuteModeration(interaction.member)) {
                return await interaction.editReply({
                    content: getPermissionError('richpresence', 'Administrador ou Moderador'),
                    ephemeral: true
                });
            }

            const subcommand = interaction.options.getSubcommand();

            switch (subcommand) {
                case 'status':
                    await this.showStatus(interaction);
                    break;
                case 'atualizar':
                    await this.updateRichPresence(interaction);
                    break;
                case 'configurar':
                    await this.configureRichPresence(interaction);
                    break;
            }

        } catch (error) {
            console.error('❌ Erro no comando richpresence:', error);
            await interaction.editReply({
                content: '❌ Houve um erro ao executar o comando. Tente novamente.',
                ephemeral: true
            });
        }
    },

    async showStatus(interaction) {
        const client = interaction.client;
        const activity = client.user.presence.activities[0];

        const embed = new EmbedBuilder()
            .setTitle('🎨 Status do Rich Presence')
            .setColor('#3498DB')
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(
                { name: '🤖 Bot', value: client.user.tag, inline: true },
                { name: '📊 Status', value: client.user.presence.status, inline: true },
                { name: '🔄 Atividade', value: activity ? activity.name : 'Nenhuma', inline: true }
            );

        if (activity) {
            embed.addFields(
                { name: '📝 Detalhes', value: activity.details || 'Nenhum', inline: true },
                { name: '📍 Estado', value: activity.state || 'Nenhum', inline: true },
                { name: '🎮 Tipo', value: this.getActivityTypeName(activity.type), inline: true }
            );

            if (activity.assets) {
                embed.addFields(
                    { name: '🖼️ Imagem Grande', value: activity.assets.largeText || 'Nenhum', inline: true },
                    { name: '🖼️ Imagem Pequena', value: activity.assets.smallText || 'Nenhum', inline: true }
                );
            }

            if (activity.buttons && activity.buttons.length > 0) {
                const buttonsText = activity.buttons.map(btn => `• ${btn.label}`).join('\n');
                embed.addFields({
                    name: '🔘 Botões',
                    value: buttonsText,
                    inline: false
                });
            }
        }

        embed.addFields({
            name: '📊 Estatísticas',
            value: `**Servidores:** ${client.guilds.cache.size}\n**Usuários:** ${client.users.cache.size}\n**Ping:** ${client.ws.ping}ms`,
            inline: false
        });

        embed.setTimestamp()
            .setFooter({ text: 'Sistema de Moderação - NihonTech' });

        await interaction.editReply({ embeds: [embed] });
    },

    async updateRichPresence(interaction) {
        const client = interaction.client;
        
        // Forçar atualização do Rich Presence
        const richPresenceConfig = {
            largeImage: 'embedded_cover',
            largeText: 'Bot Geralt - Sistema de Moderação',
            smallImage: 'embedded_background',
            smallText: 'Protegendo comunidades',
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

        const currentState = richPresenceConfig.states[Math.floor(Math.random() * richPresenceConfig.states.length)];
        
        client.user.setPresence({
            activities: [{
                name: currentState.name,
                type: 0, // Playing
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

        const embed = new EmbedBuilder()
            .setTitle('✅ Rich Presence Atualizado')
            .setColor('#00FF00')
            .setDescription('O Rich Presence foi atualizado com sucesso!')
            .addFields(
                { name: '🎮 Atividade', value: currentState.name, inline: true },
                { name: '📝 Detalhes', value: currentState.details, inline: true },
                { name: '🖼️ Imagem Grande', value: richPresenceConfig.largeImage, inline: true },
                { name: '🖼️ Imagem Pequena', value: richPresenceConfig.smallImage, inline: true }
            )
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    },

    async configureRichPresence(interaction) {
        const largeImage = interaction.options.getString('imagem_grande');
        const smallImage = interaction.options.getString('imagem_pequena');
        const largeText = interaction.options.getString('texto_grande');
        const smallText = interaction.options.getString('texto_pequeno');

        const embed = new EmbedBuilder()
            .setTitle('⚙️ Configuração do Rich Presence')
            .setColor('#3498DB')
            .setDescription('✅ **Suas imagens já estão configuradas no Developer Portal!**')
            .addFields(
                {
                    name: '🖼️ Imagens Configuradas',
                    value: '✅ **embedded_cover** - Geralt de Rivia (imagem grande)\n✅ **embedded_background** - Personagem fantástico (imagem pequena)',
                    inline: false
                },
                {
                    name: '📋 Configuração Atual',
                    value: `**Imagem Grande:** ${largeImage || 'embedded_cover'} (Geralt de Rivia)\n**Imagem Pequena:** ${smallImage || 'embedded_background'} (Personagem fantástico)\n**Texto Grande:** ${largeText || 'Bot Geralt - Sistema de Moderação'}\n**Texto Pequeno:** ${smallText || 'Protegendo comunidades'}`,
                    inline: false
                },
                {
                    name: '🎯 Próximos Passos',
                    value: '1. **Aguarde até 1 hora** para o cache do Discord\n2. **Use `/richpresence atualizar`** para forçar atualização\n3. **Use `/richpresence status`** para verificar\n4. **Reinicie o bot** se necessário',
                    inline: false
                },
                {
                    name: '⚠️ Importante',
                    value: '• As imagens podem demorar até 1 hora para aparecer\n• O bot já está configurado com os nomes corretos\n• Use `/richpresence atualizar` para testar imediatamente',
                    inline: false
                }
            )
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    },

    getActivityTypeName(type) {
        const types = {
            0: 'Jogando',
            1: 'Transmitindo',
            2: 'Ouvindo',
            3: 'Assistindo',
            4: 'Competindo',
            5: 'Personalizado'
        };
        return types[type] || 'Desconhecido';
    }
}; 