require('dotenv').config();
const express = require('express');
const app = express();

// Importa a configuração do servidor
const configureServer = require('./config/serverConfig');
const configureRoutes = require('./config/routeConfig');

// Configura o servidor (middlewares, CORS, JSON parser)
configureServer(app);
// Configura as rotas
configureRoutes(app);

// Rota inicial
app.get('/', (req, res) => {
    res.send('Servidor rodando!');
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

