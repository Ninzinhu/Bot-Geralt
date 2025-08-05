const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const commands = [];
const commandsPath = path.join(__dirname, '..', 'src', 'commands');
const commandFolders = fs.readdirSync(commandsPath);

console.log('🔍 Procurando comandos...');

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
        
        // Verificar se é modo desenvolvimento (com GUILD_ID) ou produção (global)
        if (process.env.DISCORD_GUILD_ID) {
            // Modo desenvolvimento - comandos instantâneos
            await rest.put(
                Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID),
                { body: commands },
            );
            console.log('✅ Comandos registrados com sucesso no servidor de desenvolvimento!');
            console.log(`🏠 Servidor: ${process.env.DISCORD_GUILD_ID}`);
            console.log('⚡ Os comandos estarão disponíveis IMEDIATAMENTE!');
        } else {
            // Modo produção - comandos globais
            await rest.put(
                Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
                { body: commands },
            );
            console.log('✅ Comandos globais registrados com sucesso!');
            console.log('🌍 Os comandos estarão disponíveis em todos os servidores em até 1 hora.');
        }

        console.log('\n📋 Comandos disponíveis:');
        commands.forEach(cmd => {
            console.log(`   • /${cmd.name} - ${cmd.description}`);
        });

        if (!process.env.DISCORD_GUILD_ID) {
            console.log('\n⚠️  Nota: Comandos globais podem demorar até 1 hora para aparecer em todos os servidores.');
            console.log('💡 Para desenvolvimento, adicione DISCORD_GUILD_ID no seu .env para comandos instantâneos.');
        }

    } catch (error) {
        console.error('❌ Erro ao registrar comandos:', error);
    }
})(); 