const ShareToken = require('../models/shareTokenModel');

exports.createToken = async (req, res) => {
    try {
        const { listId, userId } = req.body;

        if (!listId ||!userId) {
            return res.status(400).json({
                success: false,
                message: 'Os ID da lista e o ID do usuário são obrigatórios.',
            });
        };

        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 12);
        

        const token = await ShareToken.create({listId, userId, expiresAt});
        
        res.json({
            success: true,
            data: token,
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.findTokensByListId = async (req, res) => {
    try {
        const { listId } = req.params;
        
        if (!listId) {
            return res.status(400).json({
                success: false,
                message: 'ID da lista é obrigatório.',
            });
        };

        const token = await ShareToken.findByListId({listId});
        res.json({
            success: true,
            data: token,
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.findTokensByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'ID do usuário é obrigatório.',
            });
        }
        
    const tokens = await ShareToken.findTokensByUserId({userId});
        
        res.json({
            success: true,
            data: tokens,
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.deleteTokenById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'ID do token é obrigatório.',
            });
        };

        const token = await ShareToken.deleteTokenById({id});
        
        if (!token) {
            return res.status(404).json({
                success: false,
                message: 'Token não encontrado',
            });
        };

        res.json({
            success: true,
            message: 'Token deletado com sucesso!',
        });        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.approveToken = async (req, res) => {
    
    try {
        const { token, approved } = req.body;
        const isValid = await ShareToken.verifyShareToken({token});

        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: 'Token inválido ou expirado',
            });
        };

        const status = approved ? 'approved' : 'rejected';
        const updated = await ShareToken.updateStatus({ token, status });
        
        if (!updated) {
            return res.status(400).json({
                success: false,
                message: 'Token não encontrado',
            });
        };
        
        res.json({
            success: true,
            message: `Token ${approved ? 'aprovado' : 'rejeitado'} com sucesso`,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
