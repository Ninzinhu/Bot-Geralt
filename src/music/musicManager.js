const { 
    createAudioPlayer, 
    createAudioResource, 
    AudioPlayerStatus, 
    VoiceConnectionStatus,
    entersState,
    joinVoiceChannel,
    getVoiceConnection
} = require('@discordjs/voice');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const play = require('play-dl');

class MusicManager {
    constructor() {
        this.queues = new Map(); // Map<GuildId, Queue>
        this.players = new Map(); // Map<GuildId, AudioPlayer>
    }

    // Estrutura da fila de música
    createQueue(guildId) {
        return {
            guildId,
            songs: [],
            currentSong: null,
            volume: 100,
            loop: false,
            textChannel: null,
            voiceChannel: null,
            connection: null,
            player: null,
            isPlaying: false,
            isPaused: false
        };
    }

    // Obter ou criar fila
    getQueue(guildId) {
        if (!this.queues.has(guildId)) {
            this.queues.set(guildId, this.createQueue(guildId));
        }
        return this.queues.get(guildId);
    }

    // Obter ou criar player
    getPlayer(guildId) {
        if (!this.players.has(guildId)) {
            const player = createAudioPlayer();
            this.players.set(guildId, player);
            
            // Configurar eventos do player
            player.on(AudioPlayerStatus.Idle, () => {
                this.handleIdle(guildId);
            });

            player.on(AudioPlayerStatus.Playing, () => {
                this.handlePlaying(guildId);
            });

            player.on('error', (error) => {
                console.error('❌ Erro no player de música:', error);
                this.handleError(guildId, error);
            });
        }
        return this.players.get(guildId);
    }

    // Conectar ao canal de voz
    async joinVoiceChannel(interaction) {
        const { member, guild } = interaction;
        const voiceChannel = member.voice.channel;

        if (!voiceChannel) {
            throw new Error('Você precisa estar em um canal de voz!');
        }

        const queue = this.getQueue(guild.id);
        queue.voiceChannel = voiceChannel;
        queue.textChannel = interaction.channel;

        try {
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: guild.id,
                adapterCreator: guild.voiceAdapterCreator,
                selfDeaf: false,
                selfMute: false
            });

            await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
            
            queue.connection = connection;
            const player = this.getPlayer(guild.id);
            connection.subscribe(player);
            queue.player = player;

            return connection;
        } catch (error) {
            console.error('❌ Erro ao conectar ao canal de voz:', error);
            throw new Error('Não consegui conectar ao canal de voz!');
        }
    }

    // Adicionar música à fila
    async addToQueue(interaction, query) {
        const { guild } = interaction;
        const queue = this.getQueue(guild.id);

        try {
            // Verificar se é URL do YouTube ou busca
            let videoInfo;
            if (play.yt_validate(query) === 'video') {
                videoInfo = await play.video_info(query);
            } else {
                const searchResults = await play.search(query, { limit: 1 });
                if (!searchResults || searchResults.length === 0) {
                    throw new Error('Nenhuma música encontrada!');
                }
                videoInfo = await play.video_info(searchResults[0].url);
            }

            const song = {
                title: videoInfo.video_details.title,
                url: videoInfo.video_details.url,
                duration: videoInfo.video_details.durationInSec,
                thumbnail: videoInfo.video_details.thumbnails[0].url,
                requestedBy: interaction.user,
                stream: null
            };

            queue.songs.push(song);

            // Se não estiver tocando, começar a tocar
            if (!queue.isPlaying) {
                await this.playNext(guild.id);
            }

            return song;
        } catch (error) {
            console.error('❌ Erro ao adicionar música:', error);
            throw new Error('Erro ao processar a música!');
        }
    }

    // Tocar próxima música
    async playNext(guildId) {
        const queue = this.getQueue(guildId);
        const player = this.getPlayer(guildId);

        if (queue.songs.length === 0) {
            queue.isPlaying = false;
            queue.currentSong = null;
            return;
        }

        const song = queue.songs.shift();
        queue.currentSong = song;
        queue.isPlaying = true;
        queue.isPaused = false;

        try {
            const stream = await play.stream(song.url);
            const resource = createAudioResource(stream.stream, {
                inputType: stream.type,
                inlineVolume: true
            });

            resource.volume.setVolume(queue.volume / 100);
            player.play(resource);

            // Enviar embed da música atual
            await this.sendNowPlayingEmbed(queue);
        } catch (error) {
            console.error('❌ Erro ao tocar música:', error);
            await this.playNext(guildId); // Tentar próxima música
        }
    }

    // Pausar música
    pause(guildId) {
        const queue = this.getQueue(guildId);
        const player = this.getPlayer(guildId);

        if (!queue.isPlaying || !queue.currentSong) {
            throw new Error('Não há música tocando!');
        }

        player.pause();
        queue.isPaused = true;
    }

    // Retomar música
    resume(guildId) {
        const queue = this.getQueue(guildId);
        const player = this.getPlayer(guildId);

        if (!queue.isPlaying || !queue.currentSong) {
            throw new Error('Não há música tocando!');
        }

        if (!queue.isPaused) {
            throw new Error('A música não está pausada!');
        }

        player.unpause();
        queue.isPaused = false;
    }

    // Pular música
    skip(guildId) {
        const queue = this.getQueue(guildId);
        const player = this.getPlayer(guildId);

        if (!queue.isPlaying || !queue.currentSong) {
            throw new Error('Não há música tocando!');
        }

        player.stop();
    }

    // Parar música e limpar fila
    stop(guildId) {
        const queue = this.getQueue(guildId);
        const player = this.getPlayer(guildId);

        player.stop();
        queue.songs = [];
        queue.currentSong = null;
        queue.isPlaying = false;
        queue.isPaused = false;

        // Desconectar do canal de voz
        if (queue.connection) {
            queue.connection.destroy();
            queue.connection = null;
        }
    }

    // Definir volume
    setVolume(guildId, volume) {
        const queue = this.getQueue(guildId);
        const player = this.getPlayer(guildId);

        if (volume < 0 || volume > 100) {
            throw new Error('Volume deve estar entre 0 e 100!');
        }

        queue.volume = volume;
        
        if (queue.currentSong && queue.currentSong.stream) {
            queue.currentSong.stream.volume.setVolume(volume / 100);
        }
    }

    // Mostrar fila
    getQueueDisplay(guildId) {
        const queue = this.getQueue(guildId);
        
        if (queue.songs.length === 0 && !queue.currentSong) {
            return 'Fila vazia!';
        }

        let display = '';
        
        if (queue.currentSong) {
            display += `🎵 **Tocando agora:** ${queue.currentSong.title}\n\n`;
        }

        if (queue.songs.length > 0) {
            display += '📋 **Próximas músicas:**\n';
            queue.songs.slice(0, 10).forEach((song, index) => {
                const duration = this.formatDuration(song.duration);
                display += `${index + 1}. ${song.title} (${duration})\n`;
            });

            if (queue.songs.length > 10) {
                display += `\n... e mais ${queue.songs.length - 10} música(s)`;
            }
        }

        return display;
    }

    // Eventos do player
    handleIdle(guildId) {
        const queue = this.getQueue(guildId);
        
        if (queue.loop && queue.currentSong) {
            // Modo loop - adicionar música atual no final da fila
            queue.songs.push(queue.currentSong);
        }

        this.playNext(guildId);
    }

    handlePlaying(guildId) {
        const queue = this.getQueue(guildId);
        queue.isPlaying = true;
        queue.isPaused = false;
    }

    handleError(guildId, error) {
        console.error(`❌ Erro no servidor ${guildId}:`, error);
        const queue = this.getQueue(guildId);
        
        if (queue.textChannel) {
            queue.textChannel.send('❌ Erro ao tocar música! Pulando para a próxima...');
        }

        this.playNext(guildId);
    }

    // Enviar embed da música atual
    async sendNowPlayingEmbed(queue) {
        if (!queue.textChannel || !queue.currentSong) return;

        const embed = new EmbedBuilder()
            .setTitle('🎵 Tocando Agora')
            .setDescription(`**${queue.currentSong.title}**`)
            .setThumbnail(queue.currentSong.thumbnail)
            .addFields(
                { name: '⏱️ Duração', value: this.formatDuration(queue.currentSong.duration), inline: true },
                { name: '🔊 Volume', value: `${queue.volume}%`, inline: true },
                { name: '👤 Solicitado por', value: queue.currentSong.requestedBy.toString(), inline: true }
            )
            .setColor('#00FF00')
            .setTimestamp();

        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('music_pause')
                    .setLabel('⏸️ Pausar')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('music_skip')
                    .setLabel('⏭️ Pular')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('music_stop')
                    .setLabel('⏹️ Parar')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('music_queue')
                    .setLabel('📋 Fila')
                    .setStyle(ButtonStyle.Success)
            );

        try {
            await queue.textChannel.send({ embeds: [embed], components: [buttons] });
        } catch (error) {
            console.error('❌ Erro ao enviar embed:', error);
        }
    }

    // Formatar duração
    formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
            return `${minutes}:${secs.toString().padStart(2, '0')}`;
        }
    }

    // Verificar se está conectado
    isConnected(guildId) {
        const queue = this.getQueue(guildId);
        return queue.connection && queue.connection.state.status === VoiceConnectionStatus.Ready;
    }

    // Verificar se está tocando
    isPlaying(guildId) {
        const queue = this.getQueue(guildId);
        return queue.isPlaying && queue.currentSong;
    }
}

module.exports = new MusicManager(); 