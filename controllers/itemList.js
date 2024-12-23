const ItemListModel = require('../models/itemListModel');

exports.createItemList = async (req, res) => {
    try {
        const { listId, name, observation, categoryId } = req.body;
        
        if (!listId || !name) {
            return res.status(400).json({
                success: false,
                message: 'É necessário enviar o ID da lista de compras e o nome do item.'
            });
        }

        const items = await ItemListModel.create({ listId, name, observation, categoryId });
        res.json({
            success: true,
            data: items
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Erro ao cadastrar item: ${error.message}`
        })
    }
};

exports.findAllByList = async (req, res) => {
    try {
        const { listId } = req.params;
        
        if (!listId) {
            return res.status(400).json({
                success: false,
                message: 'ID da lista de compras é obrigatório'
            });
        }
        const items = await ItemListModel.findAllByList({listId});
        
        res.json({
            success: true,
            data: items
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Erro ao buscar itens: ${error.message}`
        })
    }
};

exports.toggleCheck = async (req, res) => {
    try {
        const { itemId } = req.body;
        
        if (!itemId) {
            return res.status(400).json({
                success: false,
                message: 'ID do item é obrigatório'
            });
        }
        
        const item = await ItemListModel.toggleCheck({ itemId });
        res.json({
            success: true,
            data: item
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Erro ao alternar o status do item: ${error.message}`
        });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const { itemId } = req.params;

        if (!itemId) {
            return res.status(400).json({
                success: false,
                message: 'ID do item é obrigatório'
            })
        };

        const item = await ItemListModel.delete({itemId});
        res.json({
            success: true,
            message: 'Item excluído com sucesso'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Erro ao excluir item: ${error.message}`
        });
    }
};

exports.updateItem = async (req, res) => {
    try {
        const { name, observation, categoryId } = req.body;
        const { itemId } = req.params;
        
        if (!itemId) {
            return res.status(400).json({
                success: false,
                message: 'ID do item é obrigatório'
            });
        }

        const item = await ItemListModel.update({name, observation, categoryId, itemId});
        
        res.json({
            success: true,
            data: item
        });        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Erro ao atualizar item: ${error.message}`
        })
    }
};
