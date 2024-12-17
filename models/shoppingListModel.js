const connection = require('../config/db');

class ShoppingList {
    // Criar Lista de compras
    static create({ userId, name }, callback) {
        const query = `
            INSERT INTO shopping_lists (user_id, name, created_at) 
            VALUES ($1, $2, CURRENT_TIMESTAMP) 
            RETURNING id;
        `;
        connection.query(query, [userId, name], (err, results) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, { id: results.rows[0].id, userId, name });
        });
    }

    // Buscar todas as listas de compras
    static getAll(callback) {
        const query = 'SELECT * FROM shopping_lists WHERE deleted_at IS NULL';
        connection.query(query, (err, results) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, results.rows);
        });
    }

    // Buscar lista de compras por usuario
    static getListByUserId(id, callback) {
        const query = 'SELECT * FROM shopping_lists WHERE user_id = $1 AND deleted_at IS NULL';
        connection.query(query, [id], (err, results) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, results.rows);
        });
    }

    // Deletar lista de compras por ID
    static deleteById(id, callback) {
        const query = 'DELETE FROM shopping_lists WHERE id = $1';
        connection.query(query, [id], (err, results) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, results.rowCount); // PostgreSQL usa rowCount
        });
    }

    // Compartilhar uma lista de compras
    static shareList({ listId, userId }, callback) {
        const query = `
            INSERT INTO shared_lists (list_id, user_id, shared_at) 
            VALUES ($1, $2, CURRENT_TIMESTAMP) 
            RETURNING id;
        `;
        connection.query(query, [listId, userId], (err, results) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, { sharedId: results.rows[0].id, listId, userId });
        });
    }

    // Obter listas com permissões compartilhadas
    static getListWithPermission(userId, callback) {
        const query = `
            SELECT a.* 
            FROM shopping_lists a
            WHERE a.user_id = $1 
            UNION
            SELECT a.* 
            FROM shopping_lists a
            JOIN shared_list_permissions b 
            ON a.id = b.list_id 
            WHERE b.user_id = $1;
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

module.exports = ShoppingList;
