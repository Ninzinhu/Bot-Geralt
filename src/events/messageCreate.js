const { Events, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message, database) {
        // Ignorar mensagens de bots e DMs
        if (message.author.bot || !message.guild) return;

        try {
            // Verificar se o bot tem permissões de moderação
            if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages)) {
                return;
            }

            // Sistema de moderação automática
            await this.autoModeration(message, database);

        } catch (error) {
            console.error('❌ Erro na moderação automática:', error);
        }
    },

    async autoModeration(message, database) {
        const config = await this.getModerationConfig(message.guild.id);
        if (!config || !config.enabled) return;

        const violations = [];

        // 1. Verificar spam/flood
        if (config.antiSpam.enabled) {
            const spamViolation = await this.checkSpam(message, config.antiSpam);
            if (spamViolation) violations.push(spamViolation);
        }

        // 2. Verificar palavras proibidas
        if (config.wordFilter.enabled) {
            const wordViolation = this.checkBannedWords(message.content, config.wordFilter);
            if (wordViolation) violations.push(wordViolation);
        }

        // 3. Verificar links suspeitos
        if (config.linkFilter.enabled) {
            const linkViolation = this.checkSuspiciousLinks(message.content, config.linkFilter);
            if (linkViolation) violations.push(linkViolation);
        }

        // 4. Verificar caps excessivos
        if (config.capsFilter.enabled) {
            const capsViolation = this.checkExcessiveCaps(message.content, config.capsFilter);
            if (capsViolation) violations.push(capsViolation);
        }

        // 5. Verificar emojis excessivos
        if (config.emojiFilter.enabled) {
            const emojiViolation = this.checkExcessiveEmojis(message.content, config.emojiFilter);
            if (emojiViolation) violations.push(emojiViolation);
        }

        // Aplicar ações baseadas nas violações
        if (violations.length > 0) {
            await this.handleViolations(message, violations, config);
        }
    },

    async checkSpam(message, config) {
        const userId = message.author.id;
        const now = Date.now();
        
        // Inicializar cache de spam se não existir
        if (!this.spamCache) this.spamCache = new Map();
        if (!this.spamCache.has(userId)) {
            this.spamCache.set(userId, []);
        }

        const userMessages = this.spamCache.get(userId);
        
        // Adicionar mensagem atual
        userMessages.push(now);
        
        // Remover mensagens antigas (fora da janela de tempo)
        const timeWindow = config.timeWindow || 10000; // 10 segundos
        const filteredMessages = userMessages.filter(time => now - time < timeWindow);
        this.spamCache.set(userId, filteredMessages);

        // Verificar se excedeu o limite
        const maxMessages = config.maxMessages || 5;
        if (filteredMessages.length > maxMessages) {
            return {
                type: 'spam',
                reason: `Enviou ${filteredMessages.length} mensagens em ${timeWindow/1000} segundos`,
                severity: 'medium'
            };
        }

        return null;
    },

    checkBannedWords(content, config) {
        const bannedWords = config.words || [];
        const contentLower = content.toLowerCase();
        
        for (const word of bannedWords) {
            if (contentLower.includes(word.toLowerCase())) {
                return {
                    type: 'banned_word',
                    reason: `Palavra proibida detectada: "${word}"`,
                    severity: config.severity || 'medium'
                };
            }
        }

        return null;
    },

    checkSuspiciousLinks(content, config) {
        const urlRegex = /https?:\/\/[^\s]+/g;
        const urls = content.match(urlRegex);
        
        if (!urls) return null;

        const allowedDomains = config.allowedDomains || [];
        const suspiciousDomains = config.suspiciousDomains || [];

        for (const url of urls) {
            try {
                const domain = new URL(url).hostname;
                
                // Verificar se é um domínio suspeito
                if (suspiciousDomains.some(suspicious => domain.includes(suspicious))) {
                    return {
                        type: 'suspicious_link',
                        reason: `Link suspeito detectado: ${domain}`,
                        severity: 'high'
                    };
                }

                // Verificar se não está na lista de domínios permitidos
                if (allowedDomains.length > 0 && !allowedDomains.some(allowed => domain.includes(allowed))) {
                    return {
                        type: 'unauthorized_link',
                        reason: `Link não autorizado: ${domain}`,
                        severity: 'medium'
                    };
                }
            } catch (error) {
                // URL inválida
                return {
                    type: 'invalid_link',
                    reason: 'Link malformado detectado',
                    severity: 'low'
                };
            }
        }

        return null;
    },

    checkExcessiveCaps(content, config) {
        const letters = content.replace(/[^a-zA-Z]/g, '');
        if (letters.length === 0) return null;

        const capsCount = (content.match(/[A-Z]/g) || []).length;
        const capsPercentage = (capsCount / letters.length) * 100;
        
        const maxCapsPercentage = config.maxPercentage || 70;
        
        if (capsPercentage > maxCapsPercentage) {
            return {
                type: 'excessive_caps',
                reason: `${capsPercentage.toFixed(1)}% de letras maiúsculas`,
                severity: 'low'
            };
        }

        return null;
    },

    checkExcessiveEmojis(content, config) {
        const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
        const emojis = content.match(emojiRegex) || [];
        
        const maxEmojis = config.maxEmojis || 5;
        
        if (emojis.length > maxEmojis) {
            return {
                type: 'excessive_emojis',
                reason: `${emojis.length} emojis em uma mensagem`,
                severity: 'low'
            };
        }

        return null;
    },

    async handleViolations(message, violations, config) {
        const member = message.member;
        const highestSeverity = violations.reduce((highest, violation) => {
            const severityLevels = { low: 1, medium: 2, high: 3 };
            return severityLevels[violation.severity] > severityLevels[highest] ? violation.severity : highest;
        }, 'low');

        // Deletar mensagem
        try {
            await message.delete();
        } catch (error) {
            console.error('❌ Erro ao deletar mensagem:', error);
        }

        // Aplicar ação baseada na severidade
        const action = config.actions[highestSeverity] || 'warn';
        
        switch (action) {
            case 'warn':
                await this.warnUser(message, violations);
                break;
            case 'mute':
                await this.muteUser(message, violations, config);
                break;
            case 'kick':
                await this.kickUser(message, violations);
                break;
            case 'ban':
                await this.banUser(message, violations);
                break;
        }

        // Log da ação
        await this.logViolation(message, violations, action);
    },

    async warnUser(message, violations) {
        const embed = new EmbedBuilder()
            .setTitle('⚠️ Aviso de Moderação Automática')
            .setColor('#FFA500')
            .setDescription('Sua mensagem foi removida por violar as regras do servidor.')
            .addFields(
                { name: '📝 Violações', value: violations.map(v => `• ${v.reason}`).join('\n'), inline: false },
                { name: '💡 Dica', value: 'Leia as regras do servidor para evitar futuras violações.', inline: false }
            )
            .setTimestamp();

        try {
            await message.author.send({ embeds: [embed] });
        } catch (error) {
            // Usuário tem DMs bloqueadas
        }
    },

    async muteUser(message, violations, config) {
        const duration = config.muteDuration || 300000; // 5 minutos
        
        try {
            // Verificar permissões antes de tentar silenciar
            const botMember = message.guild.members.me;
            const targetMember = message.member;

            // Verificar se o bot tem permissão para moderar membros
            if (!botMember.permissions.has(PermissionFlagsBits.ModerateMembers)) {
                console.log('❌ Bot não tem permissão para moderar membros');
                await this.warnUser(message, violations);
                return;
            }

            // Verificar se o bot pode moderar este usuário específico
            if (!targetMember.moderatable) {
                console.log('❌ Bot não pode moderar este usuário');
                await this.warnUser(message, violations);
                return;
            }

            // Verificar se o usuário já está silenciado
            if (targetMember.isCommunicationDisabled()) {
                console.log('❌ Usuário já está silenciado');
                await this.warnUser(message, violations);
                return;
            }

            await targetMember.timeout(duration, `Moderação automática: ${violations[0].reason}`);
            
            const embed = new EmbedBuilder()
                .setTitle('🔇 Usuário Silenciado Automaticamente')
                .setColor('#FF0000')
                .setDescription(`Você foi silenciado por ${duration/60000} minutos por violar as regras.`)
                .addFields(
                    { name: '📝 Motivo', value: violations[0].reason, inline: false }
                )
                .setTimestamp();

            try {
                await message.author.send({ embeds: [embed] });
            } catch (error) {
                // Usuário tem DMs bloqueadas
            }
        } catch (error) {
            console.error('❌ Erro ao silenciar usuário:', error);
            // Fallback para aviso se não conseguir silenciar
            await this.warnUser(message, violations);
        }
    },

    async kickUser(message, violations) {
        try {
            // Verificar permissões antes de tentar expulsar
            const botMember = message.guild.members.me;
            const targetMember = message.member;

            if (!botMember.permissions.has(PermissionFlagsBits.KickMembers)) {
                console.log('❌ Bot não tem permissão para expulsar membros');
                await this.warnUser(message, violations);
                return;
            }

            if (!targetMember.kickable) {
                console.log('❌ Bot não pode expulsar este usuário');
                await this.warnUser(message, violations);
                return;
            }

            await targetMember.kick(`Moderação automática: ${violations[0].reason}`);
        } catch (error) {
            console.error('❌ Erro ao expulsar usuário:', error);
            await this.warnUser(message, violations);
        }
    },

    async banUser(message, violations) {
        try {
            // Verificar permissões antes de tentar banir
            const botMember = message.guild.members.me;
            const targetMember = message.member;

            if (!botMember.permissions.has(PermissionFlagsBits.BanMembers)) {
                console.log('❌ Bot não tem permissão para banir membros');
                await this.warnUser(message, violations);
                return;
            }

            if (!targetMember.bannable) {
                console.log('❌ Bot não pode banir este usuário');
                await this.warnUser(message, violations);
                return;
            }

            await targetMember.ban({ reason: `Moderação automática: ${violations[0].reason}` });
        } catch (error) {
            console.error('❌ Erro ao banir usuário:', error);
            await this.warnUser(message, violations);
        }
    },

    async logViolation(message, violations, action) {
        const logChannelId = process.env.LOG_CHANNEL_ID;
        if (!logChannelId) return;

        const logChannel = message.guild.channels.cache.get(logChannelId);
        if (!logChannel) return;

        const embed = new EmbedBuilder()
            .setTitle('🤖 Moderação Automática')
            .setColor('#FF0000')
            .addFields(
                { name: '👤 Usuário', value: `${message.author.tag} (${message.author.id})`, inline: true },
                { name: '📍 Canal', value: message.channel.name, inline: true },
                { name: '⚡ Ação', value: action.toUpperCase(), inline: true },
                { name: '📝 Violações', value: violations.map(v => `• ${v.reason}`).join('\n'), inline: false }
            )
            .setTimestamp();

        await logChannel.send({ embeds: [embed] });
    },

    async getModerationConfig(guildId) {
        // Configuração padrão de moderação
        return {
            enabled: true,
            antiSpam: {
                enabled: true,
                maxMessages: 5,
                timeWindow: 10000
            },
            wordFilter: {
                enabled: true,
                words: ['palavrão1', 'palavrão2', 'spam'],
                severity: 'medium'
            },
            linkFilter: {
                enabled: true,
                allowedDomains: ['discord.com', 'youtube.com', 'github.com'],
                suspiciousDomains: ['bit.ly', 'tinyurl.com']
            },
            capsFilter: {
                enabled: true,
                maxPercentage: 70
            },
            emojiFilter: {
                enabled: true,
                maxEmojis: 5
            },
            actions: {
                low: 'warn',
                medium: 'mute',
                high: 'kick'
            },
            muteDuration: 300000 // 5 minutos
        };
    }
}; 