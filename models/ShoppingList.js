const connection = require('../config/db');

class ShoppingList {
    // Criar Lista de compras
    static create({userId, nameList}, callback) {
        const query = 'INSERT INTO shopping_lists (user_id, name, created_at) VALUES(?,?, NOW())';
        connection.query(query, [userId, nameList], (err, results) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, {id: results.insertId, userId, nameList});
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
        const query = 'UPDATE shopping_lists SET deleted_at = NOW() WHERE id =?';
        connection.query(query, [id], (err, results) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, results.affectedRows);
        })
    }
}

module.exports = ShoppingList;