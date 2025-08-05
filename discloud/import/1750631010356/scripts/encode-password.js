const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('🔐 Codificador de Senha para MongoDB');
console.log('=====================================');
console.log('Este script ajuda a codificar caracteres especiais na senha do MongoDB');
console.log('');

rl.question('Digite sua senha do MongoDB: ', (password) => {
    const encodedPassword = encodeURIComponent(password);
    
    console.log('');
    console.log('✅ Senha codificada:');
    console.log('📝 Original:', password);
    console.log('🔐 Codificada:', encodedPassword);
    console.log('');
    console.log('📋 Use a senha codificada na sua MONGODB_URI:');
    console.log(`mongodb+srv://usuario:${encodedPassword}@cluster.mongodb.net/bot-geralt?retryWrites=true&w=majority`);
    console.log('');
    console.log('💡 Caracteres especiais comuns:');
    console.log('   @ -> %40');
    console.log('   # -> %23');
    console.log('   % -> %25');
    console.log('   + -> %2B');
    console.log('   / -> %2F');
    console.log('   ? -> %3F');
    console.log('   = -> %3D');
    console.log('   & -> %26');
    
    rl.close();
}); 