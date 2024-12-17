const cors = require('cors');
const express = require('express');

module.exports = (app) => {
    // Middleware para habilitar CORS
    app.use(cors({
        origin: function (origin, callback) {
            // Lista de domínios permitidos
            const allowedOrigins = ['http://localhost:3000', 'https://api-shop-server-c62ad5afaeaa.herokuapp.com'];
            if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
                // Permite a origem se estiver na lista ou se não houver origem (caso de requisições do servidor)
                callback(null, true);
            } else {
                // Rejeita a requisição se a origem não for permitida
                callback(new Error('Not allowed by CORS'));
            }
        },
        // Métodos permitidos
        methods: 'GET, POST, PUT, DELETE',
        // Cabeçalhos permitidos
        allowedHeaders: 'Content-Type, Authorization'
    }));

    app.use(express.json());
}
