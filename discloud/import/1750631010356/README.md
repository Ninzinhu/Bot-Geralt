# 🗡️ Bot Geralt - Sistema de Vendas e Suporte

Um bot completo do Discord para gerenciamento de vendas, estoque, tickets de suporte e webhooks para SaaS.

## ✨ Funcionalidades

### 📦 Sistema de Vendas

- **Adicionar Produtos**: Crie produtos com nome, descrição, preço e estoque
- **Gerenciar Estoque**: Visualize, adicione ou remova itens do estoque
- **Relatórios de Vendas**: Visualize vendas recentes e gere relatórios detalhados
- **Status de Vendas**: Aprove, cancele ou processe reembolsos

### 🎫 Sistema de Tickets

- **Criar Tickets**: Sistema completo de tickets de suporte
- **Prioridades**: Tickets com diferentes níveis de prioridade
- **Gerenciamento**: Listar, fechar e assumir tickets
- **Histórico**: Mantém histórico completo de conversas

### 🌐 Webhooks para SaaS

- **Integração Automática**: Recebe vendas do seu SaaS automaticamente
- **Notificações**: Envia notificações no Discord para novas vendas
- **Segurança**: Verificação de assinatura dos webhooks
- **Múltiplos Eventos**: Suporte a vendas, reembolsos e assinaturas

### 🏪 Informações da Loja

- **Perfil da Loja**: Mostra estatísticas e informações gerais
- **Catálogo de Produtos**: Lista todos os produtos disponíveis
- **Suporte ao Cliente**: Informações de contato e FAQ

## 🚀 Instalação

### Pré-requisitos

- Node.js 16.9.0 ou superior
- Discord Bot Token
- MongoDB Database (MongoDB Atlas ou local)
- Servidor Discord

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/bot-geralt.git
cd bot-geralt
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o MongoDB

#### 🌐 **MongoDB Atlas (Recomendado para produção)**

1. Acesse [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crie uma conta gratuita
3. Crie um novo cluster
4. Clique em "Connect"
5. Escolha "Connect your application"
6. Copie a string de conexão

#### 🏠 **MongoDB Local**

```bash
# Instalar MongoDB localmente
# Windows: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/
# Linux: https://docs.mongodb.com/manual/administration/install-on-linux/
# macOS: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/

# String de conexão local
mongodb://localhost:27017/bot-geralt
```

### 4. Configure as variáveis de ambiente

Copie o arquivo `env.example` para `.env` e configure:

#### 🌍 **Para Bot Global (Múltiplos Servidores)**

```env
# Configurações do Bot Discord
DISCORD_TOKEN=seu_token_do_bot_aqui
DISCORD_CLIENT_ID=seu_client_id_aqui
# DISCORD_GUILD_ID= (deixe em branco para bot global)

# Configurações do Webhook
WEBHOOK_PORT=3000
WEBHOOK_SECRET=seu_secret_do_webhook_aqui

# Configurações do MongoDB
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/bot-geralt?retryWrites=true&w=majority

# Configurações da Loja
STORE_NAME=Sua Loja
STORE_WEBSITE=https://sualoja.com
STORE_SUPPORT=https://discord.gg/seulink
STORE_EMAIL=contato@sualoja.com
```

#### 🏠 **Para Bot de Servidor Específico (Desenvolvimento)**

```env
# Configurações do Bot Discord
DISCORD_TOKEN=seu_token_do_bot_aqui
DISCORD_CLIENT_ID=seu_client_id_aqui
DISCORD_GUILD_ID=seu_guild_id_aqui

# Configurações do Webhook
WEBHOOK_PORT=3000
WEBHOOK_SECRET=seu_secret_do_webhook_aqui

# Configurações do MongoDB
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/bot-geralt?retryWrites=true&w=majority

# Configurações da Loja
STORE_NAME=Sua Loja
STORE_WEBSITE=https://sualoja.com
STORE_SUPPORT=https://discord.gg/seulink
STORE_EMAIL=contato@sualoja.com

# Configurações Opcionais
SALES_CHANNEL_ID=id_do_canal_de_vendas
SALES_WEBHOOK_URL=url_do_webhook_para_vendas
TICKET_CATEGORY_ID=id_da_categoria_de_tickets
STAFF_ROLE_ID=id_da_role_da_staff
```

### 5. Registre os comandos slash

```bash
npm run deploy
```

### 6. Inicie o bot

```bash
npm start
```

Para desenvolvimento com auto-reload:

```bash
npm run dev
```

## 🔧 **Diferenças: Bot Global vs Servidor Específico**

| Aspecto               | Bot Global                      | Servidor Específico            |
| --------------------- | ------------------------------- | ------------------------------ |
| **Escopo**            | Funciona em todos os servidores | Funciona apenas em um servidor |
| **Tempo de Ativação** | Até 1 hora para aparecer        | Instantâneo                    |
| **Desenvolvimento**   | Mais lento para testar          | Mais rápido para testar        |
| **Configurações**     | Configurações globais           | Configurações por servidor     |
| **Recomendado para**  | Produção                        | Desenvolvimento                |

## 📋 Comandos Disponíveis

### 🛒 Vendas

- `/addproduct` - Adiciona um novo produto ao estoque
- `/stock ver` - Visualiza o estoque de todos os produtos
- `/stock adicionar` - Adiciona quantidade ao estoque
- `/stock remover` - Remove quantidade do estoque
- `/vendas recentes` - Mostra vendas recentes
- `/vendas relatorio` - Gera relatório de vendas
- `/vendas status` - Atualiza status de uma venda

### 🎫 Tickets

- `/ticket criar` - Cria um novo ticket de suporte
- `/ticket listar` - Lista todos os tickets
- `/ticket fechar` - Fecha um ticket

### 🏪 Informações da Loja

- `/info loja` - Informações gerais da loja
- `/info produtos` - Lista todos os produtos disponíveis
- `/info suporte` - Informações de suporte e contato

## 🌐 Configuração do Webhook

### Endpoint do Webhook

O bot expõe um endpoint para receber webhooks do seu SaaS:

```
POST http://seu-servidor:3000/webhook/saas
```

### Formato dos Dados

```json
{
  "event": "sale.completed",
  "data": {
    "customer_id": "123456789",
    "customer_name": "João Silva",
    "product_name": "Produto Premium",
    "product_id": "507f1f77bcf86cd799439011",
    "quantity": 1,
    "total_price": 99.9,
    "payment_method": "PIX",
    "transaction_id": "txn_123456"
  }
}
```

### Eventos Suportados

- `sale.completed` - Venda realizada
- `sale.refunded` - Reembolso processado
- `subscription.created` - Nova assinatura
- `subscription.cancelled` - Assinatura cancelada

### Segurança

Configure o `WEBHOOK_SECRET` para verificar a assinatura dos webhooks. O header `x-webhook-signature` deve conter a assinatura HMAC-SHA256.

## 🗄️ Banco de Dados (MongoDB)

O bot usa MongoDB para armazenar dados. As coleções são criadas automaticamente:

### 📊 **Coleções:**

- **products**: Produtos e estoque
- **sales**: Histórico de vendas
- **tickets**: Tickets de suporte
- **ticketmessages**: Mensagens dos tickets
- **storeconfigs**: Configurações da loja

### 🔍 **Índices Criados:**

- Produtos: `name`, `category`, `stock`
- Vendas: `customer_id`, `status`, `transaction_id`, `createdAt`
- Tickets: `channel_id`, `user_id`, `status`, `priority`, `createdAt`
- Mensagens: `ticket`, `user_id`, `createdAt`

## 🔧 Configuração Avançada

### Permissões do Bot

O bot precisa das seguintes permissões no Discord:

- Send Messages
- Embed Links
- Use Slash Commands
- Manage Channels (para tickets)
- Manage Roles (para tickets)

### Configuração de Canais (Bot de Servidor Específico)

- **Canal de Vendas**: Configure `SALES_CHANNEL_ID` para receber notificações de vendas
- **Categoria de Tickets**: Configure `TICKET_CATEGORY_ID` para organizar tickets
- **Role da Staff**: Configure `STAFF_ROLE_ID` para permissões de staff

## 🚀 Deploy

### Local

```bash
npm start
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### PM2

```bash
npm install -g pm2
pm2 start src/index.js --name "bot-geralt"
pm2 save
pm2 startup
```

### Discloud

1. Crie uma conta no [Discloud](https://discloud.app)
2. Conecte seu repositório GitHub
3. Configure as variáveis de ambiente
4. Deploy automático

## 📊 Monitoramento

### Health Check

```
GET http://seu-servidor:3000/health
```

### Logs

O bot gera logs detalhados no console. Para produção, considere usar um sistema de logging como Winston.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique se todas as variáveis de ambiente estão configuradas
2. Certifique-se de que o bot tem as permissões necessárias
3. Verifique os logs do console para erros
4. Abra uma issue no GitHub

## 🎯 Roadmap

- [ ] Sistema de cupons e descontos
- [ ] Integração com gateways de pagamento
- [ ] Dashboard web para administração
- [ ] Sistema de notificações por email
- [ ] Backup automático do banco de dados
- [ ] API REST para integrações externas
- [ ] Sistema de avaliações e reviews
- [ ] Relatórios avançados com gráficos

---

**Desenvolvido com ❤️ para a comunidade Discord**
