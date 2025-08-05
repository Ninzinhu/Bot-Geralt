const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const musicManager = require('../../music/musicManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Pula para a próxima música'),

    async execute(interaction, database) {
        try {
            await interaction.deferReply();

            const { guild } = interaction;

            // Verificar se há música tocando
            if (!musicManager.isPlaying(guild.id)) {
                return await interaction.editReply({
                    content: '❌ Não há música tocando no momento!',
                    ephemeral: true
                });
            }

            const queue = musicManager.getQueue(guild.id);
            const currentSong = queue.currentSong;

            // Pular música
            musicManager.skip(guild.id);

            const embed = new EmbedBuilder()
                .setTitle('⏭️ Música Pulada')
                .setDescription(`**${currentSong.title}** foi pulada!`)
                .setThumbnail(currentSong.thumbnail)
                .setColor('#FF6B6B')
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('❌ Erro no comando skip:', error);
            await interaction.editReply({
                content: `❌ Erro: ${error.message}`,
                ephemeral: true
            });
        }
    },
}; 