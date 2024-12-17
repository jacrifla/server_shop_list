const connection = require("../config/db");
class DirectShare {
    // Criar um novo compartilhamento direto 
    static create({ listId, sharedWithUserId, permission }, callback) {
        const query = `
            INSERT INTO direct_shares (list_id, shared_with_user_id, permission, created_at)
            VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
            RETURNING id, list_id, shared_with_user_id, permission
        `;
        const values = [listId, sharedWithUserId, permission];

        pool.query(query, values, (err, res) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, res.rows[0]);
        });
    }

    // Buscar compartilhamentos diretos por ID da lista
    static getByListId(listId, callback) {
        const query = `
            SELECT id, list_id, shared_with_user_id, permission, created_at
            FROM direct_shares
            WHERE list_id = $1
        `;
        pool.query(query, [listId], (err, res) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, res.rows);
        });
    }

    // Buscar compartilhamentos diretos por ID do usuário
    static getByUserId(userId, callback) {
        const query = `
            SELECT id, list_id, shared_with_user_id, permission, created_at
            FROM direct_shares
            WHERE shared_with_user_id = $1
        `;
        pool.query(query, [userId], (err, res) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, res.rows);
        });
    }

    // Deletar um compartilhamento direto por ID
    static deleteById(id, callback) {
        const query = `DELETE FROM direct_shares WHERE id = $1`;
        pool.query(query, [id], (err, res) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, res.rowCount);
        });
    }
}

module.exports = DirectShare;