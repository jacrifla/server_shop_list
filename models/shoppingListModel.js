const connection = require('../config/db');

const ShoppingList = {
    create: async ({userId, name}) => {
        const query = `
            INSERT INTO shopping_lists (user_id, name, created_at)
            VALUES ($1, $2, CURRENT_TIMESTAMP)
            RETURNING *;
        `
        const values = [userId, name];
        const result = await connection.query(query, values);
        return result.rows[0];
    },

    findAll: async () => {
        const query = 'SELECT * FROM shopping_lists WHERE deleted_at IS NULL';
        const result = await connection.query(query);
        return result.rows;
    },

    findListByUserId: async ({userId}) => {
        const query = 'SELECT * FROM shopping_lists WHERE user_id = $1 AND deleted_at IS NULL';
        const values = [userId];
        const result = await connection.query(query, values);
        return result.rows;
    },

    delete: async ({listId}) => {
        const query = 'UPDATE shopping_lists SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1';
        const values = [listId];
        const result = await connection.query(query, values);
        return result.rowCount;
    },

    findListWithPermission: async ({userId}) => {
        const query = `
            SELECT a.*
            FROM shopping_lists a
            WHERE a.user_id = $1 AND a.deleted_at IS NULL
            UNION
            SELECT a.*
            FROM shopping_lists a
            JOIN shared_list_permissions b
            ON a.id = b.list_id
            WHERE b.user_id = $1 AND a.deleted_at IS NULL;
        `;
        const values = [userId];
        const result = await connection.query(query, values);
        return result.rows;
    },

    update: async ({name, listId}) => {
        const query = `
            UPDATE shopping_lists 
            SET name = $1, updated_at = CURRENT_TIMESTAMP
            WHERE id = $2 AND deleted_at IS NULL
            RETURNING *
        `;
        const values = [name, listId];
        const result = await connection.query(query, values);
        return result.rows[0];
    }
}

module.exports = ShoppingList;
