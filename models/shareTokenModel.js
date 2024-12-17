const connection = require('../config/db');

const ShareToken = {
    // Criar um novo token de compartilhamento
    create: ({ listId, userId, expiresAt }, callback) => {
        const query = `
            INSERT INTO share_tokens (list_id, user_id, token, expires_at, status) 
            VALUES ($1, $2, gen_random_uuid(), $3, $4) 
            RETURNING *;
        `;
        const params = [listId, userId, expiresAt, 'pending'];

        connection.query(query, params, (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results.rows[0]);
        });
    },

    // Buscar tokens de uma lista pelo ID da lista
    getByListId: (listId, callback) => {
        const query = 'SELECT * FROM share_tokens WHERE list_id = $1';
        connection.query(query, [listId], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results.rows);
        });
    },

    // Verificar se um token é válido
    verifyShareToken: (token, callback) => {
        const query = `
            SELECT * 
            FROM share_tokens 
            WHERE token = $1 AND status = $2;
        `;
        connection.query(query, [token, 'pending'], (err, results) => {
            if (err) {
                return callback(err, null);
            }

            // Se nenhum token for encontrado ou estiver expirado
            if (results.rows.length === 0) {
                return callback(null, { valid: false, message: 'Token não encontrado ou expirado' });
            }

            const tokenData = results.rows[0];
            if (new Date(tokenData.expires_at) < new Date()) {
                return callback(null, { valid: false, message: 'Token expirado' });
            }

            callback(null, { valid: true, message: 'Token válido' });
        });
    },

    // Atualizar o status de um token
    updateStatus: (token, status, callback) => {
        const query = 'UPDATE share_tokens SET status = $1 WHERE token = $2';
        connection.query(query, [status, token], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results.rowCount > 0); // Verifica se alguma linha foi afetada
        });
    },

    // Deletar um token pelo ID
    deleteTokenById: (id, callback) => {
        const query = 'DELETE FROM share_tokens WHERE id = $1';
        connection.query(query, [id], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results.rowCount); // Retorna o número de linhas afetadas
        });
    },

    // Função para obter tokens por list_id e user_id
    getTokensByUserId: (userId, callback) => {
        const query = `
            SELECT * 
            FROM share_tokens 
            WHERE user_id = $1 AND status = 'pending';
        `;
        connection.query(query, [userId], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results.rows);
        });
    },
};

module.exports = ShareToken;
