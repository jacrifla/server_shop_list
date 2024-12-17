const connection = require('../config/db');

const SharedListPermission = {
  // Função para adicionar permissão para um usuário
  addPermission: (listId, userId, canEdit, callback) => {
    const query = 'INSERT INTO shared_list_permissions (list_id, user_id, can_edit) VALUES (?, ?, ?)';
    
    connection.query(query, [listId, userId, canEdit], (err, result) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, { id: result.insertId, listId, userId, canEdit });
    });
  },

  checkPermission: (listId, userId, callback) => {
    const query = `
      SELECT can_edit FROM shared_list_permissions
      WHERE list_id = ? AND user_id =?
    `;
    
    connection.query(query, [listId, userId], (err, result) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, result[0]);
    });
  },
  
  // Função para atualizar a permissão de edição
  updatePermissions: (listId, userId, canEdit, callback) => {
    const query = 'UPDATE shared_list_permissions SET can_edit = ? WHERE list_id = ? AND user_id = ?';

    connection.query(query, [canEdit, listId, userId], (err, result) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, {listId, userId, canEdit});
    })
  },
}

module.exports = SharedListPermission;