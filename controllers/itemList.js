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

// Obter todos os itens de uma lista
exports.getItemsByList = (req, res) => {
    const { listId } = req.params;
    
    if (!listId) {
        return res.status(400).json({ 
            success: false,
            message: 'ID da lista de compras é obrigatório' 
        });
    }

    ItemList.getAllByList(listId, (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Erro ao obter itens',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Itens obtidos com sucesso!',
            data: results
        });        
    });
};

// Atualizar um item
exports.updateItem = (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    if (!updates || Object.keys(updates).length === 0) {
        return res.status(400).json({ 
            success: false,
            message: 'Pelo menos um campo deve ser fornecido' 
        });
    }

    ItemList.update(id, updates, (err, result) => {
        if (err) {
            return res.status(500).json({ 
                success: false,
                message: 'Erro ao atualizar item', error: err 
            });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Item não encontrado' 
            });
        }
        res.status(200).json({
            success: true,
            message: 'Item atualizado com sucesso' 
        });
    });
};

// Atualizar o campo check

exports.toggleCheck = (req, res) => {
    const { itemId } = req.body;

    ItemList.toggleCheck(itemId, (err, success) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Erro ao alternar o status do item'
            });
        }
        if (success) {
            return res.status(200).json({ 
                success: true,
                message: 'Status do item alternado com sucesso'
             });
        } else {
            return res.status(404).json({
                success: false,
                message: 'Item não encontrado' 
            });
        }
    });
};

// Deletar um item (soft delete)
exports.deleteItem = (req, res) => {
    const { id } = req.params;

    ItemList.delete(id, (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Erro ao deletar item', error: err 
            });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Item não encontrado' 
            });
        }
        res.status(200).json({
            success: true,
            message: 'Item deletado com sucesso' 
        });
    });
};
