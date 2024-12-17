const connection = require('../config/db');

class ItemList {
    // Cadastrar um item
    static create({listId, name, quantity = 1, observation = ''}, callback) {
        const query = `INSERT INTO list_items (list_id, name, quantity, observation, created_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`;
        connection.query(query, [listId, name, quantity, observation], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, {id: results.insertId, name, quantity, observation});
        });
    }
    

    // Obter todos os itens de uma lista
    static getAllByList(listId, callback) {        
        const query = `SELECT * FROM list_items WHERE list_id = ? AND deleted_at IS NULL`;
        
        connection.query(query, [listId], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results);
        });
    }

    // Atualiza o campo chack
    static toggleCheck(itemId, callback) {

        const getQuery = `SELECT checked FROM list_items WHERE id = ?`;

        connection.query(getQuery, [itemId], (err, results) => {
            if (err) {
                return callback(err, null);
            }

            if (results.length === 0) {
                return callback(null, false); // Item não encontrado
            }

            const currentChecked = results[0].checked;
            const newChecked = !currentChecked; // Alterna o estado

            const updateQuery = `UPDATE list_items SET checked = ? WHERE id = ?`;

            connection.query(updateQuery, [newChecked, itemId], (err, result) => {
                if (err) {
                    return callback(err, null);
                }
                callback(null, result.affectedRows > 0); // Retorna se a atualização foi bem-sucedida
            });
        });
    }

    // Atualizar um item
    static update(id, updates, callback) {
        let updateQuery = 'UPDATE list_items SET ';
        const updateValues = [];
        const updateFields = [];

        if (updates.name) {
            updateFields.push('name = ?');
            updateValues.push(updates.name);
        }
        if (updates.quantity) {
            updateFields.push('quantity = ?');
            updateValues.push(updates.quantity);
        }
        if (updates.observation) {
            updateFields.push('observation = ?');
            updateValues.push(updates.observation);
        }

        updateQuery += updateFields.join(', ');
        updateQuery += ' WHERE id = ?';
        updateValues.push(id);

        connection.query(updateQuery, updateValues, (err, result) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, result);
        });
    }

    // Deletar um item (soft delete)
    static delete(id, callback) {
        const query = `UPDATE list_items SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?`;
        connection.query(query, [id], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, result);
        });
    }
}

module.exports = ItemList;