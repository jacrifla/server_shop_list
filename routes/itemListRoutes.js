const express = require('express');
const router = express.Router();
const itemListController = require('../controllers/itemList');

// Rota para criar um item
router.post('/create', itemListController.createItemList);

// Rota para obter todos os itens de uma lista
router.get('/items/:listId', itemListController.getItemsByList);

// Rota para atualizar um item
router.put('/update/:id', itemListController.updateItem);

// Rota para deletar um item (soft delete)
router.delete('/delete/:id', itemListController.deleteItem);

router.put('/toggle-check', itemListController.toggleCheck);

// Rota para deletar lista e os itens
router.delete('/delete-with-items/:listId', itemListController.deleteListWithItems);

module.exports = router;