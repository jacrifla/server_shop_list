const express = require('express');
const router = express.Router();
const itemListController = require('../controllers/itemList');

router.post('/create', itemListController.createItemList);

module.exports = router;