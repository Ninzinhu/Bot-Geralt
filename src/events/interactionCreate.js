const { Events, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        // Lidar com botões
        if (interaction.isButton()) {
            await this.handleButton(interaction);
        }
        
        // Lidar com menus de seleção
        if (interaction.isStringSelectMenu()) {
            await this.handleSelectMenu(interaction);
        }

        // Lidar com submissão de modais
        if (interaction.isModalSubmit()) {
            await this.handleModalSubmit(interaction);
        }
    },

    async handleButton(interaction) {
        const { customId } = interaction;
        const [action, productId] = customId.split('_');

        try {
            if (action === 'buy') {
                await this.handleBuyButton(interaction, productId);
            } else {
                // Manter outros botões funcionando
                switch (customId) {
                    case 'refresh_stock':
                    case 'refresh_sales':
                    case 'refresh_products':
                        await interaction.deferUpdate();
                        await interaction.followUp({ content: '🔄 Informação atualizada!', ephemeral: true });
                        break;
                    case 'export_stock':
                    case 'export_sales':
                        await interaction.deferUpdate();
                        await interaction.followUp({ content: '📊 Funcionalidade de exportação será implementada em breve!', ephemeral: true });
                        break;
                    case 'order_product':
                        await interaction.deferUpdate();
                        await interaction.followUp({ content: '🛒 Para fazer um pedido, entre em contato conosco através de um ticket ou use `/info suporte` para mais informações!', ephemeral: true });
                        break;
                    case 'create_ticket':
                        await interaction.deferUpdate();
                        await interaction.followUp({ content: '🎫 Use `/ticket criar` para abrir um novo ticket de suporte!', ephemeral: true });
                        break;
                    case 'close_ticket':
                    case 'claim_ticket':
                        // Lógica de tickets para staff
                        break;
                }
            }
        } catch (error) {
            console.error('❌ Erro ao processar botão:', error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: '❌ Houve um erro ao processar o botão.',
                    ephemeral: true
                });
            }
        }
    },

    async handleBuyButton(interaction, productId) {
        const modal = new ModalBuilder()
            .setCustomId(`buy_modal_${productId}`)
            .setTitle('Finalizar Compra');

        const quantityInput = new TextInputBuilder()
            .setCustomId('quantity')
            .setLabel("Quantidade que deseja comprar:")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('1')
            .setValue('1')
            .setRequired(true);

        const firstActionRow = new ActionRowBuilder().addComponents(quantityInput);
        modal.addComponents(firstActionRow);
        await interaction.showModal(modal);
    },

    async handleModalSubmit(interaction) {
        const { customId } = interaction;
        const [action, type, productId] = customId.split('_');
        
        if (action === 'buy' && type === 'modal') {
            await interaction.deferReply({ ephemeral: true });

            const quantity = parseInt(interaction.fields.getTextInputValue('quantity'));
            if (isNaN(quantity) || quantity <= 0) {
                return interaction.editReply({ content: '❌ Por favor, insira uma quantidade válida.' });
            }
            
            // Aqui viria a lógica completa de compra:
            // 1. Obter o `database` (precisa ser injetado no evento)
            // 2. Verificar se o produto existe e tem estoque
            // 3. Criar a venda no banco de dados
            // 4. Reduzir o estoque
            // 5. Enviar DM para o usuário com o PIX ou link de pagamento
            
            const embed = new EmbedBuilder()
                .setTitle('🛒 Pedido Recebido!')
                .setColor('#57F287')
                .setDescription(`Seu pedido de **${quantity} unidade(s)** foi recebido! Em breve você receberá uma mensagem privada com os detalhes para pagamento.`)
                .setTimestamp();
            
            await interaction.editReply({ embeds: [embed] });
        }
    },

    async handleSelectMenu(interaction) {
        const { customId, values } = interaction;

        try {
            switch (customId) {
                case 'product_select':
                    await this.handleProductSelection(interaction, values[0]);
                    break;
                default:
                    await interaction.reply({
                        content: '❌ Menu não reconhecido.',
                        ephemeral: true
                    });
            }
        } catch (error) {
            console.error('❌ Erro ao processar menu:', error);
            await interaction.reply({
                content: '❌ Houve um erro ao processar o menu.',
                ephemeral: true
            });
        }
    },

    async handleProductSelection(interaction, productId) {
        await interaction.deferUpdate();
        
        await interaction.followUp({
            content: `📦 Produto selecionado: ID ${productId}. Para mais informações, use \`/info produtos\`!`,
            ephemeral: true
        });
    },
}; 