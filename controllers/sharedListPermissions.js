const sharedListPermissionsModel = require('../models/sharedListPermissionModel');

exports.addPermission = (req, res) => {
  const { listId, userId, canEdit } = req.body;

  sharedListPermissionsModel.addPermission(listId, userId, canEdit, (err, permissions) => {
    if (err) {
      console.error(`Erro ao adicionar permissão para listId=${listId} e userId=${userId}:`, err.message);
      return res.status(500).json({
        success: false,
        message: `Erro ao adicionar permissão: ${err.message}`,
      });
    }
    res.status(200).json({
      success: true,
      message: 'Permissão adicionada com sucesso',
      permissions
    });
  });
};


exports.checkPermission = (req, res) => {
  const { listId, userId } = req.params;
  sharedListPermissionsModel.checkPermission(listId, userId, (err, permissions) => {
    if (err) {
      console.error(`Erro ao verificar permissões para listId=${listId} e userId=${userId}:`, err.message);
      return res.status(500).json({
        success: false,
        message: `Erro ao verificar permissões: ${err.message}`,
      });
    }
    res.status(200).json({ 
      success: true,
      message: 'Permissões verificadas com sucesso',
      data: permissions
    });
  });
};

// Atualiza a permissão de edição de um usuário
exports.updatePermissions = (req, res) => {
  const { listId, userId, canEdit } = req.body;
  sharedListPermissionsModel.updatePermissions(canEdit, listId, userId, (err, permissions) => {
    if (err) {
      console.error(`Erro ao atualizar permissões para listId=${listId} e userId=${userId}:`, err.message);
      return res.status(500).json({
        success: false,
        message: `Erro ao atualizar permissões: ${err.message}`,
      });
    }
    res.status(200).json({
      success: true,
      message: 'Permissões atualizadas com sucesso',
      data: permissions
    });
  })
};
