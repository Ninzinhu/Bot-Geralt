const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const musicManager = require('../../music/musicManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Retoma a música pausada'),

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

            // Retomar música
            musicManager.resume(guild.id);

            const embed = new EmbedBuilder()
                .setTitle('▶️ Música Retomada')
                .setDescription('A música foi retomada!')
                .setColor('#00FF00')
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('❌ Erro no comando resume:', error);
            await interaction.editReply({
                content: `❌ Erro: ${error.message}`,
                ephemeral: true
            });
        }
    },
}; 