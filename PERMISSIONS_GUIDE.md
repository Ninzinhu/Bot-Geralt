# 🔐 Sistema de Permissões - Bot Geralt

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Níveis de Permissão](#níveis-de-permissão)
3. [Comandos Restritos](#comandos-restritos)
4. [Configuração de Cargos](#configuração-de-cargos)
5. [Mensagens de Erro](#mensagens-de-erro)
6. [Solução de Problemas](#solução-de-problemas)

---

## 🎯 Visão Geral

O Bot Geralt possui um **sistema de permissões hierárquico** que controla quem pode usar cada comando:

### **Hierarquia de Permissões:**

1. **👑 Administrador** - Acesso total a todos os comandos
2. **🛡️ Moderador** - Acesso a comandos de moderação básica
3. **🎵 Usuário** - Acesso apenas a comandos de música e tickets

---

## 🏆 Níveis de Permissão

### **👑 Administrador**

- **Permissão:** `Administrator`
- **Acesso:** Todos os comandos
- **Comandos exclusivos:** `/automod`, configurações avançadas

### **🛡️ Moderador**

- **Permissão:** `Administrator` OU cargo de moderador configurado
- **Acesso:** Comandos de moderação básica
- **Comandos:** `/ban`, `/kick`, `/mute`, `/clear`, `/warn`, etc.

### **🎵 Usuário**

- **Permissão:** Qualquer pessoa
- **Acesso:** Comandos de música e tickets
- **Comandos:** `/play`, `/pause`, `/ticket`, etc.

---

## 🚫 Comandos Restritos

### **🔒 Apenas Administradores:**

#### **`/automod` - Moderação Automática**

- **Restrição:** Apenas Administradores
- **Motivo:** Configuração sensível do servidor
- **Funcionalidades:**
  - Ativar/desativar moderação automática
  - Configurar palavras proibidas
  - Definir ações para violações
  - Configurar proteção anti-spam

### **🛡️ Administradores e Moderadores:**

#### **`/ban` - Banir Usuário**

- **Restrição:** Administradores OU Moderadores
- **Permissão necessária:** `BanMembers`
- **Funcionalidade:** Banir usuários permanentemente

#### **`/kick` - Expulsar Usuário**

- **Restrição:** Administradores OU Moderadores
- **Permissão necessária:** `KickMembers`
- **Funcionalidade:** Expulsar usuários do servidor

#### **`/mute` - Silenciar Usuário**

- **Restrição:** Administradores OU Moderadores
- **Permissão necessária:** `ModerateMembers`
- **Funcionalidade:** Silenciar usuários temporariamente

#### **`/clear` - Limpar Mensagens**

- **Restrição:** Administradores OU Moderadores
- **Permissão necessária:** `ManageMessages`
- **Funcionalidade:** Deletar mensagens em massa

#### **`/warn` - Sistema de Avisos**

- **Restrição:** Administradores OU Moderadores
- **Funcionalidade:** Gerenciar avisos de usuários

#### **`/userinfo` - Informações de Usuário**

- **Restrição:** Administradores OU Moderadores
- **Funcionalidade:** Ver informações detalhadas de usuários

#### **`/richpresence` - Rich Presence**

- **Restrição:** Administradores OU Moderadores
- **Funcionalidade:** Gerenciar Rich Presence do bot

### **🎵 Livre para Todos:**

#### **Comandos de Música:**

- `/play` - Tocar música
- `/pause` - Pausar música
- `/resume` - Retomar música
- `/skip` - Pular música
- `/stop` - Parar música
- `/queue` - Ver fila
- `/volume` - Controlar volume

#### **Sistema de Tickets:**

- `/ticket` - Criar tickets de suporte

---

## ⚙️ Configuração de Cargos

### **Variáveis de Ambiente:**

#### **MODERATOR_ROLE_ID**

```env
# ID do cargo de moderador (opcional)
MODERATOR_ROLE_ID=123456789012345678
```

#### **STAFF_ROLE_ID**

```env
# ID do cargo de staff (opcional)
STAFF_ROLE_ID=123456789012345678
```

### **Como Configurar:**

#### **1. Criar Cargo de Moderador:**

1. Vá em **Configurações do Servidor** → **Cargos**
2. Clique em **"Criar Cargo"**
3. Nome: "Moderador" ou "Staff"
4. Cor: Escolha uma cor (ex: verde)
5. Permissões: Adicione permissões básicas

#### **2. Obter ID do Cargo:**

1. Ative o **Modo Desenvolvedor** no Discord
2. Clique com botão direito no cargo
3. Clique em **"Copiar ID"**

#### **3. Configurar no .env:**

```env
MODERATOR_ROLE_ID=123456789012345678
STAFF_ROLE_ID=123456789012345678
```

### **Hierarquia de Cargos:**

```
👑 Administrador (Posição: 100)
├── 🛡️ Moderador (Posição: 50)
├── 🎵 Usuário (Posição: 10)
└── 🤖 Bot Geralt (Posição: 25)
```

---

## ❌ Mensagens de Erro

### **Erro de Permissão:**

```
❌ Permissão Negada!

Você precisa ter a permissão Administrador para usar o comando /automod.

Permissões necessárias:
• Administrador

Como obter:
• Peça a um administrador para dar a permissão
• Ou use /permissions verificar para diagnosticar
```

### **Erro de Cargo:**

```
❌ Cargo Necessário!

Você precisa ter o cargo Moderador para usar o comando /ban.

Cargo necessário:
• Moderador

Como obter:
• Peça a um administrador para dar o cargo
• Ou use /permissions verificar para diagnosticar
```

---

## 🛠️ Solução de Problemas

### **Problema: "Permissão Negada"**

**Causa:** Usuário não tem permissão necessária
**Soluções:**

1. Verifique se o usuário tem o cargo correto
2. Verifique se o cargo tem as permissões necessárias
3. Use `/permissions verificar` para diagnosticar

### **Problema: "Cargo não encontrado"**

**Causa:** ID do cargo incorreto ou cargo deletado
**Soluções:**

1. Verifique se o `MODERATOR_ROLE_ID` está correto
2. Recrie o cargo se foi deletado
3. Atualize o ID no `.env`

### **Problema: "Bot não pode moderar"**

**Causa:** Bot não tem permissões suficientes
**Soluções:**

1. Use `/permissions verificar` para diagnosticar
2. Configure permissões do bot
3. Posicione o cargo do bot acima dos usuários

### **Problema: "Comando não aparece"**

**Causa:** Usuário não tem permissão para ver o comando
**Soluções:**

1. Verifique permissões do usuário
2. Use `/permissions verificar`
3. Configure cargos corretamente

---

## 📊 Exemplos de Configuração

### **Configuração Básica:**

```env
# Apenas administradores podem usar moderação
MODERATOR_ROLE_ID=
STAFF_ROLE_ID=
```

### **Configuração com Cargos:**

```env
# Administradores e moderadores podem usar moderação
MODERATOR_ROLE_ID=123456789012345678
STAFF_ROLE_ID=123456789012345679
```

### **Configuração Hierárquica:**

```
👑 Administrador (ID: 100)
├── 🛡️ Moderador (ID: 50) - MODERATOR_ROLE_ID
├── 🎵 DJ (ID: 30) - STAFF_ROLE_ID
└── 🤖 Bot Geralt (ID: 25)
```

---

## 🔍 Comando de Diagnóstico

### **`/permissions verificar`**

Este comando verifica:

- ✅ Permissões do bot
- ✅ Cargos configurados
- ✅ Hierarquia de cargos
- ✅ Problemas encontrados

### **Como Usar:**

```bash
/permissions verificar
```

### **Saída Exemplo:**

```
🔍 Verificação de Permissões

🤖 Bot Permissions:
✅ Gerenciar Mensagens
✅ Moderar Membros
✅ Banir Membros
❌ Expulsar Membros

👥 Cargos Configurados:
✅ Moderador: 123456789012345678
❌ Staff: Não configurado

⚠️ Problemas Encontrados:
• Bot não pode expulsar membros
• Cargo de staff não configurado
```

---

## 📝 Resumo

### **Comandos por Nível:**

| Nível                | Comandos                                                                  | Permissão                |
| -------------------- | ------------------------------------------------------------------------- | ------------------------ |
| **👑 Administrador** | `/automod`                                                                | `Administrator`          |
| **🛡️ Moderador**     | `/ban`, `/kick`, `/mute`, `/clear`, `/warn`, `/userinfo`, `/richpresence` | `Administrator` OU cargo |
| **🎵 Usuário**       | `/play`, `/pause`, `/ticket`                                              | Qualquer pessoa          |

### **Configuração Recomendada:**

1. **Configure cargos** de moderador e staff
2. **Use `/permissions verificar`** para diagnosticar
3. **Teste os comandos** com diferentes usuários
4. **Monitore os logs** para problemas

---

## 📞 Suporte

Se precisar de ajuda:

1. Use `/permissions verificar` para diagnóstico
2. Verifique este guia
3. Configure cargos corretamente
4. Teste com diferentes usuários

**Bot Geralt - Sistema de Permissões Seguro** 🔐🤖✨
