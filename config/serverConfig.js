const cors = require('cors');
const express = require('express');

module.exports = (app) => {
    // Middleware para habilitar CORS
    app.use(cors({
        // Permite apenas este domínio
        origin: 'http://localhost:3000',
        // Métodos permitidos
        methods: 'GET, POST, PUT, DELETE',
        // Cabeçalhos permitidos
        allowedHeaders: 'Content-Type, Authorization'
    }));

    app.use(express.json());
}