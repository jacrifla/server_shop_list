const connection = require('../config/db');

const SharedListPermission = {
  addPermission: async ({listId, userId, canEdit}) => {
    const query = `
      INSERT INTO shared_list_permissions (list_id, user_id, can_edit) 
      VALUES ($1, $2, $3) 
      RETURNING id, list_id, user_id, can_edit;
    `;
    
    const values = [listId, userId, canEdit];
    const result = await connection.query(query, values);
    return result.rows[0];
  },

  checkPermission: async ({listId, userId}) => {
    const query = `
      SELECT can_edit 
      FROM shared_list_permissions
      WHERE list_id = $1 AND user_id = $2;
    `;
    
    const values = [listId, userId];
    const result = await connection.query(query, values);
    return result.rows[0]? result.rows[0].can_edit : false;
  },
  
  updatePermissions: async ({listId, userId, canEdit}) => {
    const query = `
      UPDATE shared_list_permissions 
      SET can_edit = $1 
      WHERE list_id = $2 AND user_id = $3 
      RETURNING list_id, user_id, can_edit;
    `;
    
    const values = [canEdit, listId, userId];
    const result = await connection.query(query, values);
    return result.rows[0];
  },
};

module.exports = SharedListPermission;
