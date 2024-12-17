const express = require('express');
const sharedListPermissionsController = require('../controllers/sharedListPermissions');
const router = express.Router();

// Adiciona permissão de edição para um usuário
router.post('/add', sharedListPermissionsController.addPermission);

// Verifica se um usuário pode editar a lista
router.get('/:listId/:userId', sharedListPermissionsController.checkPermission);

// Atualiza permissão de edição
router.put('/update', sharedListPermissionsController.updatePermissions);

module.exports = router;
