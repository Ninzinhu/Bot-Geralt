const { REST, Routes } = require('discord.js');
const { config } = require('dotenv');
const fs = require('fs');
const path = require('path');

// Carregar variáveis de ambiente
config();

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsPath);

for (const folder of commandFolders) {
    const folderPath = path.join(commandsPath, folder);
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
    
    for (const file of commandFiles) {
        const filePath = path.join(folderPath, file);
        const command = require(filePath);
        
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
            console.log(`⚔️ Comando carregado: ${command.data.name}`);
        } else {
            console.log(`⚠️ Comando em ${filePath} está faltando propriedades obrigatórias.`);
        }
    }
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log(`🔄 Registrando ${commands.length} comandos...`);

        // Verificar se é para um servidor específico ou global
        const isGlobal = !process.env.DISCORD_GUILD_ID;
        
        if (isGlobal) {
            // Comandos globais (funcionam em todos os servidores)
            const data = await rest.put(
                Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
                { body: commands },
            );
            console.log(`✅ ${data.length} comandos globais registrados com sucesso!`);
            console.log('🌍 Os comandos estarão disponíveis em todos os servidores em até 1 hora.');
        } else {
            // Comandos para servidor específico (mais rápido para desenvolvimento)
            const data = await rest.put(
                Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID),
                { body: commands },
            );
            console.log(`✅ ${data.length} comandos registrados para o servidor específico!`);
        }

        console.log('');
        console.log('📋 Comandos disponíveis:');
        commands.forEach(cmd => {
            console.log(`   • /${cmd.name} - ${cmd.description}`);
        });
        
        if (isGlobal) {
            console.log('');
            console.log('⚠️  Nota: Comandos globais podem demorar até 1 hora para aparecer em todos os servidores.');
            console.log('💡 Para desenvolvimento, você pode usar DISCORD_GUILD_ID para comandos instantâneos.');
        }
        
    } catch (error) {
        console.error('❌ Erro ao registrar comandos:', error);
    }
})(); 