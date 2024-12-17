const ShareToken = require('../models/shareToken');

exports.createToken = (req, res) => {
    const { listId, userId } = req.body; 
    
    // Definir o tempo de expiração para 24 horas a partir da criação do token
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Expira em 24 horas

    ShareToken.create({ listId, userId, expiresAt }, (err, newToken) => {
        if (err) {
            console.error(`Erro ao criar token: ${err.message}`);
            return res.status(500).json({
                success: false,
                message: 'Erro ao criar token',
            });
        }

        res.json({
            success: true,
            message: 'Token criado com sucesso!',
            data: newToken,
        });
    });
};


exports.getTokensByListId = (req, res) => {
    const { listId } = req.params;

    ShareToken.getByListId(listId, (err, tokens) => {
        if (err) {
            console.error(`Erro ao buscar tokens: ${err.message}`);
            return res.status(500).json({
                success: false,
                message: 'Erro ao buscar tokens',
            });
        }

        res.json({
            success: true,
            data: tokens,
        });
    });
};

exports.deleteTokenById = (req, res) => {
    const { id } = req.params;

    ShareToken.deleteTokenById(id, (err, affectedRows) => {
        if (err) {
            console.error(`Erro ao deletar token: ${err.message}`);
            return res.status(500).json({
                success: false,
                message: 'Erro ao deletar token',
            });
        }

        if (affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Token não encontrado',
            });
        }

        res.json({
            success: true,
            message: 'Token deletado com sucesso!',
        });
    });
};

exports.approveToken = (req, res) => {
    const { token, approved } = req.body;

    // Verifica se o token é válido
    ShareToken.verifyShareToken(token, (err, result) => {
        if (err) {
            console.error(`Erro ao verificar token: ${err.message}`);
            return res.status(500).json({
                success: false,
                message: 'Erro ao verificar token',
            });
        }

        if (!result.valid) {
            // Token não é válido ou expirado
            return res.status(404).json({
                success: false,
                message: result.message,  // Mensagem explicativa do erro
            });
        }

        // Define o status baseado no valor de 'approved'
        const status = approved ? 'approved' : 'rejected';

        ShareToken.updateStatus(token, status, (updateErr, updated) => {
            if (updateErr) {
                console.error(`Erro ao atualizar o status do token: ${updateErr.message}`);
                return res.status(500).json({
                    success: false,
                    message: 'Erro ao atualizar o status do token',
                });
            }

            if (!updated) {
                return res.status(400).json({
                    success: false,
                    message: 'Falha ao atualizar o status do token',
                });
            }

            // Envia a resposta ao cliente com o status traduzido
            res.json({
                success: true,
                message: `Token ${approved ? 'aprovado' : 'rejeitado'} com sucesso!`,
            });
        });
    });
};

// Obter tokens de um usuário
exports.getTokensByUserId = (req, res) => {
    const { userId } = req.params;

    ShareToken.getTokensByUserId(userId, (err, tokens) => {
        if (err) {
            console.error(`Erro ao buscar tokens: ${err.message}`);
            return res.status(500).json({
                success: false,
                message: 'Erro ao buscar tokens',
            });
        }

        res.json({
            success: true,
            data: tokens,
        });
    });
};

