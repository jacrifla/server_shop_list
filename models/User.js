require('dotenv').config();
const connection = require('../config/db');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const saltRounds = 10;

class User {    
    // Buscar todos os usuarios
    static getAll(callback) {
        const query = 'SELECT * FROM users WHERE deleted_at IS NULL';
        connection.query(query, (err, results) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, results);
        })
    }
    
    // Buscar um usuário pelo email
    static getByEmail(email, callback) {
        const query = 'SELECT * FROM users WHERE email = ? AND deleted_at IS NULL';
        connection.query(query, [email], (err, result) => {
            if (err) {
                callback(err, null);
                return;
            }
            if (result.length === 0) {
                callback(null, null);
                return;
            }
            callback(null, result[0]);
        })
    }

    // Buscar um usuário por ID
    static getById(id, callback) {
        const query = 'SELECT * FROM users WHERE id =? AND deleted_at IS NULL';
        connection.query(query, [id], (err, result) => {
            if (err) {
                callback(err, null);
                return;
            }
            if (result.length === 0) {
                callback(null, null);
                return;
            }
            callback(null, result[0]);
        })
    }

    // Atualizar informações de um usuário
    static update(id, {name, email}, callback) {
        const query = 'UPDATE users SET name =?, email =? WHERE id =?';
        connection.query(query, [name, email, id], (err, results) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, results);
        })
    }

    // Deletar um usuário
    static delete(id, callback) {
        const query = 'UPDATE users SET deleted_at = NOW() WHERE id =?';
        connection.query(query, [id], (err, results) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, results);
        })
    }

    // Restaurar um usuário deletado
    static restore(id, callback) {
        const query = 'UPDATE users SET deleted_at = NULL WHERE id =?';
        connection.query(query, [id], (err, results) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, results);
        })
    }
}

module.exports = User;