const ShoppingList = require('../models/shoppingList');

// Criar nova lista de compras
exports.createShoppingList = (req, res) => {
    const { userId, nameList } = req.body;
    ShoppingList.create({userId, nameList}, (err, shoppingList) => {
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
            shoppingList
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
            shoppingLists
        })
    })
}

// Buscar lista de compras por Usuario ID
exports.getListByUser = (req, res) => {
    const { userId } = req.params;
    console.log('USER ID: ', userId);

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