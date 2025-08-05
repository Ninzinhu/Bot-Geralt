const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stock')
        .setDescription('Gerencia o estoque de produtos')
        .addSubcommand(subcommand =>
            subcommand
                .setName('ver')
                .setDescription('Verifica o estoque de todos os produtos'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('adicionar')
                .setDescription('Adiciona quantidade ao estoque de um produto')
                .addIntegerOption(option =>
                    option.setName('id')
                        .setDescription('ID do produto')
                        .setRequired(true))
                .addIntegerOption(option =>
                    option.setName('quantidade')
                        .setDescription('Quantidade a adicionar')
                        .setRequired(true)
                        .setMinValue(1)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remover')
                .setDescription('Remove quantidade do estoque de um produto')
                .addIntegerOption(option =>
                    option.setName('id')
                        .setDescription('ID do produto')
                        .setRequired(true))
                .addIntegerOption(option =>
                    option.setName('quantidade')
                        .setDescription('Quantidade a remover')
                        .setRequired(true)
                        .setMinValue(1)))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction, database) {
        try {
            const subcommand = interaction.options.getSubcommand();

            switch (subcommand) {
                case 'ver':
                    await this.showStock(interaction, database);
                    break;
                case 'adicionar':
                    await this.addStock(interaction, database);
                    break;
                case 'remover':
                    await this.removeStock(interaction, database);
                    break;
            }
        } catch (error) {
            console.error('❌ Erro no comando stock:', error);
            await interaction.reply({
                content: '❌ Houve um erro ao executar o comando.',
                ephemeral: true
            });
        }
    },

    async showStock(interaction, database) {
        await interaction.deferReply({ ephemeral: true });

        const products = await database.getProducts();

        if (products.length === 0) {
            await interaction.editReply({
                content: '📦 Nenhum produto encontrado no estoque.',
                ephemeral: true
            });
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle('📦 Estoque de Produtos')
            .setColor('#0099FF')
            .setDescription(`Total de produtos: **${products.length}**`)
            .setTimestamp();

        // Agrupar produtos por categoria
        const categories = {};
        products.forEach(product => {
            const category = product.category || 'Sem categoria';
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
                fieldValue += `${stockStatus} **ID ${product.id}** - ${product.name}\n`;
                fieldValue += `💰 R$ ${product.price.toFixed(2)} | 📦 ${product.stock} unidades\n\n`;
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
                    .setCustomId('refresh_stock')
                    .setLabel('🔄 Atualizar')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('export_stock')
                    .setLabel('📊 Exportar')
                    .setStyle(ButtonStyle.Secondary)
            );

        await interaction.editReply({ embeds: [embed], components: [row] });
    },

    async addStock(interaction, database) {
        await interaction.deferReply({ ephemeral: true });

        const productId = interaction.options.getInteger('id');
        const quantity = interaction.options.getInteger('quantidade');

        const product = await database.getProduct(productId);
        if (!product) {
            await interaction.editReply({
                content: '❌ Produto não encontrado. Verifique o ID.',
                ephemeral: true
            });
            return;
        }

        const newStock = product.stock + quantity;
        await database.updateStock(productId, newStock);

        const embed = new EmbedBuilder()
            .setTitle('✅ Estoque Atualizado!')
            .setColor('#00FF00')
            .setDescription(`Estoque do produto **${product.name}** foi atualizado!`)
            .addFields(
                { name: '🆔 ID', value: productId.toString(), inline: true },
                { name: '📦 Estoque Anterior', value: product.stock.toString(), inline: true },
                { name: '📦 Estoque Atual', value: newStock.toString(), inline: true },
                { name: '➕ Adicionado', value: `+${quantity}`, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `Atualizado por ${interaction.user.tag}` });

        await interaction.editReply({ embeds: [embed] });
    },

    async removeStock(interaction, database) {
        await interaction.deferReply({ ephemeral: true });

        const productId = interaction.options.getInteger('id');
        const quantity = interaction.options.getInteger('quantidade');

        const product = await database.getProduct(productId);
        if (!product) {
            await interaction.editReply({
                content: '❌ Produto não encontrado. Verifique o ID.',
                ephemeral: true
            });
            return;
        }

        if (product.stock < quantity) {
            await interaction.editReply({
                content: `❌ Estoque insuficiente. Produto tem apenas ${product.stock} unidades.`,
                ephemeral: true
            });
            return;
        }

        const newStock = product.stock - quantity;
        await database.updateStock(productId, newStock);

        const embed = new EmbedBuilder()
            .setTitle('✅ Estoque Atualizado!')
            .setColor('#FFA500')
            .setDescription(`Estoque do produto **${product.name}** foi atualizado!`)
            .addFields(
                { name: '🆔 ID', value: productId.toString(), inline: true },
                { name: '📦 Estoque Anterior', value: product.stock.toString(), inline: true },
                { name: '📦 Estoque Atual', value: newStock.toString(), inline: true },
                { name: '➖ Removido', value: `-${quantity}`, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `Atualizado por ${interaction.user.tag}` });

        await interaction.editReply({ embeds: [embed] });
    },
}; 