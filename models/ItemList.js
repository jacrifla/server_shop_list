const connection = require('../config/db');

class ItemList {
    // Cadastrar um item
    static create({listId, name, quantity = 1, observation = ''}, callback) {
        const query = `INSERT INTO list_items (list_id, name, quantity, observation, created_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`;
        connection.query(query, [listId, name, quantity, observation], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, {id: results.insertId, product: name, quantity, observation});
        });
    }
    

    // Obter todos os itens de uma lista especifica
    static getByListId(listId, callback) {
        // const
    }
}

module.exports = ItemList;