const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { config } = require('dotenv');
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const Database = require('./database/database');
const WebhookHandler = require('./webhooks/webhookHandler');
const { Events } = require('discord.js');

// Carregar variáveis de ambiente
config();

class BotGeralt {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildPresences
            ]
        });

        this.client.commands = new Collection();
        this.database = new Database();
        this.webhookHandler = new WebhookHandler(this.client, this.database);
        
        this.setupExpress();
        this.loadCommands();
        this.loadEvents();
        this.setupEventHandlers();
    }

    setupExpress() {
        this.app = express();
        this.app.use(cors());
        this.app.use(express.json());

        // Rota para webhook do SaaS
        this.app.post('/webhook/saas', (req, res) => {
            this.webhookHandler.handleSaasWebhook(req, res);
        });

        // Rota de health check
        this.app.get('/health', (req, res) => {
            res.json({ status: 'online', bot: this.client.user?.tag || 'Iniciando...' });
        });

        const port = process.env.WEBHOOK_PORT || 3000;
        this.app.listen(port, () => {
            console.log(`🌐 Webhook server rodando na porta ${port}`);
        });
    }

    loadCommands() {
        const commandsPath = path.join(__dirname, 'commands');
        const commandFolders = fs.readdirSync(commandsPath);

        for (const folder of commandFolders) {
            const folderPath = path.join(commandsPath, folder);
            const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
            
            for (const file of commandFiles) {
                const filePath = path.join(folderPath, file);
                const command = require(filePath);
                
                if ('data' in command && 'execute' in command) {
                    this.client.commands.set(command.data.name, command);
                    console.log(`⚔️ Comando carregado: ${command.data.name}`);
                }
            }
        }
    }

    loadEvents() {
        const eventsPath = path.join(__dirname, 'events');
        const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

        for (const file of eventFiles) {
            const filePath = path.join(eventsPath, file);
            const event = require(filePath);
            
            if (event.once) {
                this.client.once(event.name, (...args) => event.execute(...args, this.database));
            } else {
                this.client.on(event.name, (...args) => event.execute(...args, this.database));
            }
            console.log(`🎯 Evento carregado: ${event.name}`);
        }
    }

    setupEventHandlers() {
        this.client.on('interactionCreate', async interaction => {
            if (!interaction.isChatInputCommand()) return;

            const command = this.client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction, this.database);
            } catch (error) {
                console.error(`❌ Erro ao executar comando ${interaction.commandName}:`, error);
                
                const errorMessage = 'Houve um erro ao executar este comando!';
                
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: errorMessage, ephemeral: true });
                } else {
                    await interaction.reply({ content: errorMessage, ephemeral: true });
                }
            }
        });
    }

    async start() {
        try {
            await this.database.init();
            console.log('🗄️ Banco de dados inicializado');
            
            await this.client.login(process.env.DISCORD_TOKEN);
            console.log('🤖 Bot Geralt está online!');
        } catch (error) {
            console.error('❌ Erro ao iniciar o bot:', error);
            process.exit(1);
        }
    }
}

// Iniciar o bot
const bot = new BotGeralt();
bot.start();

// Tratamento de erros não capturados
process.on('unhandledRejection', error => {
    console.error('❌ Erro não tratado:', error);
});

process.on('uncaughtException', error => {
    console.error('❌ Exceção não capturada:', error);
    process.exit(1);
}); 