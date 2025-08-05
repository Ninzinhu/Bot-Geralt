const { config } = require('dotenv');
const fs = require('fs');
const path = require('path');

// Carregar variáveis de ambiente
config();

console.log('🔍 Testando configuração para deploy...\n');

// Verificar variáveis de ambiente essenciais
const requiredEnvVars = [
    'DISCORD_TOKEN'
];

const optionalEnvVars = [
    'DISCORD_GUILD_ID',
    'LOG_CHANNEL_ID',
    'MODERATOR_ROLE_ID',
    'STAFF_ROLE_ID',
    'WEBHOOK_PORT',
    'MONGODB_URI'
];

console.log('📋 Verificando variáveis de ambiente...');

// Verificar variáveis obrigatórias
let allRequired = true;
for (const envVar of requiredEnvVars) {
    if (process.env[envVar]) {
        console.log(`✅ ${envVar}: Configurado`);
    } else {
        console.log(`❌ ${envVar}: Não configurado`);
        allRequired = false;
    }
}

console.log('\n📋 Verificando variáveis opcionais...');

// Verificar variáveis opcionais
for (const envVar of optionalEnvVars) {
    if (process.env[envVar]) {
        console.log(`✅ ${envVar}: Configurado`);
    } else {
        console.log(`⚠️ ${envVar}: Não configurado (opcional)`);
    }
}

// Verificar arquivos essenciais
console.log('\n📁 Verificando arquivos essenciais...');

const essentialFiles = [
    'src/index.js',
    'src/database/database.js',
    'package.json',
    'railway.json'
];

for (const file of essentialFiles) {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file}: Existe`);
    } else {
        console.log(`❌ ${file}: Não encontrado`);
        allRequired = false;
    }
}

// Verificar comandos
console.log('\n⚔️ Verificando comandos...');

const commandsPath = path.join(__dirname, '..', 'src', 'commands');
if (fs.existsSync(commandsPath)) {
    const commandFolders = fs.readdirSync(commandsPath);
    let totalCommands = 0;
    
    for (const folder of commandFolders) {
        const folderPath = path.join(commandsPath, folder);
        if (fs.statSync(folderPath).isDirectory()) {
            const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
            totalCommands += commandFiles.length;
            console.log(`✅ ${folder}: ${commandFiles.length} comando(s)`);
        }
    }
    
    console.log(`📊 Total de comandos: ${totalCommands}`);
} else {
    console.log('❌ Pasta de comandos não encontrada');
    allRequired = false;
}

// Verificar eventos
console.log('\n🎯 Verificando eventos...');

const eventsPath = path.join(__dirname, '..', 'src', 'events');
if (fs.existsSync(eventsPath)) {
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
    console.log(`✅ Eventos: ${eventFiles.length} evento(s)`);
    
    for (const file of eventFiles) {
        console.log(`  - ${file}`);
    }
} else {
    console.log('❌ Pasta de eventos não encontrada');
    allRequired = false;
}

// Verificar dependências
console.log('\n📦 Verificando dependências...');

if (fs.existsSync('package.json')) {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const dependencies = Object.keys(packageJson.dependencies || {});
    console.log(`✅ Dependências: ${dependencies.length} pacote(s)`);
    
    // Verificar dependências críticas
    const criticalDeps = ['discord.js', 'express'];
    for (const dep of criticalDeps) {
        if (packageJson.dependencies[dep]) {
            console.log(`  ✅ ${dep}: ${packageJson.dependencies[dep]}`);
        } else {
            console.log(`  ❌ ${dep}: Não encontrado`);
            allRequired = false;
        }
    }
}

// Verificar scripts
console.log('\n🔧 Verificando scripts...');

if (fs.existsSync('package.json')) {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const scripts = Object.keys(packageJson.scripts || {});
    
    const requiredScripts = ['start', 'deploy'];
    for (const script of requiredScripts) {
        if (packageJson.scripts[script]) {
            console.log(`✅ ${script}: Configurado`);
        } else {
            console.log(`❌ ${script}: Não configurado`);
            allRequired = false;
        }
    }
}

// Resultado final
console.log('\n' + '='.repeat(50));

if (allRequired) {
    console.log('🎉 TUDO PRONTO PARA DEPLOY!');
    console.log('\n📋 Próximos passos:');
    console.log('1. Faça commit das mudanças: git add . && git commit -m "message"');
    console.log('2. Faça push: git push origin master');
    console.log('3. Deploy no Railway/Render/Heroku');
    console.log('4. Configure as variáveis de ambiente na plataforma');
    console.log('5. Use /permissions verificar para testar');
} else {
    console.log('❌ PROBLEMAS ENCONTRADOS!');
    console.log('\n🔧 Corrija os problemas acima antes do deploy');
    console.log('1. Configure as variáveis de ambiente obrigatórias');
    console.log('2. Verifique se todos os arquivos existem');
    console.log('3. Teste novamente: node scripts/test-deploy.js');
}

console.log('\n' + '='.repeat(50)); 