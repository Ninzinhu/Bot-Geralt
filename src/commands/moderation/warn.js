const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Gerencia avisos de usuários')
        .addSubcommand(subcommand =>
            subcommand
                .setName('adicionar')
                .setDescription('Adiciona um aviso a um usuário')
                .addUserOption(option =>
                    option.setName('usuario')
                        .setDescription('Usuário a ser avisado')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('motivo')
                        .setDescription('Motivo do aviso')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('listar')
                .setDescription('Lista avisos de um usuário')
                .addUserOption(option =>
                    option.setName('usuario')
                        .setDescription('Usuário para ver avisos')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remover')
                .setDescription('Remove um aviso específico')
                .addStringOption(option =>
                    option.setName('id')
                        .setDescription('ID do aviso a ser removido')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('limpar')
                .setDescription('Remove todos os avisos de um usuário')
                .addUserOption(option =>
                    option.setName('usuario')
                        .setDescription('Usuário para limpar avisos')
                        .setRequired(true)))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction, database) {
        try {
            await interaction.deferReply();

            const subcommand = interaction.options.getSubcommand();

            switch (subcommand) {
                case 'adicionar':
                    await this.addWarn(interaction, database);
                    break;
                case 'listar':
                    await this.listWarns(interaction, database);
                    break;
                case 'remover':
                    await this.removeWarn(interaction, database);
                    break;
                case 'limpar':
                    await this.clearWarns(interaction, database);
                    break;
            }

        } catch (error) {
            console.error('❌ Erro no comando warn:', error);
            await interaction.editReply({
                content: '❌ Houve um erro ao executar o comando. Tente novamente.',
                ephemeral: true
            });
        }
    },

    async addWarn(interaction, database) {
        const targetUser = interaction.options.getUser('usuario');
        const targetMember = interaction.options.getMember('usuario');
        const reason = interaction.options.getString('motivo');

        // Verificações
        if (!targetMember) {
            return interaction.editReply({
                content: '❌ Este usuário não está no servidor.',
                ephemeral: true
            });
        }

        if (targetMember.id === interaction.user.id) {
            return interaction.editReply({
                content: '❌ Você não pode avisar a si mesmo.',
                ephemeral: true
            });
        }

        if (targetMember.id === interaction.client.user.id) {
            return interaction.editReply({
                content: '❌ Você não pode avisar o bot.',
                ephemeral: true
            });
        }

        if (interaction.member.roles.highest.position <= targetMember.roles.highest.position) {
            return interaction.editReply({
                content: '❌ Você não pode avisar alguém com cargo igual ou superior ao seu.',
                ephemeral: true
            });
        }

        // Adicionar aviso (simulado por enquanto)
        const warnId = `warn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Embed de confirmação
        const warnEmbed = new EmbedBuilder()
            .setTitle('⚠️ Aviso Adicionado')
            .setColor('#FFA500')
            .setThumbnail(targetUser.displayAvatarURL())
            .addFields(
                { name: '👤 Usuário', value: `${targetUser.tag} (${targetUser.id})`, inline: true },
                { name: '🛡️ Avisado por', value: interaction.user.tag, inline: true },
                { name: '📅 Data', value: new Date().toLocaleString('pt-BR'), inline: true },
                { name: '📝 Motivo', value: reason, inline: false },
                { name: '🆔 ID do Aviso', value: warnId, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'Sistema de Moderação - NihonTech' });

        await interaction.editReply({ embeds: [warnEmbed] });

        // Log da ação
        const logChannelId = process.env.LOG_CHANNEL_ID;
        if (logChannelId) {
            const logChannel = interaction.guild.channels.cache.get(logChannelId);
            if (logChannel) {
                const logEmbed = new EmbedBuilder()
                    .setTitle('📋 Log de Moderação - Aviso')
                    .setColor('#FFA500')
                    .addFields(
                        { name: '👤 Usuário Avisado', value: `${targetUser.tag} (${targetUser.id})`, inline: true },
                        { name: '🛡️ Moderador', value: interaction.user.tag, inline: true },
                        { name: '📝 Motivo', value: reason, inline: false },
                        { name: '📍 Canal', value: interaction.channel.name, inline: true }
                    )
                    .setTimestamp();

                await logChannel.send({ embeds: [logEmbed] });
            }
        }

        // Notificar o usuário
        try {
            const userEmbed = new EmbedBuilder()
                .setTitle('⚠️ Você Recebeu um Aviso')
                .setColor('#FFA500')
                .setDescription(`Você recebeu um aviso no servidor **${interaction.guild.name}**.`)
                .addFields(
                    { name: '🛡️ Moderador', value: interaction.user.tag, inline: true },
                    { name: '📅 Data', value: new Date().toLocaleString('pt-BR'), inline: true },
                    { name: '📝 Motivo', value: reason, inline: false }
                )
                .setTimestamp()
                .setFooter({ text: 'Sistema de Moderação - NihonTech' });

            await targetUser.send({ embeds: [userEmbed] });
        } catch (error) {
            // Usuário tem DMs bloqueadas
        }
    },

    async listWarns(interaction, database) {
        const targetUser = interaction.options.getUser('usuario');

        // Simular lista de avisos (em implementação real, viria do banco)
        const warns = [
            {
                id: 'warn_1234567890_abc123',
                reason: 'Spam no chat',
                moderator: 'Moderador#1234',
                date: new Date(Date.now() - 86400000) // 1 dia atrás
            },
            {
                id: 'warn_1234567891_def456',
                reason: 'Linguagem inadequada',
                moderator: 'Admin#5678',
                date: new Date(Date.now() - 172800000) // 2 dias atrás
            }
        ];

        if (warns.length === 0) {
            return interaction.editReply({
                content: `✅ ${targetUser.tag} não possui avisos.`,
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setTitle(`📋 Avisos de ${targetUser.tag}`)
            .setColor('#3498DB')
            .setThumbnail(targetUser.displayAvatarURL())
            .setDescription(`Total de avisos: **${warns.length}**`)
            .setTimestamp();

        warns.forEach((warn, index) => {
            embed.addFields({
                name: `⚠️ Aviso #${index + 1}`,
                value: `**ID:** ${warn.id}\n**Motivo:** ${warn.reason}\n**Moderador:** ${warn.moderator}\n**Data:** ${warn.date.toLocaleString('pt-BR')}`,
                inline: false
            });
        });

        await interaction.editReply({ embeds: [embed] });
    },

    async removeWarn(interaction, database) {
        const warnId = interaction.options.getString('id');

        // Simular remoção de aviso
        const embed = new EmbedBuilder()
            .setTitle('✅ Aviso Removido')
            .setColor('#00FF00')
            .setDescription(`O aviso **${warnId}** foi removido com sucesso.`)
            .addFields(
                { name: '🛡️ Removido por', value: interaction.user.tag, inline: true },
                { name: '📅 Data', value: new Date().toLocaleString('pt-BR'), inline: true }
            )
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });

        // Log da ação
        const logChannelId = process.env.LOG_CHANNEL_ID;
        if (logChannelId) {
            const logChannel = interaction.guild.channels.cache.get(logChannelId);
            if (logChannel) {
                const logEmbed = new EmbedBuilder()
                    .setTitle('📋 Log de Moderação - Aviso Removido')
                    .setColor('#00FF00')
                    .addFields(
                        { name: '🆔 ID do Aviso', value: warnId, inline: true },
                        { name: '🛡️ Moderador', value: interaction.user.tag, inline: true },
                        { name: '📍 Canal', value: interaction.channel.name, inline: true }
                    )
                    .setTimestamp();

                await logChannel.send({ embeds: [logEmbed] });
            }
        }
    },

    async clearWarns(interaction, database) {
        const targetUser = interaction.options.getUser('usuario');
        const targetMember = interaction.options.getMember('usuario');

        // Verificações
        if (!targetMember) {
            return interaction.editReply({
                content: '❌ Este usuário não está no servidor.',
                ephemeral: true
            });
        }

        if (interaction.member.roles.highest.position <= targetMember.roles.highest.position) {
            return interaction.editReply({
                content: '❌ Você não pode limpar avisos de alguém com cargo igual ou superior ao seu.',
                ephemeral: true
            });
        }

        // Simular limpeza de avisos
        const embed = new EmbedBuilder()
            .setTitle('🧹 Avisos Limpos')
            .setColor('#00FF00')
            .setThumbnail(targetUser.displayAvatarURL())
            .setDescription(`Todos os avisos de **${targetUser.tag}** foram removidos.`)
            .addFields(
                { name: '👤 Usuário', value: `${targetUser.tag} (${targetUser.id})`, inline: true },
                { name: '🛡️ Limpo por', value: interaction.user.tag, inline: true },
                { name: '📅 Data', value: new Date().toLocaleString('pt-BR'), inline: true }
            )
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });

        // Log da ação
        const logChannelId = process.env.LOG_CHANNEL_ID;
        if (logChannelId) {
            const logChannel = interaction.guild.channels.cache.get(logChannelId);
            if (logChannel) {
                const logEmbed = new EmbedBuilder()
                    .setTitle('📋 Log de Moderação - Avisos Limpos')
                    .setColor('#00FF00')
                    .addFields(
                        { name: '👤 Usuário', value: `${targetUser.tag} (${targetUser.id})`, inline: true },
                        { name: '🛡️ Moderador', value: interaction.user.tag, inline: true },
                        { name: '📍 Canal', value: interaction.channel.name, inline: true }
                    )
                    .setTimestamp();

                await logChannel.send({ embeds: [logEmbed] });
            }
        }
    }
}; 