# 🤖 Guia de Moderação - Bot Geralt

## 📋 Índice

1. [Configuração Inicial](#configuração-inicial)
2. [Comandos de Moderação](#comandos-de-moderação)
3. [Moderação Automática](#moderação-automática)
4. [Sistema de Permissões](#sistema-de-permissões)
5. [Solução de Problemas](#solução-de-problemas)

---

## ⚙️ Configuração Inicial

### 1. Configurar Variáveis de Ambiente

```env
# Configurações do Bot Discord
DISCORD_TOKEN=seu_token_do_bot_aqui
DISCORD_CLIENT_ID=seu_client_id_aqui

# Configurações de Moderação
LOG_CHANNEL_ID=id_do_canal_de_logs
MODERATOR_ROLE_ID=id_do_cargo_de_moderador

# Configurações de Tickets (Opcional)
TICKET_CATEGORY_ID=id_da_categoria_de_tickets
STAFF_ROLE_ID=id_da_role_da_staff
```

### 2. Configurar Permissões do Bot

1. **Criar Cargo do Bot:**

   - Vá em **Configurações do Servidor** → **Cargos**
   - Crie um cargo chamado "Bot Geralt"
   - Posicione **ACIMA** dos cargos que o bot deve moderar

2. **Configurar Permissões:**

   - ✅ Gerenciar Mensagens
   - ✅ Moderar Membros
   - ✅ Expulsar Membros
   - ✅ Banir Membros
   - ✅ Gerenciar Cargos
   - ✅ Ver Registro de Auditoria
   - ✅ Enviar Mensagens
   - ✅ Incorporar Links
   - ✅ Anexar Arquivos
   - ✅ Ver Histórico de Mensagens

3. **Verificar Configuração:**
   - Use `/permissions verificar` para confirmar

---

## 🛡️ Comandos de Moderação

### Comandos Básicos

#### `/ban` - Banir Usuário

```bash
/ban usuario:@usuario motivo:Spam no chat dias:7
```

- **Permissão:** Banir Membros
- **Funcionalidades:**
  - Deletar mensagens (0-7 dias)
  - Motivo personalizado
  - Logs automáticos

#### `/kick` - Expulsar Usuário

```bash
/kick usuario:@usuario motivo:Comportamento inadequado
```

- **Permissão:** Expulsar Membros
- **Funcionalidades:**
  - Motivo personalizado
  - Logs automáticos

#### `/mute` - Silenciar Usuário

```bash
/mute usuario:@usuario duracao:30m motivo:Spam
```

- **Permissão:** Moderar Membros
- **Durações:** 30s, 1m, 5m, 10m, 30m, 1h, 6h, 12h, 1d, 1w

#### `/clear` - Limpar Mensagens

```bash
/clear quantidade:10 usuario:@usuario
```

- **Permissão:** Gerenciar Mensagens
- **Funcionalidades:**
  - De 1 a 100 mensagens
  - Limpar apenas de usuário específico
  - Auto-deletação da confirmação

#### `/userinfo` - Informações de Usuário

```bash
/userinfo usuario:@usuario
```

- **Permissão:** Moderar Membros
- **Informações:**
  - Status, cargos, permissões
  - Badges do Discord
  - Data de entrada no servidor
  - Se está silenciado

### Comandos Avançados

#### `/warn` - Sistema de Avisos

```bash
# Adicionar aviso
/warn adicionar usuario:@usuario motivo:Primeiro aviso

# Listar avisos
/warn listar usuario:@usuario

# Remover aviso
/warn remover id:warn_1234567890_abc123

# Limpar avisos
/warn limpar usuario:@usuario
```

#### `/permissions` - Verificar Permissões

```bash
# Verificar permissões atuais
/permissions verificar

# Mostrar guia de configuração
/permissions configurar
```

---

## 🤖 Moderação Automática

### Configuração

#### `/automod` - Configurar Sistema

```bash
# Ver status atual
/automod status

# Ativar moderação automática
/automod ativar

# Desativar moderação automática
/automod desativar

# Configurar palavras proibidas
/automod palavras acao:add palavra:palavrão
/automod palavras acao:list

# Configurar anti-spam
/automod spam max_mensagens:5 janela_tempo:10

# Configurar ações
/automod acoes severidade:media acao:mute
```

### Proteções Automáticas

#### 1. Anti-Spam/Flood

- **Detecta:** Mensagens excessivas em janela de tempo
- **Configurável:** Mensagens/segundos
- **Ação:** Baseada na severidade

#### 2. Filtro de Palavras

- **Detecta:** Palavras proibidas
- **Configuração:** Lista personalizável
- **Ação:** Configurável por palavra

#### 3. Filtro de Links

- **Detecta:** URLs suspeitas/malformadas
- **Configuração:** Domínios permitidos/bloqueados
- **Ação:** Proteção contra phishing

#### 4. Filtro de Caps

- **Detecta:** Mensagens com muitas maiúsculas
- **Configuração:** Porcentagem (padrão: 70%)
- **Ação:** Previne spam

#### 5. Filtro de Emojis

- **Detecta:** Emojis excessivos
- **Configuração:** Quantidade (padrão: 5)
- **Ação:** Previne spam

### Sistema de Ações

- **Baixa Severidade:** Aviso (DM)
- **Média Severidade:** Silenciamento temporário
- **Alta Severidade:** Expulsão/Banimento

---

## 🔐 Sistema de Permissões

### Hierarquia de Cargos

```
👑 Administrador (Posição: 100)
├── 🛡️ Moderador (Posição: 80)
├── 🤖 Bot Geralt (Posição: 70) ← Deve estar aqui
├── 👥 Membro (Posição: 50)
└── 🆕 Novato (Posição: 10)
```

### Verificações Automáticas

O bot verifica automaticamente:

- ✅ Se tem permissões necessárias
- ✅ Se pode moderar o usuário específico
- ✅ Se o usuário já está silenciado
- ✅ Fallback para aviso se não conseguir moderar

---

## 🎫 Sistema de Tickets

### Comandos

```bash
# Criar ticket
/ticket criar assunto:Problema com conta prioridade:alta

# Listar tickets
/ticket listar status:abertos

# Fechar ticket
/ticket fechar canal:123456789012345678
```

### Configuração

- **Categoria:** Configure `TICKET_CATEGORY_ID`
- **Staff:** Configure `STAFF_ROLE_ID`
- **Permissões:** Canais privados automáticos

---

## 🔧 Solução de Problemas

### Erro: "Missing Permissions"

**Problema:** Bot não consegue moderar usuários
**Solução:**

1. Verifique permissões com `/permissions verificar`
2. Configure cargo do bot acima dos usuários
3. Verifique se o bot tem todas as permissões necessárias

### Erro: "Cannot moderate this user"

**Problema:** Bot não pode moderar usuário específico
**Solução:**

1. Verifique hierarquia de cargos
2. O cargo do bot deve estar acima do usuário
3. Use `/permissions verificar` para confirmar

### Moderação Automática Não Funciona

**Problema:** Sistema automático não está ativo
**Solução:**

1. Use `/automod ativar`
2. Configure canal de logs (`LOG_CHANNEL_ID`)
3. Verifique configurações com `/automod status`

### Logs Não Aparecem

**Problema:** Ações não são logadas
**Solução:**

1. Configure `LOG_CHANNEL_ID` no .env
2. Verifique se o bot tem acesso ao canal
3. Confirme permissões de envio de mensagens

---

## 📊 Logs e Monitoramento

### Canal de Logs

Configure um canal específico para logs:

```env
LOG_CHANNEL_ID=123456789012345678
```

### Informações Logadas

- ✅ Todas as ações de moderação
- ✅ Violações automáticas
- ✅ Detalhes completos das ações
- ✅ Histórico por usuário

### Status do Bot

O bot mostra status dinâmicos:

- 🛡️ Protegendo a comunidade
- ⚔️ Comandos de moderação
- 📋 /ban, /kick, /mute, /clear
- 🎫 Sistema de tickets ativo
- 👮 Moderação 24/7

---

## 🚀 Próximos Passos

1. **Configure as permissões** usando `/permissions configurar`
2. **Ative a moderação automática** com `/automod ativar`
3. **Configure palavras proibidas** para seu servidor
4. **Teste os comandos** em um ambiente controlado
5. **Monitore os logs** para acompanhar as ações

---

## 📞 Suporte

Se precisar de ajuda:

1. Verifique este guia
2. Use `/permissions verificar` para diagnóstico
3. Consulte os logs do bot
4. Entre em contato com o desenvolvedor

**Bot Geralt - Sistema de Moderação Completo** 🤖🛡️⚔️
