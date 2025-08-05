const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        status: 'online',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        bot: 'Bot Geralt - Sistema de Moderação e Música'
    });
});

// Health check para Railway
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🏥 Health check server rodando na porta ${PORT}`);
});

module.exports = app; 