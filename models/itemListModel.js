const connection = require('../config/db');

const ItemList = {
    create: async ({listId, name, observation = '', categoryId}) => {
        const query = `
            INSERT INTO list_items (list_id, name, observation, category_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const values = [listId, name, observation, categoryId];
        const result = await connection.query(query, values);
        return result.rows[0];
    }, 

    findAllByList: async ({listId}) => {
        const query = `
            SELECT *
            FROM list_items
            WHERE list_id = $1 AND deleted_at IS NULL;
        `;
        const values = [listId];
        const result = await connection.query(query, values);
        return result.rows;
    },

    toggleCheck: async ({itemId}) => {
        const query = `
            UPDATE list_items
            SET checked = NOT checked
            WHERE id = $1
            RETURNING id, checked;
        `;
        const values = [itemId];
        const result = await connection.query(query, values);
        return result.rows[0];
    },

    delete: async ({itemId}) => {
        const query = `
            UPDATE list_items
            SET deleted_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING id;
        `;
        const values = [itemId];
        const result = await connection.query(query, values);
        return result.rows[0];
    },

    update: async ({name, observation, categoryId, itemId}) => {
        let query = 'UPDATE list_items SET';
        const values = [];
        const setFields = [];

        if (name) {
            setFields.push('name = $1');
            values.push(name);
        }
        if (observation) {
            setFields.push('observation = $2');
            values.push(observation);
        }
        if (categoryId) {
            setFields.push('category_id = $3');
            values.push(categoryId);
        }
        if (setFields.length === 0) {
            throw new Error('Nenhum campo a ser atualizado');
        }
        query += ' ' + setFields.join(', ') + ' WHERE id = $' + (values.length + 1);
        values.push(itemId);
        
        const result = await connection.query(query, values);
        return result.rows[0];
    },
}

module.exports = ItemList;
