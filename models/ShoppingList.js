const connection = require('../config/db');

class ShoppingList {
    // Criar Lista de compras
    static create({ userId, name }, callback) {
        const query = 'INSERT INTO shopping_lists (user_id, name, created_at) VALUES(?,?, NOW())';
        connection.query(query, [userId, name], (err, results) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, { id: results.insertId, userId, name });
        })
    }

    // Buscar todas as listas de compras
    static getAll(callback) {
        const query = 'SELECT * FROM shopping_lists WHERE deleted_at IS NULL';
        connection.query(query, (err, results) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, results);
        })
    }

    // Buscar lista de compras por usuario
    static getListByUserId(id, callback) {
        const query = 'SELECT * FROM shopping_lists WHERE user_id =? AND deleted_at IS NULL';
        connection.query(query, [id], (err, results) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, results);
        })
    }

    // Deletar lista de compras por ID
    static deleteById(id, callback) {
        const query = 'DELETE FROM shopping_lists WHERE id = ?';
        connection.query(query, [id], (err, results) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, results.affectedRows);
        });
    }

    // Compartilhar uma lista de compras
    static shareList({ listId, userId }, callback) {
        const query = `
            INSERT INTO shared_lists (list_id, user_id, shared_at) 
            VALUES (?, ?, NOW())
        `;
        connection.query(query, [listId, userId], (err, results) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, { sharedId: results.insertId, listId, userId });
        });
    }

    static getListWithPermission(userId, callback) {
        const query = `
                SELECT a.* 
                FROM shopping_lists a
                WHERE a.user_id = ? 
                UNION
                SELECT a.* 
                FROM shopping_lists a
                JOIN shared_list_permissions b 
                ON a.id = b.list_id 
                WHERE b.user_id = ?;
        `;

        connection.query(query, [userId, userId], (err, results) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, results);
        });

    }
}

module.exports = ShoppingList;