const connection = require("../config/db");

class DirectShare {
    // Criar um novo compartilhamento direto
    static create({ listId, sharedWithUserId, permission }, callback) {
        const query = 'INSERT INTO direct_shares (list_id, shared_with_user_id, permission, created_at) VALUES (?, ?, ?, NOW())';
        connection.query(query, [listId, sharedWithUserId, permission], (err, results) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, { id: results.insertId, listId, sharedWithUserId, permission });
        });
    }

    // Buscar compartilhamentos diretos por ID da lista
    static getByListId(listId, callback) {
        const query = 'SELECT * FROM direct_shares WHERE list_id = ?';
        connection.query(query, [listId], (err, results) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, results);
        });
    }

    // Buscar compartilhamentos diretos por ID do usuário
    static getByUserId(userId, callback) {
        const query = 'SELECT * FROM direct_shares WHERE shared_with_user_id = ?';
        connection.query(query, [userId], (err, results) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, results);
        });
    }

    // Deletar um compartilhamento direto por ID
    static deleteById(id, callback) {
        const query = 'DELETE FROM direct_shares WHERE id = ?';
        connection.query(query, [id], (err, results) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, results.affectedRows);
        });
    }
}

module.exports = DirectShare;