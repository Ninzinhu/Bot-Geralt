const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Limpa mensagens do canal')
        .addIntegerOption(option =>
            option.setName('quantidade')
                .setDescription('Número de mensagens para deletar (1-100)')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100))
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Limpar apenas mensagens deste usuário')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction, database) {
        try {
            await interaction.deferReply({ ephemeral: true });

            const amount = interaction.options.getInteger('quantidade');
            const targetUser = interaction.options.getUser('usuario');

            // Verificar permissões do canal
            if (!interaction.channel.permissionsFor(interaction.client.user).has(PermissionFlagsBits.ManageMessages)) {
                return interaction.editReply({
                    content: '❌ Não tenho permissão para deletar mensagens neste canal.',
                    ephemeral: true
                });
            }

            let deletedCount = 0;
            let messagesToDelete = [];

            if (targetUser) {
                // Deletar mensagens de um usuário específico
                const messages = await interaction.channel.messages.fetch({ limit: 100 });
                const userMessages = messages.filter(msg => msg.author.id === targetUser.id).first(amount);
                messagesToDelete = userMessages;
            } else {
                // Deletar mensagens gerais
                const messages = await interaction.channel.messages.fetch({ limit: amount + 1 });
                messagesToDelete = messages.first(amount);
            }

            if (messagesToDelete.length === 0) {
                return interaction.editReply({
                    content: '❌ Nenhuma mensagem encontrada para deletar.',
                    ephemeral: true
                });
            }

            // Deletar mensagens
            const deletedMessages = await interaction.channel.bulkDelete(messagesToDelete, true);
            deletedCount = deletedMessages.size;

            // Embed de confirmação
            const clearEmbed = new EmbedBuilder()
                .setTitle('🧹 Mensagens Deletadas')
                .setColor('#00FF00')
                .addFields(
                    { name: '📊 Quantidade', value: `${deletedCount} mensagem(ns)`, inline: true },
                    { name: '📍 Canal', value: interaction.channel.name, inline: true },
                    { name: '🛡️ Deletado por', value: interaction.user.tag, inline: true }
                );

            if (targetUser) {
                clearEmbed.addFields({ name: '👤 Usuário', value: targetUser.tag, inline: true });
            }

            clearEmbed.setTimestamp()
                .setFooter({ text: 'Sistema de Moderação - NihonTech' });

            await interaction.editReply({ embeds: [clearEmbed] });

            // Log da ação
            const logChannelId = process.env.LOG_CHANNEL_ID;
            if (logChannelId) {
                const logChannel = interaction.guild.channels.cache.get(logChannelId);
                if (logChannel) {
                    const logEmbed = new EmbedBuilder()
                        .setTitle('📋 Log de Moderação - Limpeza')
                        .setColor('#00FF00')
                        .addFields(
                            { name: '📊 Mensagens Deletadas', value: `${deletedCount}`, inline: true },
                            { name: '🛡️ Moderador', value: interaction.user.tag, inline: true },
                            { name: '📍 Canal', value: interaction.channel.name, inline: true }
                        );

                    if (targetUser) {
                        logEmbed.addFields({ name: '👤 Usuário Alvo', value: targetUser.tag, inline: true });
                    }

                    logEmbed.setTimestamp();

                    await logChannel.send({ embeds: [logEmbed] });
                }
            }

            // Auto-deletar a confirmação após 5 segundos
            setTimeout(async () => {
                try {
                    await interaction.deleteReply();
                } catch (error) {
                    // Ignorar erro se a mensagem já foi deletada
                }
            }, 5000);

        } catch (error) {
            console.error('❌ Erro ao limpar mensagens:', error);
            await interaction.editReply({
                content: '❌ Houve um erro ao limpar as mensagens. Verifique as permissões e tente novamente.',
                ephemeral: true
            });
        }
    },
}; 