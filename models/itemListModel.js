const connection = require('../config/db');

class ItemList {
    // Cadastrar um item
    static create({ listId, name, quantity = 1, observation = '' }, callback) {
        const query = `
            INSERT INTO list_items (list_id, name, quantity, observation, created_at) 
            VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) 
            RETURNING id, name, quantity, observation;
        `;
        connection.query(query, [listId, name, quantity, observation], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results.rows[0]);
        });
    }

    // Obter todos os itens de uma lista
    static getAllByList(listId, callback) {
        const query = `
            SELECT * 
            FROM list_items 
            WHERE list_id = $1 AND deleted_at IS NULL;
        `;

        connection.query(query, [listId], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results.rows);
        });
    }

    // Atualizar o campo checked
    static toggleCheck(itemId, callback) {
        const getQuery = `SELECT checked FROM list_items WHERE id = $1;`;

        connection.query(getQuery, [itemId], (err, results) => {
            if (err) {
                return callback(err, null);
            }

            if (results.rows.length === 0) {
                return callback(new Error('Item não encontrado'), null);
            }

            const currentChecked = results.rows[0].checked;
            const newChecked = !currentChecked;

            const updateQuery = `
                UPDATE list_items 
                SET checked = $1 
                WHERE id = $2 
                RETURNING id, checked;
            `;

            connection.query(updateQuery, [newChecked, itemId], (err, result) => {
                if (err) {
                    return callback(err, null);
                }
                callback(null, result.rows[0]);
            });
        });
    }

    // Atualizar um item
    static update(id, updates, callback) {
        let updateFields = [];
        let updateValues = [];
        let placeholderIndex = 1;

        if (updates.name) {
            updateFields.push(`name = $${placeholderIndex++}`);
            updateValues.push(updates.name);
        }
        if (updates.quantity) {
            updateFields.push(`quantity = $${placeholderIndex++}`);
            updateValues.push(updates.quantity);
        }
        if (updates.observation) {
            updateFields.push(`observation = $${placeholderIndex++}`);
            updateValues.push(updates.observation);
        }

        if (updateFields.length === 0) {
            return callback(new Error('Nenhum campo para atualizar.'), null);
        }

        const query = `
            UPDATE list_items 
            SET ${updateFields.join(', ')} 
            WHERE id = $${placeholderIndex} 
            RETURNING id, name, quantity, observation;
        `;

        updateValues.push(id);

        connection.query(query, updateValues, (err, result) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, result.rows[0]);
        });
    }

    // Deletar um item
    static delete(id, callback) {
        const query = `
            UPDATE list_items 
            SET deleted_at = CURRENT_TIMESTAMP 
            WHERE id = $1 
            RETURNING id, deleted_at;
        `;

        connection.query(query, [id], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, result.rows[0]);
        });
    }
}

module.exports = ItemList;
