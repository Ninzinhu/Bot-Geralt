const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Expulsa um usuário do servidor')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuário a ser expulso')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('motivo')
                .setDescription('Motivo da expulsão')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    async execute(interaction, database) {
        try {
            await interaction.deferReply();

            const targetUser = interaction.options.getUser('usuario');
            const targetMember = interaction.options.getMember('usuario');
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
                    content: '❌ Você não pode expulsar a si mesmo.',
                    ephemeral: true
                });
            }

            if (targetMember.id === interaction.client.user.id) {
                return interaction.editReply({
                    content: '❌ Você não pode expulsar o bot.',
                    ephemeral: true
                });
            }

            if (!targetMember.kickable) {
                return interaction.editReply({
                    content: '❌ Não posso expulsar este usuário. Verifique se tenho permissões suficientes.',
                    ephemeral: true
                });
            }

            if (interaction.member.roles.highest.position <= targetMember.roles.highest.position) {
                return interaction.editReply({
                    content: '❌ Você não pode expulsar alguém com cargo igual ou superior ao seu.',
                    ephemeral: true
                });
            }

            // Executar kick
            await targetMember.kick(`${reason} | Expulso por ${interaction.user.tag}`);

            // Embed de confirmação
            const kickEmbed = new EmbedBuilder()
                .setTitle('👢 Usuário Expulso')
                .setColor('#FFA500')
                .setThumbnail(targetUser.displayAvatarURL())
                .addFields(
                    { name: '👤 Usuário', value: `${targetUser.tag} (${targetUser.id})`, inline: true },
                    { name: '🛡️ Expulso por', value: interaction.user.tag, inline: true },
                    { name: '📅 Data', value: new Date().toLocaleString('pt-BR'), inline: true },
                    { name: '📝 Motivo', value: reason, inline: false }
                )
                .setTimestamp()
                .setFooter({ text: 'Sistema de Moderação - NihonTech' });

            await interaction.editReply({ embeds: [kickEmbed] });

            // Log da ação
            const logChannelId = process.env.LOG_CHANNEL_ID;
            if (logChannelId) {
                const logChannel = interaction.guild.channels.cache.get(logChannelId);
                if (logChannel) {
                    const logEmbed = new EmbedBuilder()
                        .setTitle('📋 Log de Moderação - Expulsão')
                        .setColor('#FFA500')
                        .addFields(
                            { name: '👤 Usuário Expulso', value: `${targetUser.tag} (${targetUser.id})`, inline: true },
                            { name: '🛡️ Moderador', value: interaction.user.tag, inline: true },
                            { name: '📝 Motivo', value: reason, inline: false },
                            { name: '📍 Canal', value: interaction.channel.name, inline: true }
                        )
                        .setTimestamp();

                    await logChannel.send({ embeds: [logEmbed] });
                }
            }

        } catch (error) {
            console.error('❌ Erro ao expulsar usuário:', error);
            await interaction.editReply({
                content: '❌ Houve um erro ao expulsar o usuário. Verifique as permissões e tente novamente.',
                ephemeral: true
            });
        }
    },
}; 