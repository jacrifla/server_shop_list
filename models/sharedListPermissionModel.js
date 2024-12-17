const connection = require('../config/db');

const SharedListPermission = {
  // Função para adicionar permissão para um usuário
  addPermission: (listId, userId, canEdit, callback) => {
    const query = `
      INSERT INTO shared_list_permissions (list_id, user_id, can_edit) 
      VALUES ($1, $2, $3) 
      RETURNING id, list_id, user_id, can_edit;
    `;
    
    connection.query(query, [listId, userId, canEdit], (err, result) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, result.rows[0]);
    });
  },

  // Função para verificar permissão de edição
  checkPermission: (listId, userId, callback) => {
    const query = `
      SELECT can_edit 
      FROM shared_list_permissions
      WHERE list_id = $1 AND user_id = $2;
    `;
    
    connection.query(query, [listId, userId], (err, result) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, result.rows[0] || null);
    });
  },
  
  // Função para atualizar a permissão de edição
  updatePermissions: (listId, userId, canEdit, callback) => {
    const query = `
      UPDATE shared_list_permissions 
      SET can_edit = $1 
      WHERE list_id = $2 AND user_id = $3 
      RETURNING list_id, user_id, can_edit;
    `;

    connection.query(query, [canEdit, listId, userId], (err, result) => {
      if (err) {
        return callback(err, null);
      }
      if (result.rows.length === 0) {
        return callback(new Error('Nenhuma permissão encontrada para atualizar.'), null);
      }
      callback(null, result.rows[0]);
    });
  },
};

module.exports = SharedListPermission;
