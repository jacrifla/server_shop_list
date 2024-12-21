const connection = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRounds = 10;
const secretKey = process.env.SECRET_KEY; 

const User = {
    create: async ({name, email, password}) => {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const query = `
            INSERT INTO users (name, email, password, created_at)
            VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
            RETURNING id, name, email, created_at, updated_at;
        `;
        const values = [name, email, hashedPassword];
        const result = await connection.query(query, values);
        return result.rows[0];
    },

    findAll: async () => {
        const query = `
            SELECT id, name, email, created_at, updated_at 
            FROM users
            WHERE deleted_at IS NULL;
        `;
        const result = await connection.query(query);
        return result.rows;
    },

    findByEmail: async ({email}) => {
        const query = `
            SELECT id, name, email, created_at, updated_at 
            FROM users
            WHERE email = $1 AND deleted_at IS NULL;
        `;
        const values = [email];
        const result = await connection.query(query, values);       
        return result.rows[0] || null;
    },

    findById: async ({userId}) => {
        const query = `
            SELECT id, name, email, created_at, updated_at 
            FROM users
            WHERE id = $1 AND deleted_at IS NULL;
        `;
        const values = [userId];
        const result = await connection.query(query, values);
        return result.rows[0];
    },

    update: async ({ userId, name, email }) => {
        const fields = [];
        const values = [];
        
        if (name) {
            fields.push('name = $' + (fields.length + 1));
            values.push(name);
        }
        
        if (email) {
            fields.push('email = $' + (fields.length + 1));
            values.push(email);
        }
        
        if (fields.length === 0) {
            throw new Error('Nenhum campo fornecido para atualização');
        }
    
        const query = `
            UPDATE users 
            SET ${fields.join(', ')} 
            WHERE id = $${fields.length + 1} AND deleted_at IS NULL
        `;
        values.push(userId);
    
        const result = await connection.query(query, values);
        return result.rowCount;
    },

    delete: async ({ userId }) => {
        const query = `
            UPDATE users
            SET deleted_at = CURRENT_TIMESTAMP
            WHERE id = $1 AND deleted_at IS NULL;
        `;
        const values = [userId];
        const result = await connection.query(query, values);
        return result.rowCount;
    },

    restore: async ({email}) => {
        const query = `
            UPDATE users
            SET deleted_at = NULL
            WHERE email = $1 AND deleted_at IS NOT NULL;
        `;
        const values = [email];
        const result = await connection.query(query, values);
        return result.rowCount;
    },

    generateToken: ({userId}) => {
        const payload = { userId };
        const token = jwt.sign(payload, secretKey, { expiresIn: '7d' });
        return token;
    },

    verifyPassword: async ({password, storedPassword}) => {
        const isMatch = await bcrypt.compare(password, storedPassword);
        if (!isMatch) {
            throw new Error('Senha incorreta.');            
        }

        return isMatch;
    },

    login: async ({email, password}) => {
        const query = `
            SELECT id, name, email, password
            FROM users
            WHERE email = $1 AND deleted_at IS NULL
        `;
        const values = [email];
        const result = await connection.query(query, values);

        if (result.rows.length === 0) {
            throw new Error('Usuário não encontrado.');
        }

        const user = result.rows[0];
        const isMatch = await User.verifyPassword({password, storedPassword: user.password});

        if (!isMatch) {
            throw new Error('Senha incorreta.');
        }

        delete user.password;

        const token = User.generateToken(user.id);

        return { user, token };
    },

    resetPassword: async ({ email, newPassword }) => {
        // Busca a senha existente
        const queryGetPassword = `
            SELECT password
            FROM users
            WHERE email = $1 AND deleted_at IS NULL
        `;
        const result = await connection.query(queryGetPassword, [email]);
    
        if (result.rowCount === 0) {
            throw new Error('Usuário não encontrado.');
        }
    
        const storedPassword = result.rows[0].password;
    
        // Verifica se a nova senha é a mesma da atual
        const isSamePassword = await bcrypt.compare(newPassword, storedPassword);
        if (isSamePassword) {
            throw new Error('A nova senha não pode ser igual à senha atual.');
        }
    
        // Hash da nova senha
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
        // Atualiza a senha no banco de dados
        const queryUpdatePassword = `
            UPDATE users
            SET password = $1, updated_at = CURRENT_TIMESTAMP
            WHERE email = $2 AND deleted_at IS NULL
            RETURNING id, name, email;
        `;
        const values = [hashedPassword, email];
        const updateResult = await connection.query(queryUpdatePassword, values);
    
        return updateResult.rows[0];
    },
    

    findShareTokensForUser: async ({userId}) => {
        const query = `
            SELECT st.id AS tokenId, st.token, l.id AS listId, l.name AS listName, u.email AS senderEmail
            FROM share_tokens st
            JOIN users u ON st.user_id = u.id
            JOIN shopping_lists l ON st.list_id = l.id
            WHERE st.expires_at > CURRENT_TIMESTAMP AND st.user_id = $1
        `;
        const values = [userId];
        const result = await connection.query(query, values);
        return result.rows;
    }    
}

module.exports = User;