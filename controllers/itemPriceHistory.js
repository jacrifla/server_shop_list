const ItemPriceHistory = require('../models/itemPriceHistoryModel');

exports.createItemPriceHistory = async (req, res) => {
    const {itemId, price, quantity, unit, barcode } = req.body;

    try {
        if (!itemId || !price || !quantity || !unit) {
            return res.status(400).json({
                success: false,
                message: 'Todos os campos são obrigatórios.',
            });
        };

        const itemPriceHistory = await ItemPriceHistory.create({
            itemId, price, quantity, unit, barcode
        });

        res.json({
            success: true,
            data: itemPriceHistory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.findAllItemPriceHistory = async (req, res) => {
    try {
        const itemsHistory = await ItemPriceHistory.findAll();
        res.json({
            success: true,
            data: itemsHistory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.findItemPriceHistoryByItemId = async (req, res) => {
    const { itemId } = req.params;
    try {
        const itemHistory = await ItemPriceHistory.findById({itemId});
        res.json({
            success: true,
            data: itemHistory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.updateItemPriceHistory = async (req, res) => {
    const { id } = req.params;
    const { price, quantity, unit } = req.body;

    try {
        if (!price || !quantity || !unit) {
            return res.status(400).json({
                success: false,
                message: 'Todos os campos são obrigatórios para atualização.',
            });
        };
        
        const updatedItem = await ItemPriceHistory.update({id, price, quantity, unit});

        if (!updatedItem) {
            res.status(404).json({
                success: false,
                message: 'Histórico de preços não encontrado',
            });
        };

        res.json({
            success: true,
            message: 'Histórico de preços atualizado com sucesso',
            data: updatedItem
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.deleteItemPriceHistory = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await ItemPriceHistory.delete({id});
        
        if (!deleted) {
            res.status(404).json({
                success: false,
                message: 'Histórico de preços não encontrado',
            });
        };
        
        res.json({
            success: true,
            message: 'Histórico de preços deletado com sucesso',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};