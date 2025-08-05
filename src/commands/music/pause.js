const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const musicManager = require('../../music/musicManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pausa a música atual'),

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

            // Pausar música
            musicManager.pause(guild.id);

            const embed = new EmbedBuilder()
                .setTitle('⏸️ Música Pausada')
                .setDescription('A música foi pausada. Use `/resume` para continuar.')
                .setColor('#FFA500')
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('❌ Erro no comando pause:', error);
            await interaction.editReply({
                content: `❌ Erro: ${error.message}`,
                ephemeral: true
            });
        }
    },
}; 