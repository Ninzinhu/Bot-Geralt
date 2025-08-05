const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const musicManager = require('../../music/musicManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Mostra a fila de músicas'),

    async execute(interaction) {
        try {
            await interaction.deferReply();

            const { guild } = interaction;
            const queue = musicManager.getQueue(guild.id);

            const queueDisplay = musicManager.getQueueDisplay(guild.id);

            const embed = new EmbedBuilder()
                .setTitle('📋 Fila de Músicas')
                .setDescription(queueDisplay)
                .addFields(
                    { name: '🔊 Volume', value: `${queue.volume}%`, inline: true },
                    { name: '🔁 Loop', value: queue.loop ? 'Ativado' : 'Desativado', inline: true },
                    { name: '🎵 Status', value: queue.isPlaying ? 'Tocando' : 'Parado', inline: true }
                )
                .setColor('#3498DB')
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('❌ Erro no comando queue:', error);
            await interaction.editReply({
                content: `❌ Erro: ${error.message}`,
                ephemeral: true
            });
        }
    },
}; 