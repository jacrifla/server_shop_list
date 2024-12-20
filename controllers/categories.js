const CategoriesModel = require('../models/categories');
exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: 'Nome e descrição são obrigatórios'
            });
        }

        const category = await CategoriesModel.create({name, description});
        res.json({
            success: true,
            data: category
        });        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Erro ao inserir categoria: ${error.message}`
        })
    }
};

exports.findAllCategory = async (req, res) => {
    try {
        const categories = await CategoriesModel.findAll();
        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Erro ao buscar categorias: ${error.message}`
        })
    }
};

exports.findById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await CategoriesModel.findById(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Categoria não encontrada'
            });
        }
        res.json({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Erro ao buscar categoria: ${error.message}`
        })
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const rowCount  = await CategoriesModel.delete(id);
        if (rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Categoria não encontrada'
            });
        }
        res.json({
            success: true,
            message: 'Categoria excluída com sucesso'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Erro ao excluir categoria: ${error.message}`
        })
    }
};