require('dotenv').config();
const express = require('express');
const app = express();
const shoppingListRoutes = require('./routes/shoppingListRoutes');
const userRoutes = require('./routes/userRoutes');
const itemListRoutes = require('./routes/itemListRoutes');
const bodyParser = require('body-parser');

// Middleware para analisar o corpo das requisições
app.use(bodyParser.json());

app.use(express.json());
app.use('/users', userRoutes);
app.use('/shopping-list', shoppingListRoutes);
app.use('/item-list', itemListRoutes);


app.get('/', (req, res) => {
    res.send('Servidor rodando!');
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);    
});
