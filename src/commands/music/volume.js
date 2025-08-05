const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const musicManager = require('../../music/musicManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Define o volume da música')
        .addIntegerOption(option =>
            option.setName('volume')
                .setDescription('Volume (0-100)')
                .setRequired(true)
                .setMinValue(0)
                .setMaxValue(100)),

    async execute(interaction) {
        try {
            await interaction.deferReply();

            const volume = interaction.options.getInteger('volume');
            const { guild } = interaction;

            // Verificar se há música tocando
            if (!musicManager.isPlaying(guild.id)) {
                return await interaction.editReply({
                    content: '❌ Não há música tocando no momento!',
                    ephemeral: true
                });
            }

            // Definir volume
            musicManager.setVolume(guild.id, volume);

            const embed = new EmbedBuilder()
                .setTitle('🔊 Volume Alterado')
                .setDescription(`Volume definido para **${volume}%**`)
                .setColor('#9B59B6')
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('❌ Erro no comando volume:', error);
            await interaction.editReply({
                content: `❌ Erro: ${error.message}`,
                ephemeral: true
            });
        }
    },
}; 