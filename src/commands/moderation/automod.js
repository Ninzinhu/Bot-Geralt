const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('automod')
        .setDescription('Configura a moderação automática do servidor')
        .addSubcommand(subcommand =>
            subcommand
                .setName('status')
                .setDescription('Mostra o status atual da moderação automática'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('ativar')
                .setDescription('Ativa a moderação automática'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('desativar')
                .setDescription('Desativa a moderação automática'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('palavras')
                .setDescription('Gerencia palavras proibidas')
                .addStringOption(option =>
                    option.setName('acao')
                        .setDescription('Ação a realizar')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Adicionar', value: 'add' },
                            { name: 'Remover', value: 'remove' },
                            { name: 'Listar', value: 'list' }
                        ))
                .addStringOption(option =>
                    option.setName('palavra')
                        .setDescription('Palavra a adicionar/remover')
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('spam')
                .setDescription('Configura proteção anti-spam')
                .addIntegerOption(option =>
                    option.setName('max_mensagens')
                        .setDescription('Máximo de mensagens por janela de tempo')
                        .setRequired(false)
                        .setMinValue(1)
                        .setMaxValue(20))
                .addIntegerOption(option =>
                    option.setName('janela_tempo')
                        .setDescription('Janela de tempo em segundos')
                        .setRequired(false)
                        .setMinValue(5)
                        .setMaxValue(60)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('acoes')
                .setDescription('Configura ações de moderação')
                .addStringOption(option =>
                    option.setName('severidade')
                        .setDescription('Nível de severidade')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Baixa', value: 'low' },
                            { name: 'Média', value: 'medium' },
                            { name: 'Alta', value: 'high' }
                        ))
                .addStringOption(option =>
                    option.setName('acao')
                        .setDescription('Ação a aplicar')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Aviso', value: 'warn' },
                            { name: 'Silenciar', value: 'mute' },
                            { name: 'Expulsar', value: 'kick' },
                            { name: 'Banir', value: 'ban' }
                        )))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction, database) {
        try {
            await interaction.deferReply();

            const subcommand = interaction.options.getSubcommand();

            switch (subcommand) {
                case 'status':
                    await this.showStatus(interaction, database);
                    break;
                case 'ativar':
                    await this.enableAutoMod(interaction, database);
                    break;
                case 'desativar':
                    await this.disableAutoMod(interaction, database);
                    break;
                case 'palavras':
                    await this.manageWords(interaction, database);
                    break;
                case 'spam':
                    await this.configureSpam(interaction, database);
                    break;
                case 'acoes':
                    await this.configureActions(interaction, database);
                    break;
            }

        } catch (error) {
            console.error('❌ Erro no comando automod:', error);
            await interaction.editReply({
                content: '❌ Houve um erro ao executar o comando. Tente novamente.',
                ephemeral: true
            });
        }
    },

    async showStatus(interaction, database) {
        const config = await this.getConfig(interaction.guild.id);
        
        const embed = new EmbedBuilder()
            .setTitle('🤖 Status da Moderação Automática')
            .setColor(config.enabled ? '#00FF00' : '#FF0000')
            .addFields(
                { name: '📊 Status', value: config.enabled ? '✅ Ativada' : '❌ Desativada', inline: true },
                { name: '🛡️ Anti-Spam', value: config.antiSpam.enabled ? '✅ Ativo' : '❌ Inativo', inline: true },
                { name: '📝 Filtro de Palavras', value: config.wordFilter.enabled ? '✅ Ativo' : '❌ Inativo', inline: true },
                { name: '🔗 Filtro de Links', value: config.linkFilter.enabled ? '✅ Ativo' : '❌ Inativo', inline: true },
                { name: '📢 Filtro de Caps', value: config.capsFilter.enabled ? '✅ Ativo' : '❌ Inativo', inline: true },
                { name: '😀 Filtro de Emojis', value: config.emojiFilter.enabled ? '✅ Ativo' : '❌ Inativo', inline: true },
                { name: '⚡ Ações', value: `Baixa: ${config.actions.low}\nMédia: ${config.actions.medium}\nAlta: ${config.actions.high}`, inline: false }
            )
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    },

    async enableAutoMod(interaction, database) {
        const config = await this.getConfig(interaction.guild.id);
        config.enabled = true;
        
        await this.saveConfig(interaction.guild.id, config);

        const embed = new EmbedBuilder()
            .setTitle('✅ Moderação Automática Ativada')
            .setColor('#00FF00')
            .setDescription('A moderação automática foi ativada com sucesso!')
            .addFields(
                { name: '🛡️ Proteções Ativas', value: '• Anti-Spam\n• Filtro de Palavras\n• Filtro de Links\n• Filtro de Caps\n• Filtro de Emojis', inline: false }
            )
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    },

    async disableAutoMod(interaction, database) {
        const config = await this.getConfig(interaction.guild.id);
        config.enabled = false;
        
        await this.saveConfig(interaction.guild.id, config);

        const embed = new EmbedBuilder()
            .setTitle('❌ Moderação Automática Desativada')
            .setColor('#FF0000')
            .setDescription('A moderação automática foi desativada.')
            .addFields(
                { name: '⚠️ Aviso', value: 'O servidor agora depende apenas da moderação manual.', inline: false }
            )
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    },

    async manageWords(interaction, database) {
        const action = interaction.options.getString('acao');
        const word = interaction.options.getString('palavra');
        const config = await this.getConfig(interaction.guild.id);

        switch (action) {
            case 'add':
                if (!word) {
                    return interaction.editReply({
                        content: '❌ Você deve especificar uma palavra para adicionar.',
                        ephemeral: true
                    });
                }
                
                if (config.wordFilter.words.includes(word.toLowerCase())) {
                    return interaction.editReply({
                        content: '❌ Esta palavra já está na lista de proibidas.',
                        ephemeral: true
                    });
                }

                config.wordFilter.words.push(word.toLowerCase());
                await this.saveConfig(interaction.guild.id, config);

                const addEmbed = new EmbedBuilder()
                    .setTitle('✅ Palavra Adicionada')
                    .setColor('#00FF00')
                    .setDescription(`A palavra "${word}" foi adicionada à lista de proibidas.`)
                    .setTimestamp();

                await interaction.editReply({ embeds: [addEmbed] });
                break;

            case 'remove':
                if (!word) {
                    return interaction.editReply({
                        content: '❌ Você deve especificar uma palavra para remover.',
                        ephemeral: true
                    });
                }

                const index = config.wordFilter.words.indexOf(word.toLowerCase());
                if (index === -1) {
                    return interaction.editReply({
                        content: '❌ Esta palavra não está na lista de proibidas.',
                        ephemeral: true
                    });
                }

                config.wordFilter.words.splice(index, 1);
                await this.saveConfig(interaction.guild.id, config);

                const removeEmbed = new EmbedBuilder()
                    .setTitle('✅ Palavra Removida')
                    .setColor('#00FF00')
                    .setDescription(`A palavra "${word}" foi removida da lista de proibidas.`)
                    .setTimestamp();

                await interaction.editReply({ embeds: [removeEmbed] });
                break;

            case 'list':
                const words = config.wordFilter.words;
                const listEmbed = new EmbedBuilder()
                    .setTitle('📝 Palavras Proibidas')
                    .setColor('#3498DB')
                    .setDescription(words.length > 0 ? words.join(', ') : 'Nenhuma palavra proibida configurada.')
                    .addFields(
                        { name: '📊 Total', value: words.length.toString(), inline: true }
                    )
                    .setTimestamp();

                await interaction.editReply({ embeds: [listEmbed] });
                break;
        }
    },

    async configureSpam(interaction, database) {
        const maxMessages = interaction.options.getInteger('max_mensagens');
        const timeWindow = interaction.options.getInteger('janela_tempo');
        const config = await this.getConfig(interaction.guild.id);

        if (maxMessages) {
            config.antiSpam.maxMessages = maxMessages;
        }
        if (timeWindow) {
            config.antiSpam.timeWindow = timeWindow * 1000; // Converter para milissegundos
        }

        await this.saveConfig(interaction.guild.id, config);

        const embed = new EmbedBuilder()
            .setTitle('⚙️ Configuração Anti-Spam Atualizada')
            .setColor('#00FF00')
            .addFields(
                { name: '📊 Máximo de Mensagens', value: config.antiSpam.maxMessages.toString(), inline: true },
                { name: '⏰ Janela de Tempo', value: `${config.antiSpam.timeWindow/1000} segundos`, inline: true }
            )
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    },

    async configureActions(interaction, database) {
        const severity = interaction.options.getString('severidade');
        const action = interaction.options.getString('acao');
        const config = await this.getConfig(interaction.guild.id);

        config.actions[severity] = action;
        await this.saveConfig(interaction.guild.id, config);

        const embed = new EmbedBuilder()
            .setTitle('⚙️ Ação Configurada')
            .setColor('#00FF00')
            .setDescription(`Ação para severidade **${severity}** definida como **${action}**.`)
            .addFields(
                { name: '📋 Ações Atuais', value: `Baixa: ${config.actions.low}\nMédia: ${config.actions.medium}\nAlta: ${config.actions.high}`, inline: false }
            )
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    },

    async getConfig(guildId) {
        // Por enquanto, retornar configuração padrão
        // Em uma implementação completa, isso viria do banco de dados
        return {
            enabled: true,
            antiSpam: {
                enabled: true,
                maxMessages: 5,
                timeWindow: 10000
            },
            wordFilter: {
                enabled: true,
                words: ['palavrão1', 'palavrão2', 'spam'],
                severity: 'medium'
            },
            linkFilter: {
                enabled: true,
                allowedDomains: ['discord.com', 'youtube.com', 'github.com'],
                suspiciousDomains: ['bit.ly', 'tinyurl.com']
            },
            capsFilter: {
                enabled: true,
                maxPercentage: 70
            },
            emojiFilter: {
                enabled: true,
                maxEmojis: 5
            },
            actions: {
                low: 'warn',
                medium: 'mute',
                high: 'kick'
            },
            muteDuration: 300000
        };
    },

    async saveConfig(guildId, config) {
        // Por enquanto, apenas log
        // Em uma implementação completa, isso seria salvo no banco de dados
        console.log(`💾 Configuração salva para servidor ${guildId}:`, config);
    }
}; 