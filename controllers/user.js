const User = require('../models/userModel');
const { isValidEmail } = require('../utils/validation');

exports.createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        if (!name ||!email ||!password) {
            return res.status(400).json({
                success: false,
                message: 'Todos os campos são obrigatórios.'
            });
        };
        
        if (!isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Formato de e-mail inválido.',
            });
        };

        const userExists = await User.findByEmail({email});
        
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'E-mail já cadastrado.'
            });
        };

        const newUser = await User.create({name, email, password});

        res.json({
            success: true,
            message: 'Usuário criado com sucesso.',
            data: newUser
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

exports.findAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json({
            success: true,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

exports.findUserByEmail = async (req, res) => {
    try {
        const {email} = req.body;
        
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'E-mail é obrigatório'
            });
        };
        
        if (!isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Formato de e-mail inválido.',
            });
        }

        const user = await User.findByEmail({email});
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }
        
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

exports.findById = async (req, res) => {
    try {
        const {userId} = req.params;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'ID do usuário é obrigatório.'
            });
        };
        
        const user = await User.findById({userId});
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        };
        
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const {userId} = req.params;
        const { name, email } = req.body;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'ID do usuário é obrigatório.'
            });
        };

        if (!name && !email) {
            return res.status(400).json({
                success: false,
                message: 'Nome ou e-mail são obrigatórios para atualização.'
            });
        }

        if (email && !isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Formato de e-mail inválido.'
            });
        }
        const rowCount = await User.update({ userId, name, email });

        if (rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado ou já excluído.'
            });
        }

        res.json({
            success: true,
            message: 'Usuário atualizado com sucesso.'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao atualizar usuário'
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'ID do usuário é obrigatório.'
            });
        };

        const user = await User.delete({userId});
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado ou já excluído.'
            });
        };
        
        res.json({
            success: true,
            message: 'Usuário deletado com sucesso!'
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao deletar usuário'
        });
    }
};

exports.restoreUser = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'ID do usuário é obrigatório.'
            });
        };

        const user = await User.restore({email});
        
        if (user === 0) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado ou já restaurado.'
            });
        };
        
        res.json({
            success: true,
            message: 'Usuário restaurado com sucesso!'
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        
        if (!email ||!password) {
            return res.status(400).json({
                success: false,
                message: 'Todos os campos são obrigatórios'
            });
        };
        
        const { user, token } = await User.login({ email, password });
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'E-mail ou senha inválidos.'
            });
        }

        res.json({
            success: true,
            user,
            token,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Todos os campos são obrigatórios'
            });
        }

        const user = await User.resetPassword({ email, newPassword });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado.'
            });
        }

        res.json({
            success: true,
            message: 'Senha alterada com sucesso.'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


exports.findShareTokensForUser = (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'ID do usuário é obrigatório'
            });
        };

        const user = User.findShareTokensForUser({ userId });
        
        if (!user || user.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Nenhum token de compartilhamento encontrado para o usuário'
            });
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });    
    }
};