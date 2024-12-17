const express = require('express');
const router = express.Router();
const DirectShareController = require('../controllers/directShare');

// Rota para criar um compartilhamento direto
router.post('/', DirectShareController.create);

// Rota para buscar compartilhamentos diretos por ID da lista
router.get('/list/:listId', DirectShareController.getByListId);

// Rota para buscar compartilhamentos diretos por ID do usuário
router.get('/user/:userId', DirectShareController.getByUserId);

// Rota para deletar um compartilhamento direto por ID
router.delete('/:id', DirectShareController.deleteById);

module.exports = router;
