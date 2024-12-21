const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.get('/all', userController.findAllUsers);
router.post('/email', userController.findUserByEmail);
router.get('/:userId', userController.findById);
router.put('/update/:userId', userController.updateUser);
router.post('/create', userController.createUser);
router.delete('/delete/:userId', userController.deleteUser);
router.patch('/restore', userController.restoreUser);
router.get('/share-tokens/:userId', userController.findShareTokensForUser);
router.post('/login', userController.loginUser);
router.post('/reset', userController.resetPassword);

module.exports = router;
