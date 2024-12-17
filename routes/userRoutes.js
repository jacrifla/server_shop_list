const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const userAuthController = require('../controllers/userAuth');

// Rotas de autenticação

// Criar um novo usuário
router.post('/auth/create', userAuthController.createUser);
// Login de usuário
router.post('/auth/login', userAuthController.loginUser); 
// Redefinir senha
router.post('/auth/reset-password', userAuthController.resetPassword);

// Rotas de gerenciamento de usuários

// Obter todos os usuários
router.get('/', userController.getAllUsers);
// Obter usuário por email
router.post('/email', userController.getUserByEmail);
// Obter usuário por ID
router.get('/:id', userController.getUserById);
// Atualizar informações de um usuário
router.put('/update/:id', userController.updateUser);
// Deletar um usuário
router.delete('/delete/:id', userController.deleteUser);
// Restaurar um usuário deletado
router.patch('/restore/:id', userController.restoreUser);
// Obter mensagens para o usuário	
router.get('/messeges/:id', userController.restoreUser);

module.exports = router;
