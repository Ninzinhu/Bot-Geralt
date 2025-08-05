const fs = require('fs');
const path = require('path');

console.log('🚀 Preparando projeto para deploy...');

// Verificar se o .env existe
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
    console.log('⚠️  Arquivo .env não encontrado!');
    console.log('📝 Criando arquivo .env.example...');
    
    const envExample = `# Configurações do Bot Discord
DISCORD_TOKEN=seu_token_do_bot_aqui
DISCORD_CLIENT_ID=seu_client_id_aqui
DISCORD_GUILD_ID=1290829198415364118

# Configurações do MongoDB
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/bot-geralt?retryWrites=true&w=majority

# Configurações de Moderação
LOG_CHANNEL_ID=id_do_canal_de_logs
MODERATOR_ROLE_ID=id_do_cargo_de_moderador

# Configurações de Tickets (Opcional)
TICKET_CATEGORY_ID=id_da_categoria_de_tickets
STAFF_ROLE_ID=id_da_role_da_staff

# Configurações de Moderação Automática (Opcional)
# AUTO_MOD_ENABLED=true
# ANTI_SPAM_MAX_MESSAGES=5
# ANTI_SPAM_TIME_WINDOW=10
# WORD_FILTER_ENABLED=true
# LINK_FILTER_ENABLED=true
# CAPS_FILTER_MAX_PERCENTAGE=70
# EMOJI_FILTER_MAX_EMOJIS=5
`;

    fs.writeFileSync(envPath, envExample);
    console.log('✅ Arquivo .env criado!');
} else {
    console.log('✅ Arquivo .env encontrado!');
}

// Verificar dependências
const packagePath = path.join(__dirname, '..', 'package.json');
if (fs.existsSync(packagePath)) {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    console.log('✅ package.json encontrado!');
    console.log(`📦 Dependências: ${Object.keys(packageJson.dependencies || {}).length}`);
} else {
    console.log('❌ package.json não encontrado!');
}

// Verificar arquivos essenciais
const essentialFiles = [
    'src/index.js',
    'src/music/musicManager.js',
    'src/commands/music/play.js',
    'src/commands/moderation/ban.js',
    'railway.json'
];

console.log('\n📋 Verificando arquivos essenciais:');
essentialFiles.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} - FALTANDO!`);
    }
});

// Verificar estrutura de comandos
const commandsPath = path.join(__dirname, '..', 'src', 'commands');
if (fs.existsSync(commandsPath)) {
    const commandFolders = fs.readdirSync(commandsPath);
    console.log(`\n🎮 Comandos encontrados: ${commandFolders.length} pastas`);
    commandFolders.forEach(folder => {
        const folderPath = path.join(commandsPath, folder);
        const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.js'));
        console.log(`  📁 ${folder}: ${files.length} comandos`);
    });
}

console.log('\n🎯 Checklist para Deploy:');
console.log('1. ✅ Projeto preparado');
console.log('2. ⏳ Configure as variáveis de ambiente no Railway/Render');
console.log('3. ⏳ Faça o deploy na plataforma escolhida');
console.log('4. ⏳ Teste o bot no Discord');
console.log('5. ⏳ Monitore os logs');

console.log('\n📚 Guias disponíveis:');
console.log('- DEPLOY_GUIDE.md - Guia completo de deploy');
console.log('- MUSIC_GUIDE.md - Guia do sistema de música');
console.log('- MODERATION_GUIDE.md - Guia de moderação');

console.log('\n🚀 Próximos passos:');
console.log('1. Vá para railway.app ou render.com');
console.log('2. Conecte seu repositório GitHub');
console.log('3. Configure as variáveis de ambiente');
console.log('4. Deploy automático!');

console.log('\n✅ Projeto pronto para deploy! 🎉'); 