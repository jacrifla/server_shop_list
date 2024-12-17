const DirectShare = require('../models/directShare');

class DirectShareController {
    // Criar um novo compartilhamento direto
    static create(req, res) {
        const { listId, sharedWithUserId, permission } = req.body;
    
        // Verificar se todos os campos obrigatórios estão presentes
        if (!listId || !sharedWithUserId) {
            return res.status(400).json({
                success: false,
                message: 'listId e sharedWithUserId são obrigatórios'
            });
        }
    
        // Verificar se o 'permission' é válido (pode ser 'view' ou 'edit')
        if (permission && !['view', 'edit'].includes(permission)) {
            return res.status(400).json({
                success: false,
                message: 'Permission deve ser "view" ou "edit"'
            });
        }
    
        // Definir valor padrão para 'permission' se não for fornecido
        const finalPermission = permission || 'view';
    
        // Criar a entrada na tabela 'direct_shares'
        DirectShare.create({ listId, sharedWithUserId, permission: finalPermission }, (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }
    
            res.status(201).json({
                success: true,
                message: 'Compartilhamento criado com sucesso',
                data: result
            });
        });
    }
    

    // Buscar compartilhamentos diretos por ID da lista
    static getByListId(req, res) {
        const { listId } = req.params;

        DirectShare.getByListId(listId, (err, results) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: 'Nenhum compartilhamento encontrado' });
            }
            res.status(200).json({ data: results });
        });
    }

    // Buscar compartilhamentos diretos por ID do usuário
    static getByUserId(req, res) {
        const { userId } = req.params;

        DirectShare.getByUserId(userId, (err, results) => {
            if (err) {
                return res.status(500).json({ 
                    success: false,
                    message: err.message
                });
            }
            if (results.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Nenhum compartilhamento encontrado'
                });
            }
            res.status(200).json({
                success: true,
                message: 'Compartilhamentos encontrados', 
                data: results
            });
        });
    }

    // Deletar um compartilhamento direto por ID
    static deleteById(req, res) {
        const { id } = req.params;

        DirectShare.deleteById(id, (err, affectedRows) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }
            if (affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Nenhum compartilhamento encontrado' 
                });
            }
            res.status(200).json({
                success: true,
                message: 'Compartilhamento deletado com sucesso' 
            });
        });
    }
}

module.exports = DirectShareController;
