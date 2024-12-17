const connection = require('../config/db');
const bcrypt = require('bcrypt');

const saltRounds = 10;

class UserAuth {
    // Criar um novo usuário
    static create({ name, email, password }, callback) {
        bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
            if (err) {
                return callback(err, null);
            }
            const query = 'INSERT INTO users (name, email, password, created_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)';
            connection.query(query, [name, email, hashedPassword], (err, result) => {
                if (err) {
                    return callback(err, null);
                }
                callback(null, {
                    id: result.insertId,
                    name,
                    email
                });
            });
        })
    }

    // Verificar a senha ao fazer login
    static verifyPassword(inputPassword, storedPassword, callback) {
        bcrypt.compare(inputPassword, storedPassword, (err, isMatch) => {
            if (err) {
                return callback(err, false);
            }
            callback(null, isMatch);
        });
    }

    // Login so usuário
    static login(email, password, callback) {
        const query = 'SELECT id, name, email, password FROM users WHERE email = $1 AND deleted_at IS NULL';
        connection.query(query, [email], (err, results) => {
            if (err) {
                callback(err, null);
                return;
            }
            if (results.rows.length === 0) {
                callback(null, null); // Usuário não encontrado
                return;
            }
    
            const storedPassword = results.rows[0].password;
    
            UserAuth.verifyPassword(password, storedPassword, (err, isMatch) => {
                if (err) {
                    return callback(err, null);
                }
                if (isMatch) {
                    callback(null, {
                        id: results.rows[0].id,
                        name: results.rows[0].name,
                        email: results.rows[0].email
                    });
                } else {
                    callback(null, null); // Senha incorreta
                }
            });
        });
    }
    

    // Redefinir a senha
    static resetPassword(email, newPassword, callback) {
        bcrypt.hash(newPassword, saltRounds, (err, hashedPassword) => {
            if (err) {
                return callback(err, null);
            }

            const query = 'UPDATE users SET password = $1 WHERE email = $2';
            connection.query(query, [hashedPassword, email], (err, results) => {
                if (err) {
                    return callback(err, null);
                }
                if (results.affectedRows === 0) {
                    // Usuário não encontrado
                    return callback(null, null);
                }
                callback(null, { message: 'Senha redefinida com sucesso!' });
            });
        });
    }
}

module.exports = UserAuth;