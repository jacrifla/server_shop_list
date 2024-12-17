const ShoppingList = require('../models/ShoppingList');

// Criar nova lista de compras
exports.createShoppingList = (req, res) => {
    const { userId, name } = req.body;
    ShoppingList.create({userId, name}, (err, shoppingList) => {
        if (err) {
            console.error(`Erro ao inserir lista de compras: ${err.message}`);
            return res.status(500).json({
                success: false,
                message: 'Erro ao criar lista de compras'
            });
        }
        res.status(201).json({
            success: true,
            message: 'Lista de compras criada com sucesso!',
            data: shoppingList
        });
    })
}

// Buscar todas as listas de compras
exports.getAllShoppingLists = (req, res) => {
    ShoppingList.getAll((err, shoppingLists) => {
        if (err) {
            console.error('Erro ao buscar listas: ', err.message);
            return res.status(500).json({
                success: false,
                message: 'Erro ao buscar listas de compras'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Listas de compras buscadas com sucesso!',
            data: shoppingLists
        })
    })
}

// Buscar lista de compras por Usuario ID
exports.getListByUser = (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json({
            success: false,
            message: 'O parâmetro userId é obrigatório.',
        });
    }    
    
    ShoppingList.getListByUserId(userId, (err, shoppingList) => {
        if (err) {
            console.error(`Erro ao buscar lista: ${err.message}`);
            return res.status(500).json({
                success: false,
                message: 'Erro ao buscar lista de compras'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Lista de compras buscada com sucesso!',
            data: shoppingList
        });
    });
};

// deletar lista de compras
exports.deleteShoppingList = (req, res) => {
    const {id} = req.params;
    ShoppingList.deleteById(id, (err) =>{
        if (err) {
            console.error(`Erro ao deletar lista: ${err.message}`);
            return res.status(500).json({
                success: false,
                message: 'Erro ao deletar lista de compras'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Lista de compras excluída com sucesso!',
        });
    })
};

exports.shareShoppingList = (req, res) => {
    const { listId, userId } = req.body;

    if (!listId || !userId) {
        return res.status(400).json({
            success: false,
            message: 'Os parâmetros listId e userId são obrigatórios.',
        });
    }

    ShoppingList.shareList({ listId, userId }, (err, sharedList) => {
        if (err) {
            console.error(`Erro ao compartilhar lista: ${err.message}`);
            return res.status(500).json({
                success: false,
                message: 'Erro ao compartilhar a lista de compras',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Lista de compras compartilhada com sucesso!',
            data: sharedList,
        });
    });
};

exports.getListWithPermission = (req, res) => {
    const { userId } = req.params;
    
    if (!userId) {
        console.error('userId não fornecido!');
        return res.status(400).json({
            success: false,
            message: 'userId é obrigatório.',
        });
    }
    
    ShoppingList.getListWithPermission(userId, (err, list) => {
        if (err) {
            console.error(`Erro ao buscar lista com permissão: ${err.message}`);
            return res.status(500).json({
                success: false,
                message: 'Erro ao buscar lista com permissão',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Lista de compras buscada com permissão com sucesso!',
            data: list,
        });
    });
};
