const express = require('express');
const itemPriceHistoryController = require('../controllers/itemPriceHistory');
const router = express.Router();

router.post('/create', itemPriceHistoryController.createItemPriceHistory);
router.get('/all', itemPriceHistoryController.findAllItemPriceHistory);
router.get('/:itemId', itemPriceHistoryController.findItemPriceHistoryByItemId);
router.put('/update/:id', itemPriceHistoryController.updateItemPriceHistory);
router.delete('/delete/:id', itemPriceHistoryController.deleteItemPriceHistory);

module.exports = router;