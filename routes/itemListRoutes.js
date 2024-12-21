const express = require('express');
const router = express.Router();
const itemListController = require('../controllers/itemList');

router.post('/create', itemListController.createItemList);
router.get('/all-by-list/:listId', itemListController.findAllByList);
router.put('/toggle-check', itemListController.toggleCheck);
router.delete('/delete/:itemId', itemListController.deleteItem);
router.put('/update/:itemId', itemListController.updateItem);

module.exports = router;