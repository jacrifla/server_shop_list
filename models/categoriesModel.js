const connection = require('../config/db');

const Categories = {
    create: async ({ name, description }) => {
        const query = `
            INSERT INTO categories (name, description) 
            VALUES ($1, $2) 
            RETURNING *
        `;
        const values = [name, description];
        const result = await connection.query(query, values);
        return result.rows[0];
    },

    findAll: async () => {
        const query = 'SELECT * FROM categories';
        const result = await connection.query(query);
        return result.rows;
    },

    findById: async ({id}) => {
        const query = 'SELECT * FROM categories WHERE id = $1';
        const values = [id];
        const result = await connection.query(query, values);
        return result.rows[0];
    },

    delete: async ({id}) => {
        const query = 'DELETE FROM categories WHERE id = $1'
        const values = [id];
        const result = await connection.query(query, values);
        return result.rowCount;
    }
}

module.exports = Categories;