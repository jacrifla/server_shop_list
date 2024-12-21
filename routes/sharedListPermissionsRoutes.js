const express = require('express');
const sharedListPermissionsController = require('../controllers/sharedListPermissions');
const router = express.Router();

router.post('/add', sharedListPermissionsController.addPermission);
router.get('/:listId/:userId', sharedListPermissionsController.checkPermission);
router.put('/update', sharedListPermissionsController.updatePermissions);

module.exports = router;
