const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { canExecuteModeration, getPermissionError } = require('../../utils/permissions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bane um usuário do servidor')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuário a ser banido')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('motivo')
                .setDescription('Motivo do banimento')
                .setRequired(false))
        .addIntegerOption(option =>
            option.setName('dias')
                .setDescription('Número de dias de mensagens para deletar (0-7)')
                .setRequired(false)
                .setMinValue(0)
                .setMaxValue(7))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction, database) {
        try {
            await interaction.deferReply();

            // Verificar permissão de moderação
            if (!canExecuteModeration(interaction.member)) {
                return await interaction.editReply({
                    content: getPermissionError('ban', 'Administrador ou Moderador'),
                    ephemeral: true
                });
            }

            const targetUser = interaction.options.getUser('usuario');
            const targetMember = interaction.options.getMember('usuario');
            const reason = interaction.options.getString('motivo') || 'Nenhum motivo fornecido';
            const deleteMessageDays = interaction.options.getInteger('dias') || 0;

            // Verificações
            if (!targetMember) {
                return interaction.editReply({
                    content: '❌ Este usuário não está no servidor.',
                    ephemeral: true
                });
            }

            if (targetMember.id === interaction.user.id) {
                return interaction.editReply({
                    content: '❌ Você não pode banir a si mesmo.',
                    ephemeral: true
                });
            }

            if (targetMember.id === interaction.client.user.id) {
                return interaction.editReply({
                    content: '❌ Você não pode banir o bot.',
                    ephemeral: true
                });
            }

            if (!targetMember.bannable) {
                return interaction.editReply({
                    content: '❌ Não posso banir este usuário. Verifique se tenho permissões suficientes.',
                    ephemeral: true
                });
            }

            if (interaction.member.roles.highest.position <= targetMember.roles.highest.position) {
                return interaction.editReply({
                    content: '❌ Você não pode banir alguém com cargo igual ou superior ao seu.',
                    ephemeral: true
                });
            }

            // Executar banimento
            await targetMember.ban({
                deleteMessageDays: deleteMessageDays,
                reason: `${reason} | Banido por ${interaction.user.tag}`
            });

            // Embed de confirmação
            const banEmbed = new EmbedBuilder()
                .setTitle('🔨 Usuário Banido')
                .setColor('#FF0000')
                .setThumbnail(targetUser.displayAvatarURL())
                .addFields(
                    { name: '👤 Usuário', value: `${targetUser.tag} (${targetUser.id})`, inline: true },
                    { name: '🛡️ Banido por', value: interaction.user.tag, inline: true },
                    { name: '📅 Data', value: new Date().toLocaleString('pt-BR'), inline: true },
                    { name: '🗑️ Mensagens Deletadas', value: `${deleteMessageDays} dias`, inline: true },
                    { name: '📝 Motivo', value: reason, inline: false }
                )
                .setTimestamp()
                .setFooter({ text: 'Sistema de Moderação - NihonTech' });

            await interaction.editReply({ embeds: [banEmbed] });

            // Log da ação (se canal de logs configurado)
            const logChannelId = process.env.LOG_CHANNEL_ID;
            if (logChannelId) {
                const logChannel = interaction.guild.channels.cache.get(logChannelId);
                if (logChannel) {
                    const logEmbed = new EmbedBuilder()
                        .setTitle('📋 Log de Moderação - Banimento')
                        .setColor('#FF0000')
                        .addFields(
                            { name: '👤 Usuário Banido', value: `${targetUser.tag} (${targetUser.id})`, inline: true },
                            { name: '🛡️ Moderador', value: interaction.user.tag, inline: true },
                            { name: '📝 Motivo', value: reason, inline: false },
                            { name: '📍 Canal', value: interaction.channel.name, inline: true },
                            { name: '🗑️ Mensagens Deletadas', value: `${deleteMessageDays} dias`, inline: true }
                        )
                        .setTimestamp();

                    await logChannel.send({ embeds: [logEmbed] });
                }
            }

        } catch (error) {
            console.error('❌ Erro ao banir usuário:', error);
            await interaction.editReply({
                content: '❌ Houve um erro ao banir o usuário. Verifique as permissões e tente novamente.',
                ephemeral: true
            });
        }
    },
}; 