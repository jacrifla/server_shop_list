const connection = require('../config/db');

const ItemPriceHistory = {
    create: async ({itemId, price, quantity, unit, barcode}) => {
        const query = `
            INSERT INTO item_price_history (item_id, price, quantity, unit, barcode, created_at)
            VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
            RETURNING *;
        `;
        const values = [itemId, price, quantity, unit, barcode || null];
        const result = await connection.query(query, values);
        return result.rows[0];
    },
    
    
    findAll: async () => {
        const query = `
            SELECT * 
            FROM item_price_history
        `;
        const result = await connection.query(query);
        return result.rows;
    },
    
    findById: async ({itemId}) => {
        const query = `
            SELECT * 
            FROM item_price_history 
            WHERE item_id = $1
        `;
        const values = [itemId];
        const result = await connection.query(query, values);
        return result.rows;
    },

    update: async ({ id, price, quantity, unit }) => {
        const query = `
            UPDATE item_price_history
            SET price = $1, quantity = $2, unit = $3, updated_at = CURRENT_TIMESTAMP
            WHERE item_id = $4
            RETURNING *;
        `;
        const values = [price, quantity, unit, id];
        const result = await connection.query(query, values);
        return result.rows[0];
    },
    
    delete: async ({id}) => {
        const query = `
            DELETE FROM item_price_history
            WHERE item_id = $1
            RETURNING *;
        `;
        const values = [id];
        const result = await connection.query(query, values);
        return result.rows[0];
    },

    findAllWithNameItem: async () => {
        const query = `
            SELECT a.item_id, b.name  AS item_name, a.price, a.quantity, a.date
            FROM item_price_history a
            JOIN list_items b ON a.item_id = b.id
        `;
        const result = await connection.query(query);
        return result.rows;
    },
}

module.exports = ItemPriceHistory;