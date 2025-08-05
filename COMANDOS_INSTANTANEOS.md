# ⚡ Comandos Instantâneos - Guia Rápido

## 🎯 **Problema:**

Comandos globais podem demorar **até 1 hora** para aparecer em todos os servidores.

## ✅ **Solução:**

Use comandos de **Guild** (servidor específico) para desenvolvimento - aparecem **instantaneamente**!

---

## 🔧 **Configuração Rápida:**

### **Passo 1: Obter ID do Servidor**

1. Ative o **Modo Desenvolvedor** no Discord:
   - Configurações → Avançado → Modo Desenvolvedor ✅
2. Clique com botão direito no seu servidor
3. Clique em **"Copiar ID do Servidor"**

### **Passo 2: Configurar .env**

Adicione esta linha no seu arquivo `.env`:

```env
# Para comandos instantâneos (desenvolvimento)
DISCORD_GUILD_ID=1234567890123456789

# Para comandos globais (produção)
# DISCORD_GUILD_ID= (deixe em branco)
```

### **Passo 3: Registrar Comandos**

```bash
# Para desenvolvimento (instantâneo)
npm run deploy-dev

# Para produção (global)
npm run deploy
```

---

## 📊 **Comparação:**

| Tipo       | Velocidade     | Escopo              | Uso                |
| ---------- | -------------- | ------------------- | ------------------ |
| **Guild**  | ⚡ Instantâneo | 🏠 1 servidor       | 🧪 Desenvolvimento |
| **Global** | ⏳ Até 1 hora  | 🌍 Todos servidores | 🚀 Produção        |

---

## 🎮 **Comandos Disponíveis:**

### **Moderação:**

- `/ban` - Banir usuários
- `/kick` - Expulsar usuários
- `/mute` - Silenciar usuários
- `/clear` - Limpar mensagens
- `/userinfo` - Informações de usuário
- `/warn` - Sistema de avisos
- `/permissions` - Verificar permissões

### **Automação:**

- `/automod` - Configurar moderação automática

### **Sistema:**

- `/ticket` - Sistema de tickets
- `/richpresence` - Gerenciar Rich Presence

---

## 🚀 **Fluxo de Trabalho:**

### **Desenvolvimento:**

```bash
# 1. Configure DISCORD_GUILD_ID no .env
# 2. Registre comandos instantâneos
npm run deploy-dev

# 3. Teste os comandos (aparecem imediatamente)
# 4. Faça alterações e teste novamente
```

### **Produção:**

```bash
# 1. Remova DISCORD_GUILD_ID do .env
# 2. Registre comandos globais
npm run deploy

# 3. Aguarde até 1 hora para propagação
```

---

## ⚠️ **Importante:**

### **Para Desenvolvimento:**

- ✅ Use `DISCORD_GUILD_ID` no `.env`
- ✅ Use `npm run deploy-dev`
- ✅ Comandos aparecem instantaneamente
- ✅ Apenas no servidor específico

### **Para Produção:**

- ✅ Remova `DISCORD_GUILD_ID` do `.env`
- ✅ Use `npm run deploy`
- ✅ Comandos globais (todos servidores)
- ✅ Pode demorar até 1 hora

---

## 🔍 **Verificar Configuração:**

### **Comando de Status:**

```bash
npm run deploy-dev
```

**Saída esperada:**

```
✅ Comandos registrados com sucesso no servidor de desenvolvimento!
🏠 Servidor: 1234567890123456789
⚡ Os comandos estarão disponíveis IMEDIATAMENTE!
```

### **Teste no Discord:**

1. Digite `/` no chat
2. Os comandos devem aparecer instantaneamente
3. Teste um comando (ex: `/richpresence status`)

---

## 🛠️ **Solução de Problemas:**

### **Erro: "Invalid Form Body"**

- Verifique se o `DISCORD_GUILD_ID` está correto
- Certifique-se de que o bot está no servidor

### **Comandos Não Aparecem**

- Use `npm run deploy-dev` novamente
- Verifique se o bot tem permissões no servidor
- Confirme se o `DISCORD_GUILD_ID` está correto

### **Erro de Token**

- Verifique se o `DISCORD_TOKEN` está correto
- Confirme se o bot está online

---

## 📝 **Exemplo de .env:**

```env
# Configurações do Bot Discord
DISCORD_TOKEN=seu_token_aqui
DISCORD_CLIENT_ID=seu_client_id_aqui

# Para desenvolvimento (comandos instantâneos)
DISCORD_GUILD_ID=1234567890123456789

# Para produção (comandos globais)
# DISCORD_GUILD_ID=

# Outras configurações...
MONGODB_URI=sua_uri_aqui
LOG_CHANNEL_ID=id_do_canal
```

---

## 🎯 **Resumo:**

- **Desenvolvimento:** `DISCORD_GUILD_ID` + `npm run deploy-dev` = ⚡ Instantâneo
- **Produção:** Sem `DISCORD_GUILD_ID` + `npm run deploy` = 🌍 Global

**Agora seus comandos aparecem instantaneamente!** 🚀✨
