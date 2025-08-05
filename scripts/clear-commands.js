const { REST, Routes } = require('discord.js');
require('dotenv').config();

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('🧹 Limpando comandos antigos...');
        
        if (process.env.DISCORD_GUILD_ID) {
            // Limpar comandos de guild (desenvolvimento)
            await rest.put(
                Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID),
                { body: [] },
            );
            console.log('✅ Comandos de guild limpos com sucesso!');
            console.log(`🏠 Servidor: ${process.env.DISCORD_GUILD_ID}`);
        } else {
            // Limpar comandos globais (produção)
            await rest.put(
                Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
                { body: [] },
            );
            console.log('✅ Comandos globais limpos com sucesso!');
        }
        
        console.log('🎯 Agora execute: npm run deploy-dev (para desenvolvimento) ou npm run deploy (para produção)');
        
    } catch (error) {
        console.error('❌ Erro ao limpar comandos:', error);
    }
})(); 