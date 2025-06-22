const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addproduct')
        .setDescription('Adiciona um novo produto ao estoque')
        .addStringOption(option =>
            option.setName('nome')
                .setDescription('Nome do produto')
                .setRequired(true))
        .addNumberOption(option =>
            option.setName('preco')
                .setDescription('Preço do produto')
                .setRequired(true)
                .setMinValue(0))
        .addIntegerOption(option =>
            option.setName('estoque')
                .setDescription('Quantidade em estoque')
                .setRequired(true)
                .setMinValue(0))
        .addStringOption(option =>
            option.setName('descricao')
                .setDescription('Descrição do produto')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('categoria')
                .setDescription('Categoria do produto')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction, database) {
        try {
            await interaction.deferReply({ ephemeral: true });

            const name = interaction.options.getString('nome');
            const description = interaction.options.getString('descricao') || 'Sem descrição';
            const price = interaction.options.getNumber('preco');
            const stock = interaction.options.getInteger('estoque');
            const category = interaction.options.getString('categoria') || 'Geral';

            const productId = await database.addProduct(name, description, price, stock, category);

            // 1. Mensagem de confirmação para o administrador (só você vê)
            const confirmationEmbed = new EmbedBuilder()
                .setTitle('✅ Produto Adicionado!')
                .setColor('#00FF00')
                .setDescription(`O produto **${name}** foi adicionado e publicado no canal.`)
                .addFields(
                    { name: '🆔 ID', value: productId.toString(), inline: true },
                    { name: '💰 Preço', value: `R$ ${price.toFixed(2)}`, inline: true },
                    { name: '📦 Estoque', value: stock.toString(), inline: true }
                )
                .setTimestamp()
                .setFooter({ text: `Adicionado por ${interaction.user.tag}` });

            await interaction.editReply({ embeds: [confirmationEmbed] });

            // 2. Mensagem pública do produto para os clientes
            const storeConfig = await database.getStoreConfig();
            const productEmbed = new EmbedBuilder()
                .setTitle(`🛍️ ${name}`)
                .setColor('#3498DB')
                .setDescription(description)
                .addFields(
                    { name: '💰 Preço', value: `R$ ${price.toFixed(2)}`, inline: true },
                    { name: '📦 Estoque', value: stock > 0 ? stock.toString() : 'Esgotado', inline: true },
                    { name: '🏷️ Categoria', value: category, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: storeConfig.store_name || 'Bot Geralt' });

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`buy_${productId}`)
                        .setLabel('🛒 Comprar')
                        .setStyle(ButtonStyle.Success)
                        .setDisabled(stock === 0)
                );

            await interaction.channel.send({ embeds: [productEmbed], components: [row] });

        } catch (error) {
            console.error('❌ Erro ao adicionar produto:', error);
            await interaction.editReply({
                content: '❌ Houve um erro ao adicionar o produto. Verifique os dados e tente novamente.',
                ephemeral: true
            });
        }
    },
}; 