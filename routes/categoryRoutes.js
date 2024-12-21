const express = require('express');
const categoryController = require('../controllers/categories');
const router = express.Router();

router.post('/create', categoryController.createCategory);
router.get('/all', categoryController.findAllCategory);
router.get('/:id', categoryController.findById);
router.delete('/delete/:id', categoryController.deleteCategory);

module.exports = router;