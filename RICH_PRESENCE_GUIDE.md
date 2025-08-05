# 🎨 Guia do Rich Presence - Bot Geralt

## 📋 Índice

1. [O que é Rich Presence](#o-que-é-rich-presence)
2. [Configuração no Developer Portal](#configuração-no-developer-portal)
3. [Upload de Imagens](#upload-de-imagens)
4. [Comandos do Rich Presence](#comandos-do-rich-presence)
5. [Personalização](#personalização)
6. [Solução de Problemas](#solução-de-problemas)

---

## 🎯 O que é Rich Presence

O **Rich Presence** é uma funcionalidade do Discord que permite que bots e aplicações mostrem informações detalhadas sobre sua atividade, incluindo:

- 🖼️ **Imagens personalizadas** (grande e pequena)
- 📝 **Textos descritivos** ao passar o mouse
- 🔘 **Botões clicáveis** para ações
- 📊 **Estatísticas em tempo real**
- 🎮 **Status dinâmicos**

---

## ⚙️ Configuração no Developer Portal

### Passo 1: Acessar o Developer Portal

1. Vá para [Discord Developer Portal](https://discord.com/developers/applications)
2. Faça login com sua conta Discord
3. Selecione sua aplicação (Bot Geralt)

### Passo 2: Navegar para Rich Presence

1. No menu lateral, clique em **"Rich Presence"**
2. Clique em **"Art Assets"**
3. Você verá duas seções:
   - **Rich Presence Invite Image** (imagem de convite)
   - **Rich Presence Assets** (imagens do Rich Presence)

---

## 🖼️ Upload de Imagens

### Rich Presence Invite Image

Esta é a imagem que aparece quando alguém convida o bot:

1. **Clique em "COVER IMAGE"**
2. **Faça upload de uma imagem:**
   - Formato: PNG, JPG, JPEG
   - Tamanho: 1024x1024 pixels (recomendado)
   - Tamanho mínimo: 512x512 pixels
3. **A imagem deve representar seu bot** (ex: logo, personagem, etc.)

### Rich Presence Assets

Estas são as imagens que aparecem no Rich Presence:

1. **Clique em "Add Image(s)"**
2. **Faça upload das imagens:**
   - **Imagem Grande:** 1024x1024 pixels
   - **Imagem Pequena:** 1024x1024 pixels (será redimensionada)
   - **Formato:** PNG, JPG, JPEG

### Nomes das Imagens

⚠️ **IMPORTANTE:** Os nomes das imagens são **chaves** que você usará no código:

```
Exemplos de nomes:
- embedded_cover
- embedded_background
- bot_logo
- moderation_icon
- geralt_avatar
- shield_icon
```

**Regras para nomes:**

- ✅ Use apenas letras, números e underscores
- ✅ Não use espaços ou caracteres especiais
- ✅ Seja descritivo e consistente
- ❌ Não use acentos ou símbolos

---

## 🎮 Comandos do Rich Presence

### `/richpresence status`

Mostra o status atual do Rich Presence:

- Atividade atual
- Imagens sendo usadas
- Textos configurados
- Botões ativos
- Estatísticas do bot

### `/richpresence atualizar`

Força uma atualização do Rich Presence:

- Muda para um estado aleatório
- Atualiza estatísticas
- Aplica configurações atuais

### `/richpresence configurar`

Guia de configuração interativo:

- Mostra como configurar imagens
- Explica o processo passo a passo
- Lista requisitos técnicos

---

## 🎨 Personalização

### Estados Dinâmicos

O bot alterna automaticamente entre estes estados:

```javascript
// Estados configurados
{
    name: '🛡️ Protegendo a comunidade',
    details: 'Moderação automática ativa',
    largeImage: 'embedded_cover',
    smallImage: 'embedded_background'
},
{
    name: '⚔️ Comandos de moderação',
    details: '/ban, /kick, /mute, /clear',
    largeImage: 'embedded_cover',
    smallImage: 'embedded_background'
},
{
    name: '📋 Sistema de tickets',
    details: 'Suporte 24/7 disponível',
    largeImage: 'embedded_cover',
    smallImage: 'embedded_background'
}
```

### Botões do Rich Presence

O bot inclui botões clicáveis:

1. **🛡️ Adicionar ao Servidor**

   - Link direto para convite do bot
   - Permissões configuradas automaticamente

2. **📖 Documentação**
   - Link para documentação/GitHub
   - Guias de uso

### Textos Personalizados

- **Imagem Grande:** "Bot Geralt - Sistema de Moderação"
- **Imagem Pequena:** "Protegendo comunidades"
- **Estado:** "Servindo X servidores"

---

## 🔧 Configuração Avançada

### Modificar Estados

Para adicionar novos estados, edite o arquivo `src/events/ready.js`:

```javascript
states: [
  {
    name: "🎯 Seu Estado Personalizado",
    details: "Descrição do estado",
    largeImage: "sua_imagem_grande",
    smallImage: "sua_imagem_pequena",
  },
];
```

### Modificar Botões

```javascript
buttons: [
  {
    label: "🔗 Seu Botão",
    url: "https://seu-link.com",
  },
];
```

### Modificar Textos

```javascript
largeText: 'Seu texto personalizado',
smallText: 'Seu texto pequeno'
```

---

## ⚠️ Solução de Problemas

### Imagens Não Aparecem

**Problema:** As imagens não aparecem no Rich Presence
**Soluções:**

1. **Verifique os nomes:** Use exatamente os nomes do Developer Portal
2. **Aguarde o cache:** Imagens podem demorar até 1 hora
3. **Verifique o formato:** Use PNG, JPG ou JPEG
4. **Verifique o tamanho:** Mínimo 512x512, recomendado 1024x1024

### Rich Presence Não Atualiza

**Problema:** O Rich Presence não muda
**Soluções:**

1. Use `/richpresence atualizar`
2. Reinicie o bot
3. Verifique se o comando está registrado

### Botões Não Funcionam

**Problema:** Os botões não são clicáveis
**Soluções:**

1. Verifique se as URLs estão corretas
2. Certifique-se de que os links são válidos
3. Teste os links em um navegador

### Erro de Permissões

**Problema:** Comando não funciona
**Solução:**

- Use `/permissions verificar`
- Certifique-se de ter permissão de Administrador

---

## 📊 Exemplo de Configuração

### Developer Portal

```
Rich Presence Assets:
├── embedded_cover (1024x1024)
├── embedded_background (1024x1024)
├── bot_logo (1024x1024)
└── shield_icon (1024x1024)
```

### Código

```javascript
const richPresenceConfig = {
  largeImage: "embedded_cover",
  largeText: "Bot Geralt - Sistema de Moderação",
  smallImage: "embedded_background",
  smallText: "Protegendo comunidades",
  buttons: [
    {
      label: "🛡️ Adicionar ao Servidor",
      url: "https://discord.com/api/oauth2/authorize?...",
    },
  ],
};
```

### Resultado

O bot mostrará:

- 🖼️ **Imagem grande:** embedded_cover
- 🖼️ **Imagem pequena:** embedded_background
- 📝 **Texto grande:** "Bot Geralt - Sistema de Moderação"
- 📝 **Texto pequeno:** "Protegendo comunidades"
- 🔘 **Botões:** "Adicionar ao Servidor" e "Documentação"

---

## 🚀 Próximos Passos

1. **Faça upload das imagens** no Developer Portal
2. **Use `/richpresence configurar`** para verificar
3. **Teste com `/richpresence atualizar`**
4. **Monitore com `/richpresence status`**
5. **Personalize conforme necessário**

---

## 📞 Suporte

Se precisar de ajuda:

1. Verifique este guia
2. Use `/richpresence status` para diagnóstico
3. Confirme os nomes das imagens
4. Aguarde o cache do Discord (até 1 hora)

**Bot Geralt - Rich Presence Personalizado** 🎨🤖✨
