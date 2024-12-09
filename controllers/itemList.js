const ItemList = require('../models/ItemList');

exports.createItemList = (req, res) => {
    const { listId, name, quantity, observation } = req.body;

    if (!listId || !name) {
        return res.status(400).json({
            success: false,
            message: 'É necessário enviar o ID da lista de compras e o nome do item.'
        });
    }

    ItemList.create({ listId, name, quantity, observation }, (err, item) => {
        if (err) {
            console.error(`Erro ao inserir item na lista de compras: ${err.message}`);
            return res.status(500).json({
                success: false,
                message: 'Erro ao inserir item na lista de compras'
            });
        }
        res.status(201).json({
            success: true,
            message: 'Item criado com sucesso!',
            data: item
        });
    });
};
