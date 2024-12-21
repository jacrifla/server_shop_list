const cors = require('cors');
const express = require('express');

module.exports = (app) => {
    app.use(cors({
        origin: function (origin, callback) {
            const allowedOrigins = [
                'http://localhost:3000', 
                'https://api-shop-server-c62ad5afaeaa.herokuapp.com',
                'https://shoplistmom.netlify.app'
            ];
            if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: 'GET, POST, PUT, DELETE',
        allowedHeaders: 'Content-Type, Authorization',
        credentials: true,
    }));

    app.use(express.json());
}
