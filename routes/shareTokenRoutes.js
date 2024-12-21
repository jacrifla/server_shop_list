const express = require('express');
const router = express.Router();
const shareTokenController = require('../controllers/shareToken');

router.post('/create', shareTokenController.createToken);
router.get('/list/:listId', shareTokenController.findTokensByListId);
router.get('/tokens/:userId', shareTokenController.findTokensByUserId);
router.delete('/delete/:id', shareTokenController.deleteTokenById);
router.put('/tokens/approve', shareTokenController.approveToken);

module.exports = router;
