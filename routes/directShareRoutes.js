const express = require('express');
const router = express.Router();
const DirectShareController = require('../controllers/directShare');

router.post('/create', DirectShareController.createDirectShare);
router.get('/:listId', DirectShareController.findListById);
router.get('/user/:userId', DirectShareController.findListByUserId);
router.delete('/:id', DirectShareController.deleteDirectShare);

module.exports = router;
