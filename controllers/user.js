const User = require('../models/userModel');


// Buscar todos os usuários
exports.getAllUsers = (req, res) => {
    User.getAll((err, users) => {
        if(err) {
            console.error(`Erro ao buscar usuários: ${err.message}`);
            return res.status(500).json({
                success: false,
                message: 'Erro ao buscar usuários'
            });
        }
        res.json({
            success: true,
            message: 'Usuários buscados com sucesso!',
            data: users
        });
    })
};

// Buscar um usuário pelo e-mail
exports.getUserByEmail = (req, res) => {
    const {email} = req.body;
    
    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'E-mail é obrigatório'
        });
    }

    User.getByEmail(email, (err, user) => {
        if (err) {
            console.error(`Erro ao buscar usuário: ${err.message}`);
            return res.status(500).json({
                success: false,
                message: 'Erro ao buscar usuário'
            });
        }
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }
        res.json({
            success: true,
            message: 'Usuário buscado com sucesso!',
            data: user
        });
    }) 
};

// Buscar um usuário pelo ID
exports.getUserById = (req, res) => {
    const {id} = req.params;

    User.getById(id, (err, user) => {
        if (err) {
            console.error(`Erro ao buscar usuário: ${err.message}`);
            return res.status(500).json({
                success: false,
                message: 'Erro ao buscar usuário'
            });
        }
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }
        res.json({
            success: true,
            message: 'Usuário buscado com sucesso!',
            data: user
        });	
    })
};

// Atualizar um usuário
exports.updateUser = (req, res) => {
    const {id} = req.params;
    const {name, email} = req.body;

    if (!name ||!email) {
        return res.status(400).json({
            success: false,
            message: 'Nome e e-mail são obrigatórios'
        });
    }

    User.update(id, {name, email}, (err, user) => {
        if (err) {
            console.error(`Erro ao atualizar usuário: ${err.message}`);
            return res.status(500).json({
                success: false,
                message: 'Erro ao atualizar usuário'
            });
        }
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }
        res.json({
            success: true,
            message: 'Usuário atualizado com sucesso!',
        });
    })
}

// Deletar um usuário
exports.deleteUser = (req, res) => {
    const {id} = req.params;

    User.delete(id, (err) => {
        if (err) {
            console.error(`Erro ao deletar usuário: ${err.message}`);
            return res.status(500).json({
                success: false,
                message: 'Erro ao deletar usuário'
            });
        }
        res.json({
            success: true,
            message: 'Usuário deletado com sucesso!'
        });
    })
}

// Restaurar um usuário
exports.restoreUser = (req, res) => {
    const {id} = req.params;

    User.restore(id, (err) => {
        if (err) {
            console.error(`Erro ao restaurar usuário: ${err.message}`);
            return res.status(500).json({
                success: false,
                message: 'Erro ao restaurar usuário'
            });
        }
        res.json({
            success: true,
            message: 'Usuário restaurado com sucesso!'
        });
    })
}

// Buscar todas as mensagens de um usuário pelo ID
exports.getMessages = (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: 'ID do usuário é obrigatório'
        });
    }

    User.getMessages(userId, (err, messages) => {
        if (err) {
            console.error(`Erro ao buscar mensagens: ${err.message}`);
            return res.status(500).json({
                success: false,
                message: 'Erro ao buscar mensagens',
                error: err.message
            });
        }
        if (messages.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Nenhuma mensagem encontrada para este usuário'
            });
        }
        res.json({
            success: true,
            message: 'Mensagens buscadas com sucesso!',
            data: messages
        });
    });
};