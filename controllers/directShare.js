const DirectShare = require('../models/directShareModel');

exports.createDirectShare = async (req, res) => {
    try {
        const { listId, sharedWithUserId, permission } = req.body;
    if (!listId || !sharedWithUserId) {
        return res.status(400).json({
            success: false,
            message: 'É necessário enviar o ID da lista de compras e o ID do usuário que será compartilhado.'
        });
    };
    if (permission &&!['view', 'edit'].includes(permission)) {
        return res.status(400).json({
            success: false,
            message: 'Permission deve ser "view" ou "edit"'
        });
    };
    const finalPermission = permission || 'view';
    const share = DirectShare.create({listId, sharedWithUserId, finalPermission});
    res.json({
        success: true,
        message: 'Compartilhamento criado com sucesso',
        data: share
    });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

exports.findListById = async (req, res) => {
    try {
        const { listId } = req.params;
        const directShares = await DirectShare.findListById({listId});
        if (directShares.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Nenhum compartilhamento encontrado'
            });
        };
        res.json({
            success: true,
            data: directShares
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
};

exports.findListByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const directShares = await DirectShare.findListByUserId({userId});
        if (directShares.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Nenhum compartilhamento encontrado'
            });
        };
        res.json({
            success: true,
            data: directShares
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
};

exports.deleteDirectShare = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRows = await DirectShare.delete({id});
        if (deletedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Nenhum compartilhamento encontrado'
            });
        };
        res.json({
            success: true,
            message: 'Compartilhamento deletado com sucesso'
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
};