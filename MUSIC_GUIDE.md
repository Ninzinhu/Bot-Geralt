# 🎵 Sistema de Música - Bot Geralt

## 📋 Índice

1. [Funcionalidades](#funcionalidades)
2. [Comandos de Música](#comandos-de-música)
3. [Como Usar](#como-usar)
4. [Controles por Botões](#controles-por-botões)
5. [Permissões Necessárias](#permissões-necessárias)
6. [Solução de Problemas](#solução-de-problemas)

---

## 🎯 Funcionalidades

### **Player Completo do YouTube:**

- 🎵 **Reprodução de músicas** do YouTube
- 🔍 **Busca por nome** ou URL direta
- 📋 **Sistema de fila** com múltiplas músicas
- ⏸️ **Controles completos** (play, pause, skip, stop)
- 🔊 **Controle de volume** (0-100%)
- 🔁 **Modo loop** (em desenvolvimento)
- 🎮 **Botões interativos** para controle rápido

### **Recursos Avançados:**

- 🖼️ **Embeds visuais** com thumbnails
- ⏱️ **Duração das músicas**
- 👤 **Rastreamento de quem solicitou**
- 🎯 **Controles por botões** nos embeds
- 🔄 **Transição automática** entre músicas

---

## 🎮 Comandos de Música

### **`/play` - Tocar Música**

```bash
/play query:Never Gonna Give You Up
/play query:https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

- **Funcionalidade:** Adiciona música à fila e toca
- **Suporte:** Nome da música ou URL do YouTube
- **Requisito:** Usuário deve estar em canal de voz

### **`/pause` - Pausar Música**

```bash
/pause
```

- **Funcionalidade:** Pausa a música atual
- **Requisito:** Música deve estar tocando

### **`/resume` - Retomar Música**

```bash
/resume
```

- **Funcionalidade:** Retoma música pausada
- **Requisito:** Música deve estar pausada

### **`/skip` - Pular Música**

```bash
/skip
```

- **Funcionalidade:** Pula para próxima música
- **Requisito:** Música deve estar tocando

### **`/stop` - Parar Música**

```bash
/stop
```

- **Funcionalidade:** Para música e limpa fila
- **Requisito:** Música deve estar tocando

### **`/queue` - Mostrar Fila**

```bash
/queue
```

- **Funcionalidade:** Mostra fila de músicas
- **Informações:** Música atual, próximas músicas, volume, status

### **`/volume` - Controlar Volume**

```bash
/volume volume:75
```

- **Funcionalidade:** Define volume (0-100%)
- **Requisito:** Música deve estar tocando

---

## 🎯 Como Usar

### **Passo 1: Entrar no Canal de Voz**

1. Entre em um canal de voz no Discord
2. Certifique-se de que o bot pode acessar o canal

### **Passo 2: Tocar Música**

```bash
# Por nome da música
/play query:Bohemian Rhapsody

# Por URL do YouTube
/play query:https://www.youtube.com/watch?v=fJ9rUzIMcZQ
```

### **Passo 3: Controlar Reprodução**

```bash
# Pausar
/pause

# Retomar
/resume

# Pular
/skip

# Parar tudo
/stop
```

### **Passo 4: Gerenciar Fila**

```bash
# Ver fila atual
/queue

# Adicionar mais músicas
/play query:Another Song
/play query:Yet Another Song
```

---

## 🔘 Controles por Botões

### **Embed da Música Atual:**

Quando uma música começa a tocar, o bot envia um embed com botões:

```
🎵 Tocando Agora
[Thumbnail da música]
Título da música

⏱️ Duração: 3:45  🔊 Volume: 75%  👤 Solicitado por: @usuário

[⏸️ Pausar] [⏭️ Pular] [⏹️ Parar] [📋 Fila]
```

### **Funcionalidades dos Botões:**

- **⏸️ Pausar:** Pausa a música atual
- **⏭️ Pular:** Pula para próxima música
- **⏹️ Parar:** Para música e limpa fila
- **📋 Fila:** Mostra fila de músicas

---

## 🔐 Permissões Necessárias

### **Para o Bot:**

- ✅ **Conectar** - Entrar em canais de voz
- ✅ **Falar** - Reproduzir áudio
- ✅ **Usar VAD** - Detectar atividade de voz
- ✅ **Enviar Mensagens** - Enviar embeds e comandos
- ✅ **Usar Slash Commands** - Executar comandos

### **Para o Usuário:**

- ✅ **Conectar** - Entrar em canais de voz
- ✅ **Falar** - Usar comandos de música

---

## 🛠️ Solução de Problemas

### **Erro: "Você precisa estar em um canal de voz"**

**Problema:** Usuário não está em canal de voz
**Solução:**

1. Entre em um canal de voz
2. Execute o comando novamente

### **Erro: "Não consegui conectar ao canal de voz"**

**Problema:** Bot não tem permissões
**Solução:**

1. Verifique permissões do bot
2. Use `/permissions verificar`
3. Configure permissões necessárias

### **Erro: "Nenhuma música encontrada"**

**Problema:** Busca não retornou resultados
**Solução:**

1. Verifique o nome da música
2. Tente uma busca mais específica
3. Use URL direta do YouTube

### **Erro: "Erro ao processar a música"**

**Problema:** Problema com o YouTube ou rede
**Solução:**

1. Verifique sua conexão
2. Tente uma música diferente
3. Aguarde alguns minutos

### **Música não toca**

**Problema:** Problema de áudio
**Solução:**

1. Verifique se o bot está conectado
2. Verifique volume do bot
3. Use `/volume 50` para ajustar

### **Bot não responde**

**Problema:** Bot offline ou com erro
**Solução:**

1. Verifique se o bot está online
2. Reinicie o bot se necessário
3. Verifique logs de erro

---

## 📊 Exemplos de Uso

### **Sessão de Música Completa:**

```bash
# 1. Tocar primeira música
/play query:Bohemian Rhapsody Queen

# 2. Adicionar mais músicas à fila
/play query:Hotel California Eagles
/play query:Stairway to Heaven Led Zeppelin

# 3. Ver fila
/queue

# 4. Controlar reprodução
/pause
/resume
/skip

# 5. Ajustar volume
/volume volume:80

# 6. Parar sessão
/stop
```

### **Controles Rápidos:**

```bash
# Pausar rapidamente
/pause

# Pular música atual
/skip

# Ver o que está tocando
/queue

# Retomar música
/resume
```

---

## 🎵 Recursos Técnicos

### **Formatos Suportados:**

- ✅ **YouTube Videos** - Qualquer vídeo do YouTube
- ✅ **YouTube Shorts** - Vídeos curtos
- ✅ **Busca por Nome** - Busca automática no YouTube
- ✅ **URLs Diretas** - Links completos do YouTube

### **Limitações:**

- ❌ **Playlists** - Não suportado ainda
- ❌ **Streams ao Vivo** - Não suportado
- ❌ **Vídeos Privados** - Não acessível
- ❌ **Vídeos com Restrição de Idade** - Não acessível

### **Qualidade de Áudio:**

- 🎵 **Qualidade Automática** - Melhor qualidade disponível
- 🔄 **Adaptação Automática** - Ajusta conforme conexão
- ⚡ **Buffer Inteligente** - Carregamento otimizado

---

## 🚀 Próximas Funcionalidades

### **Em Desenvolvimento:**

- 🔁 **Modo Loop** - Repetir música atual
- 🔀 **Modo Shuffle** - Ordem aleatória
- 📋 **Playlists** - Salvar e carregar playlists
- ⏰ **Filtros de Duração** - Limitar músicas longas
- 🎛️ **Equalizador** - Controles de áudio avançados

### **Planejadas:**

- 🎧 **Spotify Integration** - Conectar com Spotify
- 📱 **Controles Remotos** - App mobile
- 🎵 **Letras** - Mostrar letras das músicas
- 🎨 **Temas Visuais** - Personalizar aparência

---

## 📞 Suporte

Se precisar de ajuda:

1. Verifique este guia
2. Use `/permissions verificar` para diagnóstico
3. Teste com músicas diferentes
4. Verifique logs do bot

**Bot Geralt - Sistema de Música Completo** 🎵🤖✨
