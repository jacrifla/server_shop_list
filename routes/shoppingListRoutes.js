const express = require('express');
const router = express.Router();
const shoppingListController = require('../controllers/shoppingList');

router.post('/create', shoppingListController.createShoppingList);
router.get('/all', shoppingListController.getAllShoppingLists);
router.get('/list-user/:userId', shoppingListController.getListByUser);
router.delete('/delete/:id', shoppingListController.deleteShoppingList);
router.get('/list-permission/:userId', shoppingListController.getListWithPermission)

module.exports = router;