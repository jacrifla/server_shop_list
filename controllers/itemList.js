const ItemList = require('../models/itemListModel');
const ShoppingList = require('../models/shoppingListModel');

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
    const { listId } = req.query;

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
                message: err
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

exports.deleteListWithItems = async (req, res) => {
    const { listId } = req.params;

    try {
        // Passo 1: Obter os itens da lista
        const items = await new Promise((resolve, reject) => {
            ItemList.getAllByList(listId, (err, items) => {
                if (err) {
                    reject(new Error('Erro ao buscar itens da lista'));
                }
                resolve(items);
            });
        });

        // Passo 2: Deletar cada item da lista
        for (const item of items) {
            await new Promise((resolve, reject) => {
                ItemList.delete(item.id, (err, result) => {
                    if (err) {
                        reject(new Error(`Erro ao deletar item: ${err}`));
                    }
                    resolve(result);
                });
            });
        }

        // Passo 3: Deletar a lista de compras
        const result = await new Promise((resolve, reject) => {
            ShoppingList.deleteById(listId, (err, result) => {
                if (err) {
                    reject(new Error(`Erro ao deletar lista de compras: ${err}`));
                }
                if (result.affectedRows === 0) {
                    reject(new Error('Lista de compras não encontrada'));
                }
                resolve(result);
            });
        });

        // Enviar a resposta
        res.status(200).json({
            success: true,
            message: 'Lista de compras e todos os itens excluídos com sucesso!',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
