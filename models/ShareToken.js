const connection = require('../config/db');

const ShareToken = {
    // Criar um novo token de compartilhamento
    create: ({ listId, userId, expiresAt }, callback) => {
        const query = 'INSERT INTO share_tokens (list_id, user_id, token, expires_at, status) VALUES (?, ?, UUID(), ?, ?)';
        const params = [listId, userId, expiresAt, 'pending'];
    
        connection.query(query, params, (err, results) => {
            if (err) {
                return callback(err, null);
            }
    
            // Retorna o token recém-criado
            const newTokenQuery = 'SELECT * FROM share_tokens WHERE id = ?';
            connection.query(newTokenQuery, [results.insertId], (fetchErr, rows) => {
                if (fetchErr) {
                    return callback(fetchErr, null);
                }
                callback(null, rows[0]);
            });
        });
    },

    // Buscar tokens de uma lista pelo ID da lista
    getByListId: (listId, callback) => {
        const query = 'SELECT * FROM share_tokens WHERE list_id = ?';
        connection.query(query, [listId], (err, rows) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, rows);
        });
    },

    // Verificar se um token é válido
    verifyShareToken: (token, callback) => {
        const query = 'SELECT * FROM share_tokens WHERE token = ? AND status = ?';
        connection.query(query, [token, 'pending'], (err, rows) => {
            if (err) {
                return callback(err, null);
            }
    
            // Se não encontrar o token ou se a data de expiração já passou
            if (rows.length === 0) {
                return callback(null, { valid: false, message: 'Token não encontrado ou expirado' });
            }
    
            const tokenData = rows[0];
            if (new Date(tokenData.expires_at) < new Date()) {
                return callback(null, { valid: false, message: 'Token expirado' });
            }
    
            // Se o token for válido, retornamos true
            callback(null, { valid: true, message: 'Token válido' });
        });
    },

    // Atualizar o status de um token
    updateStatus: (token, status, callback) => {
        const query = 'UPDATE share_tokens SET status = ? WHERE token = ?';
        connection.query(query, [status, token], (err, results) => {
            if (err) {
                return callback(err, null);
            }

            // Verifica se alguma linha foi afetada
            callback(null, results.affectedRows > 0);
        });
    },

    // Deletar um token pelo ID
    deleteTokenById: (id, callback) => {
        const query = 'DELETE FROM share_tokens WHERE id = ?';
        connection.query(query, [id], (err, results) => {
            if (err) {
                return callback(err, null);
            }

            // Retorna o número de linhas afetadas
            callback(null, results.affectedRows);
        });
    },

    // Função para obter tokens por list_id e user_id
    getTokensByUserId: (userId, callback) => {
        const query =  `SELECT * FROM share_tokens WHERE user_id = ? AND status = 'pending'`;
        
        connection.query(query, [userId], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results);
        });
    },
};

module.exports = ShareToken;
