# 🗄️ MongoDB Troubleshooting - Bot Geralt

## 📋 Índice
1. [Erro Comum](#erro-comum)
2. [Solução Passo a Passo](#solução-passo-a-passo)
3. [Teste de Conexão](#teste-de-conexão)
4. [Configuração MongoDB Atlas](#configuração-mongodb-atlas)
5. [Solução de Problemas](#solução-de-problemas)

---

## ❌ Erro Comum

```
MongooseServerSelectionError: Could not connect to any servers in your MongoDB Atlas cluster. 
One common reason is that you're trying to access the database from an IP that isn't whitelisted.
```

**Causa:** IP do Render não está liberado no MongoDB Atlas

---

## 🔧 Solução Passo a Passo

### **Passo 1: Acessar MongoDB Atlas**
1. Vá para [cloud.mongodb.com](https://cloud.mongodb.com)
2. Faça login na sua conta
3. Selecione seu cluster

### **Passo 2: Liberar IP do Render**
1. No menu lateral, clique em **"Network Access"**
2. Clique em **"ADD IP ADDRESS"**
3. Configure:

```
IP Address: 0.0.0.0/0
Description: Render - All IPs
```

### **Passo 3: Verificar Database Access**
1. No menu lateral, clique em **"Database Access"**
2. Verifique se seu usuário tem permissões
3. Se necessário, crie um novo usuário:

```
Username: bot-geralt
Password: (senha forte)
Database User Privileges: Atlas admin
```

### **Passo 4: Verificar Connection String**
Certifique-se de que sua `MONGODB_URI` está correta:

```
mongodb+srv://usuario:senha@cluster.28gqwpt.mongodb.net/bot-geralt?retryWrites=true&w=majority
```

---

## 🧪 Teste de Conexão

### **Comando Local:**
```bash
npm run test-mongodb-connection
```

### **Comando no Render:**
1. Vá em **"Logs"** no seu serviço
2. Procure por mensagens de erro
3. Use o script de teste se necessário

---

## ⚙️ Configuração MongoDB Atlas

### **1. Network Access (IP Whitelist):**

#### **Opção A - Liberar Todos os IPs (Recomendado):**
```
IP Address: 0.0.0.0/0
Description: Render - All IPs
```

#### **Opção B - Liberar IPs Específicos:**
```
IP Address: 0.0.0.0/0
Description: Render - Free Tier
```

### **2. Database Access (Usuários):**

#### **Criar Novo Usuário:**
1. Clique em **"ADD DATABASE USER"**
2. Configure:
```
Username: bot-geralt
Password: (senha forte)
Database User Privileges: Atlas admin
```

#### **Verificar Usuário Existente:**
1. Clique no usuário existente
2. Verifique permissões
3. Se necessário, edite permissões

### **3. Connection String:**

#### **Obter Connection String:**
1. No cluster, clique em **"Connect"**
2. Selecione **"Connect your application"**
3. Copie a connection string

#### **Formato Correto:**
```
mongodb+srv://usuario:senha@cluster.28gqwpt.mongodb.net/bot-geralt?retryWrites=true&w=majority
```

---

## 🛠️ Solução de Problemas

### **Problema: "IP not whitelisted"**
**Solução:**
1. Libere o IP `0.0.0.0/0` no Network Access
2. Aguarde alguns minutos para propagação
3. Teste novamente

### **Problema: "Authentication failed"**
**Solução:**
1. Verifique usuário e senha
2. Recrie o usuário se necessário
3. Teste a connection string

### **Problema: "Cluster not found"**
**Solução:**
1. Verifique se o cluster está ativo
2. Verifique se a URI está correta
3. Verifique se o cluster não foi deletado

### **Problema: "Connection timeout"**
**Solução:**
1. Verifique sua conexão de internet
2. Verifique se o cluster não está em manutenção
3. Tente novamente em alguns minutos

---

## 📊 Verificação de Status

### **1. MongoDB Atlas Status:**
- Acesse [status.mongodb.com](https://status.mongodb.com)
- Verifique se há problemas reportados

### **2. Cluster Status:**
- No MongoDB Atlas, verifique se o cluster está **"Active"**
- Verifique se não há manutenção agendada

### **3. Network Access:**
- Verifique se o IP `0.0.0.0/0` está na lista
- Verifique se não há regras conflitantes

### **4. Database Access:**
- Verifique se o usuário tem permissões adequadas
- Verifique se a senha está correta

---

## 🔍 Diagnóstico Avançado

### **Teste com MongoDB Compass:**
1. Baixe [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Use a mesma connection string
3. Teste a conexão

### **Teste com curl:**
```bash
curl -X GET "https://cloud.mongodb.com/api/atlas/v1.0/groups/{GROUP_ID}/clusters" \
  -H "Authorization: Bearer {API_KEY}"
```

### **Logs Detalhados:**
```bash
# No Render, verifique logs completos
# Procure por mensagens específicas do MongoDB
```

---

## 📋 Checklist de Verificação

### **✅ Network Access:**
- [ ] IP `0.0.0.0/0` liberado
- [ ] Descrição configurada
- [ ] Status "Active"

### **✅ Database Access:**
- [ ] Usuário criado
- [ ] Senha configurada
- [ ] Permissões adequadas

### **✅ Connection String:**
- [ ] URI correta
- [ ] Usuário e senha corretos
- [ ] Database name correto
- [ ] Parâmetros corretos

### **✅ Cluster:**
- [ ] Status "Active"
- [ ] Sem manutenção agendada
- [ ] Região correta

---

## 🎯 Próximos Passos

1. **Libere o IP** `0.0.0.0/0` no MongoDB Atlas
2. **Teste a conexão** com `npm run test-mongodb-connection`
3. **Verifique logs** no Render
4. **Teste o bot** com `/permissions verificar`

---

## 📞 Suporte

### **MongoDB Atlas:**
- **Documentação:** [docs.mongodb.com](https://docs.mongodb.com)
- **Community:** [community.mongodb.com](https://community.mongodb.com)
- **Status:** [status.mongodb.com](https://status.mongodb.com)

### **Bot Geralt:**
- **Comando:** `/permissions verificar`
- **Logs:** Verifique logs no Render
- **Teste:** `npm run test-mongodb-connection`

---

**MongoDB Atlas - Configurado Corretamente!** 🗄️✅✨ 