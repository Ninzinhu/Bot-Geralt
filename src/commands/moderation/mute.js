const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { canExecuteModeration, getPermissionError } = require('../../utils/permissions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Silencia um usuário temporariamente')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuário a ser silenciado')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('duracao')
                .setDescription('Duração do silenciamento')
                .setRequired(true)
                .addChoices(
                    { name: '30 segundos', value: '30s' },
                    { name: '1 minuto', value: '1m' },
                    { name: '5 minutos', value: '5m' },
                    { name: '10 minutos', value: '10m' },
                    { name: '30 minutos', value: '30m' },
                    { name: '1 hora', value: '1h' },
                    { name: '6 horas', value: '6h' },
                    { name: '12 horas', value: '12h' },
                    { name: '1 dia', value: '1d' },
                    { name: '1 semana', value: '1w' }
                ))
        .addStringOption(option =>
            option.setName('motivo')
                .setDescription('Motivo do silenciamento')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction, database) {
        try {
            await interaction.deferReply();

            // Verificar permissão de moderação
            if (!canExecuteModeration(interaction.member)) {
                return await interaction.editReply({
                    content: getPermissionError('mute', 'Administrador ou Moderador'),
                    ephemeral: true
                });
            }

            const targetUser = interaction.options.getUser('usuario');
            const targetMember = interaction.options.getMember('usuario');
            const duration = interaction.options.getString('duracao');
            const reason = interaction.options.getString('motivo') || 'Nenhum motivo fornecido';

            // Verificações
            if (!targetMember) {
                return interaction.editReply({
                    content: '❌ Este usuário não está no servidor.',
                    ephemeral: true
                });
            }

            if (targetMember.id === interaction.user.id) {
                return interaction.editReply({
                    content: '❌ Você não pode silenciar a si mesmo.',
                    ephemeral: true
                });
            }

            if (targetMember.id === interaction.client.user.id) {
                return interaction.editReply({
                    content: '❌ Você não pode silenciar o bot.',
                    ephemeral: true
                });
            }

            if (!targetMember.moderatable) {
                return interaction.editReply({
                    content: '❌ Não posso silenciar este usuário. Verifique se tenho permissões suficientes.',
                    ephemeral: true
                });
            }

            if (interaction.member.roles.highest.position <= targetMember.roles.highest.position) {
                return interaction.editReply({
                    content: '❌ Você não pode silenciar alguém com cargo igual ou superior ao seu.',
                    ephemeral: true
                });
            }

            // Converter duração para milissegundos
            const durationMs = this.parseDuration(duration);
            if (!durationMs) {
                return interaction.editReply({
                    content: '❌ Duração inválida.',
                    ephemeral: true
                });
            }

            // Executar timeout
            await targetMember.timeout(durationMs, `${reason} | Silenciado por ${interaction.user.tag}`);

            // Embed de confirmação
            const muteEmbed = new EmbedBuilder()
                .setTitle('🔇 Usuário Silenciado')
                .setColor('#FFA500')
                .setThumbnail(targetUser.displayAvatarURL())
                .addFields(
                    { name: '👤 Usuário', value: `${targetUser.tag} (${targetUser.id})`, inline: true },
                    { name: '🛡️ Silenciado por', value: interaction.user.tag, inline: true },
                    { name: '⏰ Duração', value: this.formatDuration(durationMs), inline: true },
                    { name: '📅 Data', value: new Date().toLocaleString('pt-BR'), inline: true },
                    { name: '📝 Motivo', value: reason, inline: false }
                )
                .setTimestamp()
                .setFooter({ text: 'Sistema de Moderação - NihonTech' });

            await interaction.editReply({ embeds: [muteEmbed] });

            // Log da ação
            const logChannelId = process.env.LOG_CHANNEL_ID;
            if (logChannelId) {
                const logChannel = interaction.guild.channels.cache.get(logChannelId);
                if (logChannel) {
                    const logEmbed = new EmbedBuilder()
                        .setTitle('📋 Log de Moderação - Silenciamento')
                        .setColor('#FFA500')
                        .addFields(
                            { name: '👤 Usuário Silenciado', value: `${targetUser.tag} (${targetUser.id})`, inline: true },
                            { name: '🛡️ Moderador', value: interaction.user.tag, inline: true },
                            { name: '⏰ Duração', value: this.formatDuration(durationMs), inline: true },
                            { name: '📝 Motivo', value: reason, inline: false },
                            { name: '📍 Canal', value: interaction.channel.name, inline: true }
                        )
                        .setTimestamp();

                    await logChannel.send({ embeds: [logEmbed] });
                }
            }

        } catch (error) {
            console.error('❌ Erro ao silenciar usuário:', error);
            await interaction.editReply({
                content: '❌ Houve um erro ao silenciar o usuário. Verifique as permissões e tente novamente.',
                ephemeral: true
            });
        }
    },

    parseDuration(duration) {
        const unit = duration.slice(-1);
        const value = parseInt(duration.slice(0, -1));
        
        switch (unit) {
            case 's': return value * 1000;
            case 'm': return value * 60 * 1000;
            case 'h': return value * 60 * 60 * 1000;
            case 'd': return value * 24 * 60 * 60 * 1000;
            case 'w': return value * 7 * 24 * 60 * 60 * 1000;
            default: return null;
        }
    },

    formatDuration(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days} dia(s)`;
        if (hours > 0) return `${hours} hora(s)`;
        if (minutes > 0) return `${minutes} minuto(s)`;
        return `${seconds} segundo(s)`;
    },
}; 