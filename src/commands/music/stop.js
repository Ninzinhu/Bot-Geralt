const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const musicManager = require('../../music/musicManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Para a música e limpa a fila'),

    async execute(interaction) {
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

            // Parar música
            musicManager.stop(guild.id);

            const embed = new EmbedBuilder()
                .setTitle('⏹️ Música Parada')
                .setDescription('A música foi parada e a fila foi limpa.')
                .setColor('#FF0000')
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('❌ Erro no comando stop:', error);
            await interaction.editReply({
                content: `❌ Erro: ${error.message}`,
                ephemeral: true
            });
        }
    },
}; 