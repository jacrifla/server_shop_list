const ShoppingList = require('../models/shoppingListModel');

// Criar nova lista de compras
exports.createList = async (req, res) => {
    try {
        const { userId, name } = req.body;
        if (!userId ||!name) {
            return res.status(400).json({
                success: false,
                message: 'É necessário enviar o ID do usuário e o nome da lista de compras.'
            });
        };
        const list = await ShoppingList.create({userId, name});
        res.json({
            success: true,
            message: 'Lista de compras criada com sucesso!',
            data: list
        });        
    } catch (error) {
        res.status(500).json({
            sucess: false,
            message: `Erro ao cadastrar lista: ${error.message}`
        })
    }
};

// Buscar todas as listas de compras
exports.findAllLists = async (req, res) => {
    try {
        const list = await ShoppingList.findAll();
        res.json({
            success: true,
            data: list
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Erro ao buscar listas: ${error.message}`
        })
    }
};

exports.findListByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'O userId é obrigatório.',
            });
        };
        const list = await ShoppingList.findListByUserId({userId});
        res.json({
            success: true,
            data: list
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Erro ao buscar lista: ${error.message}`
        });
    }
};

exports.deleteList = async (req, res) => {
    try {
        const { listId } = req.params;
        const rowCount = await ShoppingList.delete({listId});
        if (rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Lista não encontrada.',
            });
        };
        res.json({
            success: true,
            message: 'Lista de compras excluída com sucesso!',
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Erro ao excluir lista: ${error.message}`
        })
    }
};

exports.findListWithPermission = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'ID do usuário é obrigatório.',
            });
        };
        const list = await ShoppingList.findListWithPermission({userId});
        res.json({
            success: true,
            data: list,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Erro ao buscar lista com permissão: ${error.message}`
        })
    }
}

exports.updateList = async (req, res) => {
    try {
        const { name } = req.body;
        const { listId } = req.params;
        const list = await ShoppingList.update({name, listId});
        if (list === 0) {
            return res.status(404).json({
                success: false,
                message: 'Lista não encontrada.',
            });
        }
        res.json({
            success: true,
            message: 'Nome da lista de compras atualizado com sucesso!',
            data: list
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Erro ao atualizar lista: ${error.message}`
        })
    }
};