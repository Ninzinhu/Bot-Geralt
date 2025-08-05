# 🚀 Deploy no Render - Bot Geralt

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Preparação](#preparação)
3. [Deploy no Render](#deploy-no-render)
4. [Configuração de Variáveis](#configuração-de-variáveis)
5. [Verificação](#verificação)
6. [Solução de Problemas](#solução-de-problemas)

---

## 🎯 Visão Geral

O **Render** é uma plataforma gratuita que oferece:

- ✅ **Deploy automático** via GitHub
- ✅ **SSL gratuito** automático
- ✅ **Domínio personalizado** gratuito
- ✅ **Uptime 24/7** (com algumas limitações)
- ✅ **Logs em tempo real**
- ✅ **Escalabilidade** automática

---

## 🔧 Preparação

### **1. Verificar Configuração Local:**

```bash
# Testar se tudo está pronto
npm run test-deploy
```

### **2. Garantir que o Repositório está Atualizado:**

```bash
git add .
git commit -m "🚀 Preparando para deploy no Render"
git push origin master
```

### **3. Verificar Arquivos Essenciais:**

- ✅ `package.json` - Scripts e dependências
- ✅ `render.yaml` - Configuração do Render
- ✅ `src/index.js` - Arquivo principal
- ✅ `.env.example` - Template de variáveis

---

## 🚀 Deploy no Render

### **Passo 1: Criar Conta no Render**

1. Acesse [render.com](https://render.com)
2. Clique em **"Sign Up"**
3. Faça login com **GitHub**
4. Autorize o acesso ao seu repositório

### **Passo 2: Criar Novo Web Service**

1. No dashboard do Render, clique em **"New +"**
2. Selecione **"Web Service"**
3. Clique em **"Connect"** no seu repositório `Bot-Geralt`

### **Passo 3: Configurar o Serviço**

```
Name: bot-geralt
Environment: Node
Region: Oregon (US West) [Recomendado]
Branch: master
Root Directory: (deixe vazio)
Build Command: npm install
Start Command: npm start
```

### **Passo 4: Configurar Plano**

- **Plan:** Free
- **Auto-Deploy:** Yes
- **Health Check Path:** `/`

---

## ⚙️ Configuração de Variáveis

### **Variáveis Obrigatórias:**

#### **DISCORD_TOKEN**

```
Key: DISCORD_TOKEN
Value: seu_token_do_bot_aqui
```

#### **MONGODB_URI**

```
Key: MONGODB_URI
Value: mongodb+srv://usuario:senha@cluster.mongodb.net/bot-geralt
```

### **Variáveis Opcionais:**

#### **LOG_CHANNEL_ID**

```
Key: LOG_CHANNEL_ID
Value: 1234567890123456789
```

#### **MODERATOR_ROLE_ID**

```
Key: MODERATOR_ROLE_ID
Value: 1234567890123456789
```

#### **STAFF_ROLE_ID**

```
Key: STAFF_ROLE_ID
Value: 1234567890123456789
```

#### **WEBHOOK_PORT**

```
Key: WEBHOOK_PORT
Value: 10000
```

#### **NODE_ENV**

```
Key: NODE_ENV
Value: production
```

### **Como Configurar:**

1. No seu serviço no Render, vá em **"Environment"**
2. Clique em **"Add Environment Variable"**
3. Adicione cada variável conforme acima
4. Clique em **"Save Changes"**

---

## ✅ Verificação

### **1. Verificar Deploy:**

- ✅ **Build Status:** Succeeded
- ✅ **Deploy Status:** Live
- ✅ **Health Check:** Passing

### **2. Verificar Logs:**

1. Vá em **"Logs"** no seu serviço
2. Procure por:

```
🗄️ Conectado ao MongoDB com sucesso!
🤖 Bot Geralt está online!
🌐 Webhook server rodando na porta 10000
```

### **3. Testar Bot:**

1. Vá para seu servidor Discord
2. Use `/permissions verificar`
3. Teste um comando: `/userinfo`

### **4. Verificar Healthcheck:**

Acesse: `https://seu-app.onrender.com/`
Deve retornar:

```json
{
  "status": "online",
  "bot": "Bot Geralt#1234",
  "uptime": 123.45,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

## 🛠️ Solução de Problemas

### **Problema: "Build Failed"**

**Causa:** Erro na instalação de dependências
**Solução:**

1. Verifique se `package.json` está correto
2. Verifique se todas as dependências estão listadas
3. Veja os logs de build para detalhes

### **Problema: "Deploy Failed"**

**Causa:** Erro no comando de start
**Solução:**

1. Verifique se `npm start` funciona localmente
2. Verifique se todas as variáveis estão configuradas
3. Veja os logs de deploy

### **Problema: "Bot não conecta"**

**Causa:** Token do Discord incorreto
**Solução:**

1. Verifique se `DISCORD_TOKEN` está correto
2. Verifique se o bot tem permissões no servidor
3. Verifique se o bot está online no Developer Portal

### **Problema: "MongoDB não conecta"**

**Causa:** URI do MongoDB incorreto
**Solução:**

1. Verifique se `MONGODB_URI` está correto
2. Verifique se o IP está liberado no MongoDB Atlas
3. Verifique se o usuário e senha estão corretos

### **Problema: "Health Check Failed"**

**Causa:** Rota `/` não está respondendo
**Solução:**

1. Verifique se o servidor Express está rodando
2. Verifique se a porta está correta
3. Veja os logs para erros

---

## 📊 Monitoramento

### **Logs em Tempo Real:**

- Acesse **"Logs"** no Render
- Veja logs em tempo real
- Filtre por erro, warning, info

### **Métricas:**

- **Uptime:** Disponível no dashboard
- **Response Time:** Monitorado automaticamente
- **Requests:** Contador de requisições

### **Alertas:**

- **Deploy Failed:** Notificação automática
- **Health Check Failed:** Notificação automática
- **Build Failed:** Notificação automática

---

## 🔄 Atualizações

### **Deploy Automático:**

- ✅ **Push para master** = Deploy automático
- ✅ **Sem configuração** adicional necessária
- ✅ **Rollback** automático em caso de erro

### **Deploy Manual:**

1. Vá em **"Manual Deploy"**
2. Selecione **"Deploy latest commit"**
3. Aguarde o deploy completar

---

## 💰 Custos

### **Plano Gratuito:**

- ✅ **$0/mês** - Sempre gratuito
- ✅ **512MB RAM** - Suficiente para o bot
- ✅ **0.1 CPU** - Performance adequada
- ⚠️ **Sleep após 15min** - Bot "dorme" se não usado
- ⚠️ **750 horas/mês** - Limite de uso

### **Plano Pago ($7/mês):**

- ✅ **Sempre online** - Sem sleep
- ✅ **1GB RAM** - Mais performance
- ✅ **0.5 CPU** - Melhor performance
- ✅ **Logs ilimitados** - Histórico completo

---

## 🎯 Dicas Importantes

### **1. Performance:**

- Use **Oregon (US West)** para melhor performance
- Configure **health check** corretamente
- Monitore **logs** regularmente

### **2. Segurança:**

- **Nunca** commite tokens no GitHub
- Use **variáveis de ambiente** sempre
- Configure **permissões** corretas no Discord

### **3. Manutenção:**

- Monitore **uptime** regularmente
- Verifique **logs** semanalmente
- Teste **comandos** após updates

---

## 📞 Suporte

### **Render Support:**

- **Documentação:** [docs.render.com](https://docs.render.com)
- **Community:** [community.render.com](https://community.render.com)
- **Status:** [status.render.com](https://status.render.com)

### **Bot Geralt Support:**

- **Comando:** `/permissions verificar`
- **Logs:** Verifique logs no Render
- **GitHub:** Issues no repositório

---

## 🎉 Próximos Passos

1. **Configure o Render** seguindo este guia
2. **Teste o bot** com `/permissions verificar`
3. **Monitore logs** para garantir funcionamento
4. **Configure alertas** se necessário
5. **Compartilhe** o bot com sua comunidade!

**Bot Geralt - Deployado no Render com Sucesso!** 🚀🤖✨
