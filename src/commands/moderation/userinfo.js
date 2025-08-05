const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { canExecuteModeration, getPermissionError } = require('../../utils/permissions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Mostra informações detalhadas de um usuário')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuário para ver informações')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        try {
            await interaction.deferReply();

            // Verificar permissão de moderação
            if (!canExecuteModeration(interaction.member)) {
                return await interaction.editReply({
                    content: getPermissionError('userinfo', 'Administrador ou Moderador'),
                    ephemeral: true
                });
            }

            const targetUser = interaction.options.getUser('usuario') || interaction.user;
            const targetMember = interaction.options.getMember('usuario') || interaction.member;

            // Informações básicas do usuário
            const userEmbed = new EmbedBuilder()
                .setTitle('👤 Informações do Usuário')
                .setColor('#0099FF')
                .setThumbnail(targetUser.displayAvatarURL({ dynamic: true, size: 256 }))
                .addFields(
                    { name: '📝 Nome', value: targetUser.tag, inline: true },
                    { name: '🆔 ID', value: targetUser.id, inline: true },
                    { name: '📅 Conta Criada', value: `<t:${Math.floor(targetUser.createdTimestamp / 1000)}:F>`, inline: true }
                );

            // Informações do servidor (se o usuário estiver no servidor)
            if (targetMember) {
                const joinedAt = targetMember.joinedAt;
                const roles = targetMember.roles.cache
                    .filter(role => role.id !== interaction.guild.id)
                    .sort((a, b) => b.position - a.position)
                    .map(role => role.toString())
                    .slice(0, 10);

                userEmbed.addFields(
                    { name: '📥 Entrou no Servidor', value: joinedAt ? `<t:${Math.floor(joinedAt.getTime() / 1000)}:F>` : 'Desconhecido', inline: true },
                    { name: '🎭 Cargo Principal', value: targetMember.roles.highest.toString(), inline: true },
                    { name: '🎨 Cor do Cargo', value: targetMember.displayHexColor, inline: true },
                    { name: '📊 Cargos', value: roles.length > 0 ? roles.join(', ') : 'Nenhum cargo', inline: false }
                );

                // Status e atividades
                const status = {
                    'online': '🟢 Online',
                    'idle': '🟡 Ausente',
                    'dnd': '🔴 Não Perturbe',
                    'offline': '⚫ Offline'
                };

                userEmbed.addFields(
                    { name: '📡 Status', value: status[targetMember.presence?.status || 'offline'], inline: true }
                );

                // Verificar se está silenciado
                if (targetMember.isCommunicationDisabled()) {
                    const timeoutEnd = targetMember.communicationDisabledUntil;
                    userEmbed.addFields({
                        name: '🔇 Silenciado Até',
                        value: `<t:${Math.floor(timeoutEnd.getTime() / 1000)}:F>`,
                        inline: true
                    });
                }

                // Permissões importantes
                const permissions = [];
                if (targetMember.permissions.has(PermissionFlagsBits.Administrator)) permissions.push('👑 Administrador');
                if (targetMember.permissions.has(PermissionFlagsBits.ManageGuild)) permissions.push('⚙️ Gerenciar Servidor');
                if (targetMember.permissions.has(PermissionFlagsBits.ManageChannels)) permissions.push('📝 Gerenciar Canais');
                if (targetMember.permissions.has(PermissionFlagsBits.ManageRoles)) permissions.push('🎭 Gerenciar Cargos');
                if (targetMember.permissions.has(PermissionFlagsBits.BanMembers)) permissions.push('🔨 Banir Membros');
                if (targetMember.permissions.has(PermissionFlagsBits.KickMembers)) permissions.push('👢 Expulsar Membros');
                if (targetMember.permissions.has(PermissionFlagsBits.ModerateMembers)) permissions.push('🛡️ Moderar Membros');

                if (permissions.length > 0) {
                    userEmbed.addFields({
                        name: '🔑 Permissões Importantes',
                        value: permissions.join('\n'),
                        inline: false
                    });
                }
            }

            // Badges do Discord
            const flags = targetUser.flags?.toArray() || [];
            const badges = {
                'BugHunterLevel1': '🐛 Bug Hunter',
                'BugHunterLevel2': '🐛 Bug Hunter Gold',
                'CertifiedModerator': '👮 Moderador Discord',
                'HypeSquadOnlineHouse1': '🏠 House Bravery',
                'HypeSquadOnlineHouse2': '🏠 House Brilliance',
                'HypeSquadOnlineHouse3': '🏠 House Balance',
                'Hypesquad': '💎 HypeSquad Events',
                'Partner': '🤝 Partner',
                'PremiumEarlySupporter': '👑 Early Supporter',
                'Staff': '👨‍💼 Discord Staff',
                'VerifiedBot': '🤖 Bot Verificado',
                'VerifiedDeveloper': '👨‍💻 Bot Developer'
            };

            const userBadges = flags.map(flag => badges[flag]).filter(Boolean);
            if (userBadges.length > 0) {
                userEmbed.addFields({
                    name: '🏆 Badges',
                    value: userBadges.join('\n'),
                    inline: false
                });
            }

            userEmbed.setTimestamp()
                .setFooter({ text: 'Sistema de Moderação - NihonTech' });

            await interaction.editReply({ embeds: [userEmbed] });

        } catch (error) {
            console.error('❌ Erro ao buscar informações do usuário:', error);
            await interaction.editReply({
                content: '❌ Houve um erro ao buscar as informações do usuário.',
                ephemeral: true
            });
        }
    },
}; 