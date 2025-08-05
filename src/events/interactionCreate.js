const { Events, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, database) {
        // Lidar com botões
        if (interaction.isButton()) {
            await this.handleButton(interaction, database);
        }
        
        // Lidar com menus de seleção
        if (interaction.isStringSelectMenu()) {
            await this.handleSelectMenu(interaction, database);
        }

        // Lidar com submissão de modais
        if (interaction.isModalSubmit()) {
            await this.handleModalSubmit(interaction, database);
        }
    },

    async handleButton(interaction, database) {
        const { customId } = interaction;

        try {
            // Botões de música
            if (customId.startsWith('music_')) {
                await this.handleMusicButton(interaction, customId);
                return;
            }

            // TEMPORARIAMENTE DESABILITADO - FEATURES DE LOJA
            /*
            const [action, productId] = customId.split('_');

            if (action === 'buy') {
                await this.handleBuyButton(interaction, productId, database);
            } else {
            */
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
                    default:
                        // Se for um botão de compra, informar que está desabilitado
                        if (customId.startsWith('buy_')) {
                            await interaction.reply({
                                content: '🛑 Funcionalidade de compra temporariamente desabilitada.',
                                ephemeral: true
                            });
                        }
                        break;
                }
            // }
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

    async handleMusicButton(interaction, customId) {
        const musicManager = require('../music/musicManager');
        const { guild } = interaction;

        try {
            await interaction.deferUpdate();

            switch (customId) {
                case 'music_pause':
                    if (musicManager.isPlaying(guild.id)) {
                        musicManager.pause(guild.id);
                        await interaction.followUp({ content: '⏸️ Música pausada!', ephemeral: true });
                    } else {
                        await interaction.followUp({ content: '❌ Não há música tocando!', ephemeral: true });
                    }
                    break;

                case 'music_skip':
                    if (musicManager.isPlaying(guild.id)) {
                        musicManager.skip(guild.id);
                        await interaction.followUp({ content: '⏭️ Música pulada!', ephemeral: true });
                    } else {
                        await interaction.followUp({ content: '❌ Não há música tocando!', ephemeral: true });
                    }
                    break;

                case 'music_stop':
                    if (musicManager.isPlaying(guild.id)) {
                        musicManager.stop(guild.id);
                        await interaction.followUp({ content: '⏹️ Música parada!', ephemeral: true });
                    } else {
                        await interaction.followUp({ content: '❌ Não há música tocando!', ephemeral: true });
                    }
                    break;

                case 'music_queue':
                    const queueDisplay = musicManager.getQueueDisplay(guild.id);
                    await interaction.followUp({ 
                        content: `📋 **Fila de Músicas:**\n${queueDisplay}`, 
                        ephemeral: true 
                    });
                    break;

                default:
                    await interaction.followUp({ content: '❌ Botão não reconhecido!', ephemeral: true });
                    break;
            }
        } catch (error) {
            console.error('❌ Erro no botão de música:', error);
            await interaction.followUp({ 
                content: `❌ Erro: ${error.message}`, 
                ephemeral: true 
            });
        }
    },

    // TEMPORARIAMENTE DESABILITADO - FEATURES DE LOJA
    /*
    async handleBuyButton(interaction, productId, database) {
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
    */

    async handleModalSubmit(interaction, database) {
        const { customId } = interaction;
        
        // TEMPORARIAMENTE DESABILITADO - FEATURES DE LOJA
        /*
        const [action, type, productId] = customId.split('_');
        
        if (action === 'buy' && type === 'modal') {
            await interaction.deferReply({ ephemeral: true });

            const quantity = parseInt(interaction.fields.getTextInputValue('quantity'));
            if (isNaN(quantity) || quantity <= 0) {
                return interaction.editReply({ content: '❌ Por favor, insira uma quantidade válida.' });
            }

            const product = await database.getProduct(productId);

            if (!product) {
                return interaction.editReply({ content: '❌ Este produto não está mais disponível.' });
            }

            if (product.stock < quantity) {
                return interaction.editReply({ content: `❌ Desculpe, temos apenas ${product.stock} unidade(s) em estoque.` });
            }

            const newStock = product.stock - quantity;
            const totalPrice = product.price * quantity;
            
            await database.updateStock(productId, newStock);
            const saleId = await database.createSale(
                productId,
                interaction.user.id,
                interaction.user.tag,
                quantity,
                totalPrice,
                'Aguardando Pagamento'
            );

            const embed = new EmbedBuilder()
                .setTitle('🛒 Pedido Recebido!')
                .setColor('#57F287')
                .setDescription(`Seu pedido de **${quantity}x ${product.name}** foi recebido! Em breve você receberá uma mensagem privada com os detalhes para pagamento.`)
                .addFields({ name: '📝 ID do Pedido', value: saleId.toString() })
                .setTimestamp();
            
            await interaction.editReply({ embeds: [embed] });

            if (newStock === 0) {
                const originalMessage = await interaction.channel.messages.fetch(interaction.message.id);
                if (originalMessage) {
                    const disabledButton = new ActionRowBuilder().addComponents(
                        originalMessage.components[0].components[0].setDisabled(true)
                    );
                    await originalMessage.edit({ components: [disabledButton] });
                }
            }
        }
        */
        
        // Se for um modal de compra, informar que está desabilitado
        if (customId.startsWith('buy_modal_')) {
            await interaction.reply({
                content: '🛑 Funcionalidade de compra temporariamente desabilitada.',
                ephemeral: true
            });
        }
    },

    async handleSelectMenu(interaction, database) {
        const { customId } = interaction;

        try {
            switch (customId) {
                case 'product_selection':
                    const selectedProductId = interaction.values[0];
                    await this.handleProductSelection(interaction, selectedProductId, database);
                    break;
                default:
                    await interaction.reply({
                        content: '❌ Menu de seleção não reconhecido.',
                        ephemeral: true
                    });
            }
        } catch (error) {
            console.error('❌ Erro ao processar menu de seleção:', error);
            await interaction.reply({
                content: '❌ Houve um erro ao processar a seleção.',
                ephemeral: true
            });
        }
    },

    async handleProductSelection(interaction, productId, database) {
        // TEMPORARIAMENTE DESABILITADO - FEATURES DE LOJA
        /*
        try {
            const product = await database.getProduct(productId);
            
            if (!product) {
                return interaction.reply({
                    content: '❌ Produto não encontrado.',
                    ephemeral: true
                });
            }

            const embed = new EmbedBuilder()
                .setTitle(`🛍️ ${product.name}`)
                .setColor('#3498DB')
                .setDescription(product.description)
                .addFields(
                    { name: '💰 Preço', value: `R$ ${product.price.toFixed(2)}`, inline: true },
                    { name: '📦 Estoque', value: product.stock > 0 ? product.stock.toString() : 'Esgotado', inline: true },
                    { name: '🏷️ Categoria', value: product.category, inline: true }
                )
                .setTimestamp();

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`buy_${productId}`)
                        .setLabel('🛒 Comprar')
                        .setStyle(ButtonStyle.Success)
                        .setDisabled(product.stock === 0)
                );

            await interaction.update({ embeds: [embed], components: [row] });
        } catch (error) {
            console.error('❌ Erro ao mostrar produto:', error);
            await interaction.reply({
                content: '❌ Houve um erro ao mostrar o produto.',
                ephemeral: true
            });
        }
        */
        
        await interaction.reply({
            content: '🛑 Funcionalidade de produtos temporariamente desabilitada.',
            ephemeral: true
        });
    },
}; 