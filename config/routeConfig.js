const userRoutes = require('../routes/userRoutes');
const shoppingListRoutes = require('../routes/shoppingListRoutes');
const itemListRoutes = require('../routes/itemListRoutes');
const directShareRoutes = require('../routes/directShareRoutes');
const shareTokenRoutes = require('../routes/shareTokenRoutes');
const sharedListPermissionsRoutes = require('../routes/sharedListPermissionsRoutes');
const categoryRoutes = require('../routes/categoryRoutes');

module.exports = (app) => {
    app.use('/users', userRoutes);
    app.use('/shopping-list', shoppingListRoutes);
    app.use('/item-list', itemListRoutes);
    app.use('/shared-list', sharedListPermissionsRoutes);
    app.use('/direct-shares', directShareRoutes);
    app.use('/share-tokens', shareTokenRoutes);
    app.use('/category', categoryRoutes)
};