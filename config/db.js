require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

pool.connect((err) => {
    if (err) {
        console.error(`Erro ao conectar ao banco de dados: ${err.message}`);
        return;
    }
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
});

module.exports = pool;

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error(`Erro na consulta: ${err.message}`);
    } else {
        console.log(`Hora atual do banco de dados: ${res.rows[0].now}`);
    }
});
