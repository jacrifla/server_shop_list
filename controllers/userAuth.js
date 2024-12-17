const UserAuth = require('../models/userAuthModel');

// Criar um novo usuário
exports.createUser = (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Todos os campos são obrigatórios'
        });
    }

    UserAuth.create({name, email, password}, (err, user) => {
        if (err) {
            console.error(`Erro ao criar usuário: ${err.message}`);
            return res.status(500).json({
                success: false,
                message: `Erro ao criar usuário. ${err.message}`
            });
        }
        res.status(201).json({
            success: true,
            message: 'Usuário criado com sucesso!',
            data: user
        });
    });
}

exports.loginUser = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Todos os campos são obrigatórios'
        });
    };

    UserAuth.login(email, password, (err, user) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Erro ao tentar fazer login'
            });
        }
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email ou senha inválidos'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Login realizado com sucesso!',
            data: user
        });
    })
}

exports.resetPassword = (req, res) => {
    const { email, newPassword } = req.body;
    
    if (!email || !newPassword) {
        return res.status(400).json({
            success: false,
            message: 'Email e nova senha são obrigatórios'
        });
    }

    UserAuth.resetPassword(email, newPassword, (err, result) => {
        if (err) {
            console.error(`Erro ao resetar senha: ${err.message}`);
            return res.status(500).json({
                success: false,
                message: 'Erro ao resetar senha'
            });
        }
        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }
        res.status(200).json({
            success: true,
            message: result.message
        });
    });
};
