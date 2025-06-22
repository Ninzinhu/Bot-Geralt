const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Mostra informações da loja e links importantes')
        .addSubcommand(subcommand =>
            subcommand
                .setName('loja')
                .setDescription('Informações gerais da loja'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('produtos')
                .setDescription('Lista todos os produtos disponíveis'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('suporte')
                .setDescription('Informações de suporte e contato')),

    async execute(interaction, database) {
        try {
            const subcommand = interaction.options.getSubcommand();

            switch (subcommand) {
                case 'loja':
                    await this.showStoreInfo(interaction, database);
                    break;
                case 'produtos':
                    await this.showProducts(interaction, database);
                    break;
                case 'suporte':
                    await this.showSupport(interaction, database);
                    break;
            }
        } catch (error) {
            console.error('❌ Erro no comando info:', error);
            await interaction.reply({
                content: '❌ Houve um erro ao executar o comando.',
                ephemeral: true
            });
        }
    },

    async showStoreInfo(interaction, database) {
        await interaction.deferReply();

        const storeConfig = await database.getStoreConfig();
        const products = await database.getProducts();
        const sales = await database.getSales();

        // Calcular estatísticas
        const totalProducts = products.length;
        const totalSales = sales.length;
        const totalRevenue = sales.reduce((sum, sale) => sum + sale.total_price, 0);
        const activeProducts = products.filter(p => p.stock > 0).length;

        const embed = new EmbedBuilder()
            .setTitle(`🏪 ${storeConfig.store_name || 'Sua Loja'}`)
            .setColor('#FF6B35')
            .setDescription('Bem-vindo à nossa loja! Aqui você encontra produtos de qualidade e suporte excepcional.')
            .addFields(
                { name: '📦 Produtos Disponíveis', value: activeProducts.toString(), inline: true },
                { name: '📊 Total de Produtos', value: totalProducts.toString(), inline: true },
                { name: '💰 Vendas Realizadas', value: totalSales.toString(), inline: true },
                { name: '💎 Receita Total', value: `R$ ${totalRevenue.toFixed(2)}`, inline: true },
                { name: '📅 Fundada', value: '2024', inline: true },
                { name: '⭐ Avaliação', value: '⭐⭐⭐⭐⭐', inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'Bot Geralt - Sistema de Loja' });

        // Adicionar thumbnail se configurado
        if (storeConfig.store_logo) {
            embed.setThumbnail(storeConfig.store_logo);
        }

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('🌐 Site Oficial')
                    .setURL(storeConfig.store_website || 'https://sualoja.com')
                    .setStyle(ButtonStyle.Link),
                new ButtonBuilder()
                    .setLabel('📞 Suporte')
                    .setURL(storeConfig.store_support || 'https://discord.gg/seulink')
                    .setStyle(ButtonStyle.Link),
                new ButtonBuilder()
                    .setLabel('📧 Email')
                    .setURL(`mailto:${storeConfig.store_email || 'contato@sualoja.com'}`)
                    .setStyle(ButtonStyle.Link)
            );

        await interaction.editReply({ embeds: [embed], components: [row] });
    },

    async showProducts(interaction, database) {
        await interaction.deferReply();

        const products = await database.getProducts();

        if (products.length === 0) {
            await interaction.editReply({
                content: '📦 Nenhum produto disponível no momento.',
                ephemeral: true
            });
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle('🛍️ Produtos Disponíveis')
            .setColor('#00FF00')
            .setDescription(`Total de produtos: **${products.length}**`)
            .setTimestamp();

        // Agrupar produtos por categoria
        const categories = {};
        products.forEach(product => {
            const category = product.category || 'Geral';
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push(product);
        });

        // Adicionar campos para cada categoria
        Object.keys(categories).forEach(category => {
            const categoryProducts = categories[category];
            let fieldValue = '';

            categoryProducts.forEach(product => {
                const stockStatus = product.stock > 0 ? '✅' : '❌';
                const stockText = product.stock > 0 ? `${product.stock} em estoque` : 'Esgotado';
                
                fieldValue += `${stockStatus} **${product.name}**\n`;
                fieldValue += `💰 R$ ${product.price.toFixed(2)} | 📦 ${stockText}\n`;
                if (product.description && product.description !== 'Sem descrição') {
                    fieldValue += `📝 ${product.description.substring(0, 50)}${product.description.length > 50 ? '...' : ''}\n`;
                }
                fieldValue += `🆔 ID: ${product.id}\n\n`;
            });

            embed.addFields({
                name: `🏷️ ${category} (${categoryProducts.length})`,
                value: fieldValue.trim(),
                inline: false
            });
        });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('refresh_products')
                    .setLabel('🔄 Atualizar')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('order_product')
                    .setLabel('🛒 Fazer Pedido')
                    .setStyle(ButtonStyle.Success)
            );

        await interaction.editReply({ embeds: [embed], components: [row] });
    },

    async showSupport(interaction, database) {
        await interaction.deferReply();

        const storeConfig = await database.getStoreConfig();
        const tickets = await database.getTickets('open');
        const openTickets = tickets.length;

        const embed = new EmbedBuilder()
            .setTitle('🆘 Suporte e Contato')
            .setColor('#0099FF')
            .setDescription('Precisa de ajuda? Estamos aqui para você!')
            .addFields(
                { name: '🎫 Tickets Abertos', value: openTickets.toString(), inline: true },
                { name: '⏰ Horário de Atendimento', value: '24/7', inline: true },
                { name: '📧 Email de Suporte', value: storeConfig.store_email || 'contato@sualoja.com', inline: true },
                { name: '🌐 Site Oficial', value: storeConfig.store_website || 'https://sualoja.com', inline: true },
                { name: '📞 Discord', value: storeConfig.store_support || 'https://discord.gg/seulink', inline: true },
                { name: '📱 WhatsApp', value: storeConfig.store_whatsapp || 'Não disponível', inline: true }
            )
            .addFields({
                name: '📋 Como Abrir um Ticket',
                value: 'Use `/ticket criar` para abrir um ticket de suporte. Nossa equipe responderá o mais rápido possível!',
                inline: false
            })
            .addFields({
                name: '❓ Perguntas Frequentes',
                value: '• **Como faço uma compra?** Use `/info produtos` para ver os produtos disponíveis\n• **Qual o prazo de entrega?** Entre 24-48 horas após a confirmação do pagamento\n• **Posso cancelar minha compra?** Sim, entre em contato conosco em até 24h\n• **Vocês fazem reembolso?** Sim, em caso de problemas técnicos ou não conformidade',
                inline: false
            })
            .setTimestamp()
            .setFooter({ text: 'Bot Geralt - Suporte ao Cliente' });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('create_ticket')
                    .setLabel('🎫 Criar Ticket')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setLabel('📧 Email')
                    .setURL(`mailto:${storeConfig.store_email || 'contato@sualoja.com'}`)
                    .setStyle(ButtonStyle.Link),
                new ButtonBuilder()
                    .setLabel('💬 Discord')
                    .setURL(storeConfig.store_support || 'https://discord.gg/seulink')
                    .setStyle(ButtonStyle.Link)
            );

        await interaction.editReply({ embeds: [embed], components: [row] });
    },
}; 