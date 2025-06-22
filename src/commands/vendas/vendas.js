const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const moment = require('moment');
moment.locale('pt-br');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vendas')
        .setDescription('Visualiza vendas e relatórios')
        .addSubcommand(subcommand =>
            subcommand
                .setName('recentes')
                .setDescription('Mostra as vendas mais recentes')
                .addIntegerOption(option =>
                    option.setName('limite')
                        .setDescription('Número de vendas para mostrar (máx: 10)')
                        .setRequired(false)
                        .setMinValue(1)
                        .setMaxValue(10)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('relatorio')
                .setDescription('Gera relatório de vendas')
                .addStringOption(option =>
                    option.setName('periodo')
                        .setDescription('Período do relatório')
                        .setRequired(false)
                        .addChoices(
                            { name: 'Hoje', value: 'today' },
                            { name: 'Última semana', value: 'week' },
                            { name: 'Último mês', value: 'month' },
                            { name: 'Todos', value: 'all' }
                        )))
        .addSubcommand(subcommand =>
            subcommand
                .setName('status')
                .setDescription('Atualiza status de uma venda')
                .addIntegerOption(option =>
                    option.setName('id')
                        .setDescription('ID da venda')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('status')
                        .setDescription('Novo status')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Pendente', value: 'pending' },
                            { name: 'Aprovada', value: 'approved' },
                            { name: 'Cancelada', value: 'cancelled' },
                            { name: 'Reembolsada', value: 'refunded' }
                        )))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction, database) {
        try {
            const subcommand = interaction.options.getSubcommand();

            switch (subcommand) {
                case 'recentes':
                    await this.showRecentSales(interaction, database);
                    break;
                case 'relatorio':
                    await this.generateReport(interaction, database);
                    break;
                case 'status':
                    await this.updateSaleStatus(interaction, database);
                    break;
            }
        } catch (error) {
            console.error('❌ Erro no comando vendas:', error);
            await interaction.reply({
                content: '❌ Houve um erro ao executar o comando.',
                ephemeral: true
            });
        }
    },

    async showRecentSales(interaction, database) {
        await interaction.deferReply({ ephemeral: true });

        const limit = interaction.options.getInteger('limite') || 5;
        const sales = await database.getSales();

        if (sales.length === 0) {
            await interaction.editReply({
                content: '📊 Nenhuma venda encontrada.',
                ephemeral: true
            });
            return;
        }

        const recentSales = sales.slice(0, limit);

        const embed = new EmbedBuilder()
            .setTitle('📊 Vendas Recentes')
            .setColor('#0099FF')
            .setDescription(`Mostrando as **${recentSales.length}** vendas mais recentes`)
            .setTimestamp();

        recentSales.forEach((sale, index) => {
            const statusEmoji = {
                'pending': '⏳',
                'approved': '✅',
                'cancelled': '❌',
                'refunded': '🔄'
            };

            const status = statusEmoji[sale.status] || '❓';
            const date = moment(sale.created_at).format('DD/MM/YYYY HH:mm');

            embed.addFields({
                name: `${status} Venda #${sale.id}`,
                value: `👤 **${sale.customer_name}**\n📦 ${sale.product_name || 'Produto removido'}\n💰 R$ ${sale.total_price.toFixed(2)}\n📅 ${date}\n🆔 ${sale.transaction_id || 'N/A'}`,
                inline: true
            });
        });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('refresh_sales')
                    .setLabel('🔄 Atualizar')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('export_sales')
                    .setLabel('📊 Exportar')
                    .setStyle(ButtonStyle.Secondary)
            );

        await interaction.editReply({ embeds: [embed], components: [row] });
    },

    async generateReport(interaction, database) {
        await interaction.deferReply({ ephemeral: true });

        const period = interaction.options.getString('periodo') || 'all';
        const sales = await database.getSales();

        if (sales.length === 0) {
            await interaction.editReply({
                content: '📊 Nenhuma venda encontrada para gerar relatório.',
                ephemeral: true
            });
            return;
        }

        // Filtrar vendas por período
        let filteredSales = sales;
        const now = moment();

        switch (period) {
            case 'today':
                filteredSales = sales.filter(sale => 
                    moment(sale.created_at).isSame(now, 'day')
                );
                break;
            case 'week':
                filteredSales = sales.filter(sale => 
                    moment(sale.created_at).isAfter(now.subtract(7, 'days'))
                );
                break;
            case 'month':
                filteredSales = sales.filter(sale => 
                    moment(sale.created_at).isAfter(now.subtract(30, 'days'))
                );
                break;
        }

        // Calcular estatísticas
        const totalSales = filteredSales.length;
        const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total_price, 0);
        const approvedSales = filteredSales.filter(sale => sale.status === 'approved');
        const pendingSales = filteredSales.filter(sale => sale.status === 'pending');
        const cancelledSales = filteredSales.filter(sale => sale.status === 'cancelled');

        // Produtos mais vendidos
        const productStats = {};
        filteredSales.forEach(sale => {
            const productName = sale.product_name || 'Produto removido';
            if (!productStats[productName]) {
                productStats[productName] = { quantity: 0, revenue: 0 };
            }
            productStats[productName].quantity += sale.quantity;
            productStats[productName].revenue += sale.total_price;
        });

        const topProducts = Object.entries(productStats)
            .sort(([,a], [,b]) => b.revenue - a.revenue)
            .slice(0, 3);

        const embed = new EmbedBuilder()
            .setTitle('📊 Relatório de Vendas')
            .setColor('#00FF00')
            .setDescription(`Período: **${this.getPeriodName(period)}**`)
            .addFields(
                { name: '📈 Total de Vendas', value: totalSales.toString(), inline: true },
                { name: '💰 Receita Total', value: `R$ ${totalRevenue.toFixed(2)}`, inline: true },
                { name: '📊 Média por Venda', value: `R$ ${(totalRevenue / totalSales).toFixed(2)}`, inline: true },
                { name: '✅ Aprovadas', value: approvedSales.length.toString(), inline: true },
                { name: '⏳ Pendentes', value: pendingSales.length.toString(), inline: true },
                { name: '❌ Canceladas', value: cancelledSales.length.toString(), inline: true }
            )
            .setTimestamp();

        if (topProducts.length > 0) {
            let topProductsText = '';
            topProducts.forEach(([product, stats], index) => {
                topProductsText += `${index + 1}. **${product}**\n`;
                topProductsText += `   📦 ${stats.quantity} vendas | 💰 R$ ${stats.revenue.toFixed(2)}\n`;
            });
            embed.addFields({ name: '🏆 Produtos Mais Vendidos', value: topProductsText, inline: false });
        }

        await interaction.editReply({ embeds: [embed] });
    },

    async updateSaleStatus(interaction, database) {
        await interaction.deferReply({ ephemeral: true });

        const saleId = interaction.options.getInteger('id');
        const newStatus = interaction.options.getString('status');

        const sales = await database.getSales();
        const sale = sales.find(s => s.id === saleId);

        if (!sale) {
            await interaction.editReply({
                content: '❌ Venda não encontrada. Verifique o ID.',
                ephemeral: true
            });
            return;
        }

        await database.updateSaleStatus(saleId, newStatus);

        const statusNames = {
            'pending': 'Pendente',
            'approved': 'Aprovada',
            'cancelled': 'Cancelada',
            'refunded': 'Reembolsada'
        };

        const embed = new EmbedBuilder()
            .setTitle('✅ Status Atualizado!')
            .setColor('#00FF00')
            .setDescription(`Status da venda #${saleId} foi atualizado!`)
            .addFields(
                { name: '👤 Cliente', value: sale.customer_name, inline: true },
                { name: '📦 Produto', value: sale.product_name || 'Produto removido', inline: true },
                { name: '💰 Valor', value: `R$ ${sale.total_price.toFixed(2)}`, inline: true },
                { name: '📊 Status Anterior', value: statusNames[sale.status] || sale.status, inline: true },
                { name: '📊 Status Atual', value: statusNames[newStatus], inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `Atualizado por ${interaction.user.tag}` });

        await interaction.editReply({ embeds: [embed] });
    },

    getPeriodName(period) {
        const names = {
            'today': 'Hoje',
            'week': 'Última semana',
            'month': 'Último mês',
            'all': 'Todos os tempos'
        };
        return names[period] || 'Todos os tempos';
    },
}; 