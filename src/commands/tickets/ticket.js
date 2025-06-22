const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Sistema de tickets de suporte')
        .addSubcommand(subcommand =>
            subcommand
                .setName('criar')
                .setDescription('Cria um novo ticket de suporte')
                .addStringOption(option =>
                    option.setName('assunto')
                        .setDescription('Assunto do ticket')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('prioridade')
                        .setDescription('Prioridade do ticket')
                        .setRequired(false)
                        .addChoices(
                            { name: 'Baixa', value: 'low' },
                            { name: 'Média', value: 'medium' },
                            { name: 'Alta', value: 'high' },
                            { name: 'Urgente', value: 'urgent' }
                        )))
        .addSubcommand(subcommand =>
            subcommand
                .setName('listar')
                .setDescription('Lista todos os tickets')
                .addStringOption(option =>
                    option.setName('status')
                        .setDescription('Filtrar por status')
                        .setRequired(false)
                        .addChoices(
                            { name: 'Abertos', value: 'open' },
                            { name: 'Fechados', value: 'closed' }
                        )))
        .addSubcommand(subcommand =>
            subcommand
                .setName('fechar')
                .setDescription('Fecha um ticket')
                .addStringOption(option =>
                    option.setName('canal')
                        .setDescription('ID do canal do ticket')
                        .setRequired(true)))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction, database) {
        try {
            const subcommand = interaction.options.getSubcommand();

            switch (subcommand) {
                case 'criar':
                    await this.createTicket(interaction, database);
                    break;
                case 'listar':
                    await this.listTickets(interaction, database);
                    break;
                case 'fechar':
                    await this.closeTicket(interaction, database);
                    break;
            }
        } catch (error) {
            console.error('❌ Erro no comando ticket:', error);
            await interaction.reply({
                content: '❌ Houve um erro ao executar o comando.',
                ephemeral: true
            });
        }
    },

    async createTicket(interaction, database) {
        await interaction.deferReply({ ephemeral: true });

        const subject = interaction.options.getString('assunto');
        const priority = interaction.options.getString('prioridade') || 'medium';

        try {
            // Criar canal do ticket
            const channel = await interaction.guild.channels.create({
                name: `ticket-${interaction.user.username}`,
                type: ChannelType.GuildText,
                parent: process.env.TICKET_CATEGORY_ID, // Categoria para tickets (opcional)
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: interaction.user.id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                    },
                    {
                        id: process.env.STAFF_ROLE_ID, // Role da staff (opcional)
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                    },
                ],
            });

            // Registrar ticket no banco de dados
            const ticketId = await database.createTicket(
                channel.id,
                interaction.user.id,
                interaction.user.tag,
                subject,
                priority
            );

            // Adicionar primeira mensagem
            await database.addTicketMessage(
                ticketId,
                interaction.user.id,
                interaction.user.tag,
                `Ticket criado: ${subject}`,
                false
            );

            // Criar embed do ticket
            const priorityEmoji = {
                'low': '🟢',
                'medium': '🟡',
                'high': '🟠',
                'urgent': '🔴'
            };

            const priorityName = {
                'low': 'Baixa',
                'medium': 'Média',
                'high': 'Alta',
                'urgent': 'Urgente'
            };

            const embed = new EmbedBuilder()
                .setTitle('🎫 Ticket de Suporte')
                .setColor('#0099FF')
                .setDescription(`**Assunto:** ${subject}`)
                .addFields(
                    { name: '👤 Criado por', value: interaction.user.tag, inline: true },
                    { name: '🆔 Ticket ID', value: `#${ticketId}`, inline: true },
                    { name: '⚡ Prioridade', value: `${priorityEmoji[priority]} ${priorityName[priority]}`, inline: true },
                    { name: '📅 Criado em', value: new Date().toLocaleString('pt-BR'), inline: true }
                )
                .setTimestamp()
                .setFooter({ text: 'Bot Geralt - Sistema de Tickets' });

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('close_ticket')
                        .setLabel('🔒 Fechar Ticket')
                        .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setCustomId('claim_ticket')
                        .setLabel('✋ Assumir Ticket')
                        .setStyle(ButtonStyle.Primary)
                );

            await channel.send({ embeds: [embed], components: [row] });

            // Responder ao usuário
            const responseEmbed = new EmbedBuilder()
                .setTitle('✅ Ticket Criado!')
                .setColor('#00FF00')
                .setDescription(`Seu ticket foi criado com sucesso!`)
                .addFields(
                    { name: '📝 Assunto', value: subject, inline: true },
                    { name: '🆔 Ticket ID', value: `#${ticketId}`, inline: true },
                    { name: '📺 Canal', value: `<#${channel.id}>`, inline: true }
                )
                .setTimestamp();

            await interaction.editReply({ embeds: [responseEmbed] });

        } catch (error) {
            console.error('❌ Erro ao criar ticket:', error);
            await interaction.editReply({
                content: '❌ Houve um erro ao criar o ticket. Tente novamente.',
                ephemeral: true
            });
        }
    },

    async listTickets(interaction, database) {
        await interaction.deferReply({ ephemeral: true });

        const status = interaction.options.getString('status');
        const tickets = await database.getTickets(status);

        if (tickets.length === 0) {
            await interaction.editReply({
                content: '🎫 Nenhum ticket encontrado.',
                ephemeral: true
            });
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle('🎫 Lista de Tickets')
            .setColor('#0099FF')
            .setDescription(`Total de tickets: **${tickets.length}**`)
            .setTimestamp();

        tickets.slice(0, 10).forEach(ticket => {
            const statusEmoji = ticket.status === 'open' ? '🟢' : '🔴';
            const priorityEmoji = {
                'low': '🟢',
                'medium': '🟡',
                'high': '🟠',
                'urgent': '🔴'
            };

            const date = new Date(ticket.created_at).toLocaleDateString('pt-BR');

            embed.addFields({
                name: `${statusEmoji} Ticket #${ticket.id}`,
                value: `👤 **${ticket.user_name}**\n📝 ${ticket.subject}\n⚡ ${priorityEmoji[ticket.priority]} ${ticket.priority}\n📅 ${date}\n📺 <#${ticket.channel_id}>`,
                inline: true
            });
        });

        if (tickets.length > 10) {
            embed.setFooter({ text: `Mostrando 10 de ${tickets.length} tickets` });
        }

        await interaction.editReply({ embeds: [embed] });
    },

    async closeTicket(interaction, database) {
        await interaction.deferReply({ ephemeral: true });

        const channelId = interaction.options.getString('canal');

        try {
            const ticket = await database.getTicket(channelId);
            if (!ticket) {
                await interaction.editReply({
                    content: '❌ Ticket não encontrado.',
                    ephemeral: true
                });
                return;
            }

            if (ticket.status === 'closed') {
                await interaction.editReply({
                    content: '❌ Este ticket já está fechado.',
                    ephemeral: true
                });
                return;
            }

            // Fechar ticket no banco de dados
            await database.closeTicket(channelId);

            // Adicionar mensagem de fechamento
            await database.addTicketMessage(
                ticket.id,
                interaction.user.id,
                interaction.user.tag,
                'Ticket fechado pela staff.',
                true
            );

            // Enviar mensagem no canal do ticket
            const channel = interaction.guild.channels.cache.get(channelId);
            if (channel) {
                const closeEmbed = new EmbedBuilder()
                    .setTitle('🔒 Ticket Fechado')
                    .setColor('#FF0000')
                    .setDescription('Este ticket foi fechado pela staff.')
                    .setTimestamp()
                    .setFooter({ text: `Fechado por ${interaction.user.tag}` });

                await channel.send({ embeds: [closeEmbed] });

                // Deletar canal após 5 segundos
                setTimeout(async () => {
                    try {
                        await channel.delete();
                    } catch (error) {
                        console.error('❌ Erro ao deletar canal:', error);
                    }
                }, 5000);
            }

            const responseEmbed = new EmbedBuilder()
                .setTitle('✅ Ticket Fechado!')
                .setColor('#00FF00')
                .setDescription(`Ticket #${ticket.id} foi fechado com sucesso!`)
                .addFields(
                    { name: '👤 Cliente', value: ticket.user_name, inline: true },
                    { name: '📝 Assunto', value: ticket.subject, inline: true },
                    { name: '🔒 Status', value: 'Fechado', inline: true }
                )
                .setTimestamp()
                .setFooter({ text: `Fechado por ${interaction.user.tag}` });

            await interaction.editReply({ embeds: [responseEmbed] });

        } catch (error) {
            console.error('❌ Erro ao fechar ticket:', error);
            await interaction.editReply({
                content: '❌ Houve um erro ao fechar o ticket.',
                ephemeral: true
            });
        }
    },
}; 