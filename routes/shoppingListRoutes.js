const express = require('express');
const router = express.Router();
const shoppingListController = require('../controllers/shoppingList');

router.post('/create', shoppingListController.createList);
router.get('/all', shoppingListController.findAllLists);
router.get('/list-user/:userId', shoppingListController.findListByUserId);
router.delete('/delete/:listId', shoppingListController.deleteList);
router.get('/list-permission/:userId', shoppingListController.findListWithPermission);
router.put('/update/:listId', shoppingListController.updateList);

module.exports = router;