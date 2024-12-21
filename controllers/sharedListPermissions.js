const SharedListPermissionsModel = require('../models/sharedListPermissionModel');

exports.addPermission = async (req, res) => {
  try {
    const { listId, userId, canEdit } = req.body;
    
    if (!listId ||!userId ||!canEdit) {
      res.status(400).json({
        success: false,
        message: 'Todos os parâmetros são obrigatórios.',
      });
    };
    
    const permissions = await SharedListPermissionsModel.addPermission({listId, userId, canEdit});

    res.json({
      success: true,
      message: 'Permissão adicionada com sucesso',
      data: permissions
    })
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Erro ao adicionar permissão: ${err.message}`,
    });
  }
};

exports.checkPermission = async (req, res) => {
  try {
    const { listId, userId } = req.params;
    
    if (!listId ||!userId) {
      res.status(400).json({
        success: false,
        message: 'Todos os parâmetros são obrigatórios.',
      });
    };

    const permission = await SharedListPermissionsModel.checkPermission({listId, userId});
    
    if (!permission) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não possui permissão para esta lista.',
      });
    };
    
    res.json({
      success: true,
      data: permission
    });    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Erro ao verificar permissões: ${error.message}`,
    });
  }
};

exports.updatePermissions = async (req, res) => {
  try {
    const { listId, userId, canEdit } = req.body;
    
    if (!listId ||!userId ||!canEdit) {
      res.status(400).json({
        success: false,
        message: 'Todos os parâmetros são obrigatórios.',
      });
    };

    const permission = await SharedListPermissionsModel.updatePermissions({listId, userId, canEdit});
    
    if (!permission) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não possui permissão para esta lista.',
      });
    };

    res.json({
      success: true,
      message: 'Permissões atualizadas com sucesso',
      data: permission
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Erro ao atualizar permissões: ${error.message}`,
    });
  }
};
