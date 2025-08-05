const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const musicManager = require('../../music/musicManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Toca uma música do YouTube')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('Nome da música ou URL do YouTube')
                .setRequired(true)),

    async execute(interaction, database) {
        try {
            await interaction.deferReply();

            const query = interaction.options.getString('query');
            const { guild } = interaction;

            // Verificar se o usuário está em um canal de voz
            if (!interaction.member.voice.channel) {
                return await interaction.editReply({
                    content: '❌ Você precisa estar em um canal de voz para usar este comando!',
                    ephemeral: true
                });
            }

            // Conectar ao canal de voz se necessário
            if (!musicManager.isConnected(guild.id)) {
                await musicManager.joinVoiceChannel(interaction);
            }

            // Adicionar música à fila
            const song = await musicManager.addToQueue(interaction, query);

            const embed = new EmbedBuilder()
                .setTitle('🎵 Música Adicionada à Fila')
                .setDescription(`**${song.title}**`)
                .setThumbnail(song.thumbnail)
                .addFields(
                    { name: '⏱️ Duração', value: musicManager.formatDuration(song.duration), inline: true },
                    { name: '👤 Solicitado por', value: interaction.user.toString(), inline: true },
                    { name: '🎯 Status', value: musicManager.isPlaying(guild.id) ? '🎵 Tocando agora' : '⏳ Será tocada em breve', inline: true }
                )
                .setColor('#00FF00')
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('❌ Erro no comando play:', error);
            await interaction.editReply({
                content: `❌ Erro: ${error.message}`,
                ephemeral: true
            });
        }
    },
}; 