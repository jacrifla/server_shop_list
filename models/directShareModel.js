const connection = require("../config/db");

const DirectShare = {
    create: async ({ listId, sharedWithUserId, permission }) => {
        const query = `
            INSERT INTO direct_shares (list_id, shared_with_user_id, permission, created_at)
            VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
            RETURNING *;
        `;
        const values = [listId, sharedWithUserId, permission];
        const result = await connection.query(query, values);
        return result.rows[0];
    },

    findListById: async ({listId}) => {
        const query = `
            SELECT id, list_id, shared_with_user_id, permission, created_at
            FROM direct_shares
            WHERE list_id = $1
        `;
        const values = [listId];
        const result = await connection.query(query, values);
        return result.rows;
    },

    findListByUserId: async ({userId}) => {
        const query = `
            SELECT id, list_id, shared_with_user_id, permission, created_at 
            FROM direct_shares
            WHERE shared_with_user_id = $1
        `;
        const values = [userId];
        const result = await connection.query(query, values);
        return result.rows;
    },

    delete: async ({id}) => {
        const query = `DELETE FROM direct_shares WHERE id = $1`;
        const values = [id];
        const result = await connection.query(query, values);
        return result.rowCount;
    },
}

module.exports = DirectShare;