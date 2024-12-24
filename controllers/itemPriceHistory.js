const ItemPriceHistory = require('../models/itemPriceHistoryModel');

exports.createItemPriceHistory = async (req, res) => {
    const { itemId, price, quantity, unit, barcode } = req.body;

    try {
        // Verifica se o barcode é uma string vazia e o substitui por null
        const barcodeValue = barcode === "" ? null : barcode;

        // Verifica se todos os campos obrigatórios estão preenchidos
        if (!itemId || !price || !quantity || !unit) {
            return res.status(400).json({
                success: false,
                message: 'Todos os campos obrigatórios (itemId, price, quantity, unit) devem ser preenchidos.',
            });
        }

        // Criação do histórico de preço
        const itemPriceHistory = await ItemPriceHistory.create({
            itemId,
            price,
            quantity,
            unit,
            barcode: barcodeValue // Passa o valor ajustado para o banco
        });

        // Resposta de sucesso
        res.json({
            success: true,
            data: itemPriceHistory
        });
    } catch (error) {
        console.error('Erro ao criar histórico de preços:', error);
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

exports.findAllWithNameItem = async (req, res) => {
    try {
        const itemHistory = await ItemPriceHistory.findAllWithNameItem();
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