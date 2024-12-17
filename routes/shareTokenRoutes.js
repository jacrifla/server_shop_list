const express = require('express');
const router = express.Router();
const shareTokenController = require('../controllers/shareToken');

// Rota para criar um token
router.post('/tokens', shareTokenController.createToken);

// Rota para obter tokens de um determinado listId
router.get('/list/:listId', shareTokenController.getTokensByListId);

// Rota para deletar um token pelo seu id
router.delete('/tokens/:id', shareTokenController.deleteTokenById);

// Rota para aprovar ou rejeitar um token
router.put('/tokens/approve', shareTokenController.approveToken);

// Rota para obter tokens de um usuário
router.get('/tokens/:userId', shareTokenController.getTokensByUserId);

module.exports = router;
