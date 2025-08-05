# 🚀 Deploy Gratuito 24h - Bot Geralt

## 📋 Índice

1. [Opções Gratuitas](#opções-gratuitas)
2. [Railway (Recomendado)](#railway-recomendado)
3. [Render](#render)
4. [Heroku](#heroku)
5. [Discloud](#discloud)
6. [Configuração de Variáveis](#configuração-de-variáveis)
7. [Solução de Problemas](#solução-de-problemas)

---

## 🆓 Opções Gratuitas

### **Ranking das Melhores Opções:**

1. **🥇 Railway** - Melhor opção gratuita
2. **🥈 Render** - Muito bom, interface amigável
3. **🥉 Heroku** - Popular, muitos tutoriais
4. **🏅 Discloud** - Especializado em bots Discord

---

## 🚂 Railway (Recomendado)

### **Vantagens:**

- ✅ **Totalmente gratuito** para projetos pequenos
- ✅ **Deploy automático** do GitHub
- ✅ **SSL automático**
- ✅ **Muito fácil de configurar**
- ✅ **Sem cartão de crédito**
- ✅ **Uptime 99.9%**

### **Passo a Passo:**

#### **1. Preparar o Projeto**

```bash
# Certifique-se de que tudo está no GitHub
git add .
git commit -m "Preparando para deploy"
git push origin main
```

#### **2. Criar Conta no Railway**

1. Vá para [railway.app](https://railway.app)
2. Clique em "Login with GitHub"
3. Autorize o Railway

#### **3. Deploy Automático**

1. Clique em "New Project"
2. Selecione "Deploy from GitHub repo"
3. Escolha seu repositório `Bot-Geralt`
4. Clique em "Deploy Now"

#### **4. Configurar Variáveis**

1. Vá em "Variables"
2. Adicione suas variáveis de ambiente:

```env
DISCORD_TOKEN=seu_token_aqui
DISCORD_CLIENT_ID=seu_client_id_aqui
MONGODB_URI=sua_uri_mongodb
LOG_CHANNEL_ID=id_do_canal
MODERATOR_ROLE_ID=id_do_cargo
```

#### **5. Verificar Deploy**

1. Vá em "Deployments"
2. Aguarde o build completar
3. Verifique os logs

### **URL do Bot:**

- Railway fornece uma URL automática
- Exemplo: `https://bot-geralt-production.up.railway.app`

---

## 🌐 Render

### **Vantagens:**

- ✅ **750h gratuitas/mês**
- ✅ **Deploy automático**
- ✅ **SSL automático**
- ✅ **Interface amigável**

### **Passo a Passo:**

#### **1. Criar Conta**

1. Vá para [render.com](https://render.com)
2. Faça login com GitHub

#### **2. Novo Web Service**

1. Clique em "New +"
2. Selecione "Web Service"
3. Conecte seu repositório

#### **3. Configuração**

```yaml
Name: bot-geralt
Environment: Node
Build Command: npm install
Start Command: npm start
```

#### **4. Variáveis de Ambiente**

Adicione as mesmas variáveis do Railway

---

## 🐘 Heroku

### **Vantagens:**

- ✅ **Muito popular**
- ✅ **Muitos tutoriais**
- ✅ **Interface familiar**

### **Limitações:**

- ❌ **Plano gratuito removido** (agora pago)
- ❌ **Precisa cartão de crédito**

### **Alternativa Gratuita:**

Use **Railway** ou **Render** que são gratuitos sem cartão.

---

## 🚀 Discloud

### **Vantagens:**

- ✅ **Especializado em bots Discord**
- ✅ **Otimizado para bots**
- ✅ **Interface específica**

### **Passo a Passo:**

#### **1. Criar Conta**

1. Vá para [discloud.app](https://discloud.app)
2. Faça login com Discord

#### **2. Upload do Bot**

1. Clique em "Upload App"
2. Faça upload do arquivo ZIP do projeto
3. Configure as variáveis

---

## 🔧 Configuração de Variáveis

### **Variáveis Obrigatórias:**

```env
# Discord Bot
DISCORD_TOKEN=seu_token_do_bot
DISCORD_CLIENT_ID=seu_client_id

# MongoDB
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/bot-geralt

# Moderação
LOG_CHANNEL_ID=123456789012345678
MODERATOR_ROLE_ID=123456789012345678

# Tickets (Opcional)
TICKET_CATEGORY_ID=123456789012345678
STAFF_ROLE_ID=123456789012345678
```

### **Como Obter as Variáveis:**

#### **DISCORD_TOKEN:**

1. Vá para [Discord Developer Portal](https://discord.com/developers/applications)
2. Selecione sua aplicação
3. Vá em "Bot"
4. Clique em "Reset Token"
5. Copie o token

#### **DISCORD_CLIENT_ID:**

1. No Developer Portal
2. Vá em "General Information"
3. Copie o "Application ID"

#### **MONGODB_URI:**

1. Vá para [MongoDB Atlas](https://cloud.mongodb.com)
2. Crie um cluster gratuito
3. Clique em "Connect"
4. Escolha "Connect your application"
5. Copie a URI

---

## 🛠️ Solução de Problemas

### **Erro: "Build Failed"**

**Problema:** Erro durante o build
**Soluções:**

1. Verifique se o `package.json` está correto
2. Verifique se todas as dependências estão listadas
3. Verifique os logs de erro

### **Erro: "Application Error"**

**Problema:** Bot não inicia
**Soluções:**

1. Verifique se as variáveis estão configuradas
2. Verifique se o token está correto
3. Verifique os logs de erro

### **Erro: "MongoDB Connection Failed"**

**Problema:** Não conecta ao banco
**Soluções:**

1. Verifique se a URI está correta
2. Verifique se o IP está liberado no MongoDB
3. Verifique se as credenciais estão corretas

### **Bot Offline**

**Problema:** Bot não aparece online
**Soluções:**

1. Verifique se o deploy foi bem-sucedido
2. Verifique se as variáveis estão corretas
3. Verifique os logs do Railway/Render

### **Comandos Não Funcionam**

**Problema:** Slash commands não aparecem
**Soluções:**

1. Execute `npm run deploy` após o deploy
2. Aguarde até 1 hora para comandos globais
3. Use `DISCORD_GUILD_ID` para comandos instantâneos

---

## 📊 Comparação de Plataformas

| Plataforma   | Gratuito | Fácil      | Uptime | Especializado |
| ------------ | -------- | ---------- | ------ | ------------- |
| **Railway**  | ✅ Sim   | ⭐⭐⭐⭐⭐ | 99.9%  | ❌ Não        |
| **Render**   | ✅ Sim   | ⭐⭐⭐⭐   | 99.5%  | ❌ Não        |
| **Heroku**   | ❌ Não   | ⭐⭐⭐     | 99.9%  | ❌ Não        |
| **Discloud** | ✅ Sim   | ⭐⭐⭐     | 99.8%  | ✅ Sim        |

---

## 🎯 Recomendação Final

### **Para Iniciantes:**

**Use Railway** - É o mais fácil e gratuito

### **Para Experientes:**

**Use Render** - Mais recursos, ainda gratuito

### **Para Especialistas:**

**Use Discloud** - Especializado em bots Discord

---

## 🚀 Próximos Passos

1. **Escolha uma plataforma** (Railway recomendado)
2. **Faça o deploy** seguindo o guia
3. **Configure as variáveis** de ambiente
4. **Teste o bot** no Discord
5. **Monitore os logs** para problemas

### **Comandos Úteis:**

```bash
# Verificar status
npm run deploy

# Testar localmente
npm start

# Ver logs (no Railway/Render)
# Acesse a interface web da plataforma
```

---

## 📞 Suporte

Se precisar de ajuda:

1. Verifique este guia
2. Consulte a documentação da plataforma
3. Verifique os logs de erro
4. Entre em contato com o desenvolvedor

**Bot Geralt - Deploy Gratuito 24h** 🚀🤖✨
