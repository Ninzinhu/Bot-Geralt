const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('permissions')
        .setDescription('Verifica e configura permissões do bot')
        .addSubcommand(subcommand =>
            subcommand
                .setName('verificar')
                .setDescription('Verifica as permissões atuais do bot'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('configurar')
                .setDescription('Mostra como configurar as permissões necessárias'))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction, database) {
        try {
            await interaction.deferReply();

            const subcommand = interaction.options.getSubcommand();

            switch (subcommand) {
                case 'verificar':
                    await this.checkPermissions(interaction);
                    break;
                case 'configurar':
                    await this.showSetupGuide(interaction);
                    break;
            }

        } catch (error) {
            console.error('❌ Erro no comando permissions:', error);
            await interaction.editReply({
                content: '❌ Houve um erro ao executar o comando. Tente novamente.',
                ephemeral: true
            });
        }
    },

    async checkPermissions(interaction) {
        const botMember = interaction.guild.members.me;
        const requiredPermissions = [
            PermissionFlagsBits.ManageMessages,
            PermissionFlagsBits.ModerateMembers,
            PermissionFlagsBits.KickMembers,
            PermissionFlagsBits.BanMembers,
            PermissionFlagsBits.ManageRoles,
            PermissionFlagsBits.ViewAuditLog,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.EmbedLinks,
            PermissionFlagsBits.AttachFiles,
            PermissionFlagsBits.ReadMessageHistory
        ];

        const permissionNames = {
            [PermissionFlagsBits.ManageMessages]: 'Gerenciar Mensagens',
            [PermissionFlagsBits.ModerateMembers]: 'Moderar Membros',
            [PermissionFlagsBits.KickMembers]: 'Expulsar Membros',
            [PermissionFlagsBits.BanMembers]: 'Banir Membros',
            [PermissionFlagsBits.ManageRoles]: 'Gerenciar Cargos',
            [PermissionFlagsBits.ViewAuditLog]: 'Ver Registro de Auditoria',
            [PermissionFlagsBits.SendMessages]: 'Enviar Mensagens',
            [PermissionFlagsBits.EmbedLinks]: 'Incorporar Links',
            [PermissionFlagsBits.AttachFiles]: 'Anexar Arquivos',
            [PermissionFlagsBits.ReadMessageHistory]: 'Ver Histórico de Mensagens'
        };

        const missingPermissions = [];
        const hasPermissions = [];

        requiredPermissions.forEach(permission => {
            if (botMember.permissions.has(permission)) {
                hasPermissions.push(permissionNames[permission]);
            } else {
                missingPermissions.push(permissionNames[permission]);
            }
        });

        const embed = new EmbedBuilder()
            .setTitle('🔐 Verificação de Permissões do Bot')
            .setColor(missingPermissions.length === 0 ? '#00FF00' : '#FF0000')
            .setThumbnail(botMember.user.displayAvatarURL())
            .addFields(
                { name: '🤖 Bot', value: botMember.user.tag, inline: true },
                { name: '📊 Status', value: missingPermissions.length === 0 ? '✅ Todas as permissões OK' : '❌ Permissões faltando', inline: true }
            );

        if (hasPermissions.length > 0) {
            embed.addFields({
                name: '✅ Permissões Ativas',
                value: hasPermissions.map(perm => `• ${perm}`).join('\n'),
                inline: false
            });
        }

        if (missingPermissions.length > 0) {
            embed.addFields({
                name: '❌ Permissões Faltando',
                value: missingPermissions.map(perm => `• ${perm}`).join('\n'),
                inline: false
            });
        }

        // Verificar posição do cargo do bot
        const botRole = botMember.roles.highest;
        const adminRole = interaction.member.roles.highest;
        
        embed.addFields({
            name: '🎭 Hierarquia de Cargos',
            value: `**Cargo do Bot:** ${botRole.name} (Posição: ${botRole.position})\n**Seu Cargo:** ${adminRole.name} (Posição: ${adminRole.position})\n\n${botRole.position >= adminRole.position ? '✅ Bot pode moderar você' : '❌ Bot não pode moderar você'}`,
            inline: false
        });

        embed.setTimestamp()
            .setFooter({ text: 'Sistema de Moderação - NihonTech' });

        await interaction.editReply({ embeds: [embed] });
    },

    async showSetupGuide(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('⚙️ Guia de Configuração de Permissões')
            .setColor('#3498DB')
            .setDescription('Siga este guia para configurar corretamente as permissões do bot.')
            .addFields(
                {
                    name: '🔧 Passo 1: Configurar Cargo do Bot',
                    value: '1. Vá em **Configurações do Servidor** → **Cargos**\n2. Crie um cargo chamado "Bot Geralt" ou similar\n3. Posicione o cargo **ACIMA** dos cargos que o bot deve moderar\n4. Atribua este cargo ao bot',
                    inline: false
                },
                {
                    name: '🔐 Passo 2: Configurar Permissões',
                    value: '**Permissões Obrigatórias:**\n• ✅ Gerenciar Mensagens\n• ✅ Moderar Membros\n• ✅ Expulsar Membros\n• ✅ Banir Membros\n• ✅ Gerenciar Cargos\n• ✅ Ver Registro de Auditoria\n• ✅ Enviar Mensagens\n• ✅ Incorporar Links\n• ✅ Anexar Arquivos\n• ✅ Ver Histórico de Mensagens',
                    inline: false
                },
                {
                    name: '📋 Passo 3: Configurar Canais',
                    value: '1. **Canal de Logs:** Configure `LOG_CHANNEL_ID` no .env\n2. **Permissões do Canal:** O bot precisa de acesso ao canal de logs\n3. **Canais de Moderação:** Configure permissões específicas se necessário',
                    inline: false
                },
                {
                    name: '🎯 Passo 4: Testar Configuração',
                    value: 'Use `/permissions verificar` para confirmar que tudo está funcionando corretamente.',
                    inline: false
                },
                {
                    name: '⚠️ Importante',
                    value: '• O cargo do bot deve estar **ACIMA** dos cargos que ele deve moderar\n• O bot não pode moderar usuários com cargos iguais ou superiores\n• Configure o canal de logs para acompanhar as ações automáticas',
                    inline: false
                }
            )
            .setTimestamp()
            .setFooter({ text: 'Sistema de Moderação - NihonTech' });

        await interaction.editReply({ embeds: [embed] });
    }
}; 