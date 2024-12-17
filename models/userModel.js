const connection = require('../config/db');

class User {    
    // Buscar todos os usuarios
    static getAll(callback) {
        const query = 'SELECT id, name, email, created_at, updated_at FROM users WHERE deleted_at IS NULL';
        connection.query(query, (err, results) => {
            if (err) {
                callback(err, null);
                return;
            }          
            callback(null, results.rows);
        })
    }

  // Buscar um usuário pelo email
    static getByEmail(email, callback) {
        const query = 'SELECT id, name, email, created_at, updated_at FROM users WHERE email = $1 AND deleted_at IS NULL';
        connection.query(query, [email], (err, result) => {
            if (err) {
                callback(err, null);
                return;
            }
            // Verificando o retorno correto da consulta
            if (result.rows.length === 0) {
                callback(null, null);
                return;
            }
            callback(null, result.rows[0]);
        });
    }


    // Buscar um usuário por ID
    static getById(id, callback) {
        const query = 'SELECT id, name, email, created_at, updated_at FROM users WHERE id = $1 AND deleted_at IS NULL';
        connection.query(query, [id], (err, result) => {
            if (err) {
                callback(err, null);
                return;
            }
            if (result.length === 0) {
                callback(null, null);
                return;
            }
            callback(null, result.rows);
        })
    }

    // Atualizar informações de um usuário
    static update(id, {name, email}, callback) {
        const query = 'UPDATE users SET name = $1, email = $2 WHERE id = $3';
        connection.query(query, [name, email, id], (err, results) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, results.rows);
        })
    }

    // Deletar um usuário
    static delete(id, callback) {
        const query = 'UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1';
        connection.query(query, [id], (err, results) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, results.rows);
        })
    }

    // Restaurar um usuário deletado
    static restore(id, callback) {
        const query = 'UPDATE users SET deleted_at = NULL WHERE id = $1';
        connection.query(query, [id], (err, results) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, results.rows);
        })
    }
    
    // Obter mensagens de compartilhamento de listas
    static getMessages(userId, callback) {
        const query = `
            SELECT st.id AS tokenId, st.token, l.id AS listId, l.name AS listName, u.email AS senderEmail
            FROM share_tokens st
            JOIN users u ON st.user_id = u.id
            JOIN shopping_lists l ON st.list_id = l.id
            WHERE st.expires_at > CURRENT_TIMESTAMP AND st.user_id = $1
        `;
        connection.query(query, [userId], (err, results) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, results.rows);
        });
    }    
}

module.exports = User;