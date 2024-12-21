const connection = require('../config/db');

const ShareToken = {
    create: async ({ listId, userId, expiresAt }) => {
        const query = `
            INSERT INTO share_tokens (list_id, user_id, token, expires_at, status) 
            VALUES ($1, $2, gen_random_uuid(), $3, $4) 
            RETURNING *;
        `;
        const values = [listId, userId, expiresAt, 'pending'];

        const result = await connection.query(query, values);

        if (result.rowCount === 0) {
            throw new Error("Falha ao criar token.");
        }

        return result.rows[0];
    },

    findByListId: async ({ listId}) => {
        const query = `
            SELECT * 
            FROM share_tokens 
            WHERE list_id = $1
        `;
        const values = [listId];
        const result = await connection.query(query, values);
        return result.rows;
    },

    findTokensByUserId: async ({userId}) => {
        const query = `
            SELECT * 
            FROM share_tokens 
            WHERE user_id = $1 AND status = 'pending';
        `;
        const values = [userId];
        const result = await connection.query(query, values);
        return result.rows;
    },

    deleteTokenById: async ({id}) => {
        const query = `
            DELETE FROM share_tokens 
            WHERE id = $1
        `;
        const values = [id];
        const result = await connection.query(query, values);
        return result.rowCount > 0;
    },

    verifyShareToken: async ({token}) => {
        const query = `
            SELECT * 
            FROM share_tokens 
            WHERE token = $1 AND status = 'pending' AND expires_at > CURRENT_TIMESTAMP;
        `;
        const values = [token];
        const result = await connection.query(query, values);

        return result.rows.length > 0;
    },

    updateStatus: async ({token, status}) => {
        const query = `
            UPDATE share_tokens 
            SET status = $1 
            WHERE token = $2
        `;
        const values = [status, token];
        const result = await connection.query(query, values);
        return result.rowCount > 0;
    },
};

module.exports = ShareToken;
