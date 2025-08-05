# ⚙️ Configuração do Bot Geralt (Sem MongoDB)

## 📋 Variáveis de Ambiente

### **Obrigatórias:**
```env
DISCORD_TOKEN=seu_token_aqui
```

### **Opcionais:**
```env
DISCORD_GUILD_ID=1234567890123456789
LOG_CHANNEL_ID=1234567890123456789
MODERATOR_ROLE_ID=1234567890123456789
STAFF_ROLE_ID=1234567890123456789
WEBHOOK_PORT=3000
```

## 🚀 Deploy no Render

### **Variáveis Necessárias:**
1. **DISCORD_TOKEN** - Token do seu bot Discord
2. **NODE_ENV** - production (configurado automaticamente)

### **Variáveis Opcionais:**
1. **LOG_CHANNEL_ID** - ID do canal de logs
2. **MODERATOR_ROLE_ID** - ID do cargo de moderador
3. **STAFF_ROLE_ID** - ID do cargo de staff
4. **WEBHOOK_PORT** - Porta do servidor (padrão: 10000)

## ✅ Funcionalidades Disponíveis

### **Moderação:**
- ✅ `/ban` - Banir usuários
- ✅ `/kick` - Expulsar usuários
- ✅ `/mute` - Silenciar usuários
- ✅ `/clear` - Limpar mensagens
- ✅ `/warn` - Sistema de avisos (memória temporária)
- ✅ `/userinfo` - Informações de usuário
- ✅ `/automod` - Moderação automática (memória temporária)

### **Música:**
- ✅ `/play` - Tocar música
- ✅ `/pause` - Pausar música
- ✅ `/resume` - Retomar música
- ✅ `/skip` - Pular música
- ✅ `/stop` - Parar música
- ✅ `/queue` - Ver fila
- ✅ `/volume` - Controlar volume

### **Sistema:**
- ✅ `/permissions` - Verificar permissões
- ✅ `/richpresence` - Gerenciar Rich Presence
- ✅ `/ticket` - Sistema de tickets (memória temporária)

## ⚠️ Limitações (Sem MongoDB)

### **Dados Temporários:**
- ⚠️ **Avisos** - Perdidos ao reiniciar o bot
- ⚠️ **Configurações de Automod** - Perdidas ao reiniciar
- ⚠️ **Tickets** - Perdidos ao reiniciar
- ⚠️ **Webhooks** - Desabilitados temporariamente

### **Solução Futura:**
Para persistência de dados, adicione MongoDB posteriormente:
```env
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/bot-geralt?retryWrites=true&w=majority
```

## 🎯 Próximos Passos

1. **Configure apenas DISCORD_TOKEN** no Render
2. **Deploy automático** funcionará
3. **Teste os comandos** de moderação e música
4. **Adicione MongoDB** quando necessário

**Bot Geralt - Funcionando sem MongoDB!** 🤖✅✨ 