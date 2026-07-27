const authRouter = require('./auth.route');
const chatRouter = require('./chat.route');
const homeRouter = require('./home.route');

const authMiddleware = require('../middlewares/auth.middleware');

module.exports = (app) => {
    app.use('/', authMiddleware.requireAuth, homeRouter);

    app.use('/auth', authRouter);

    app.use('/chat', authMiddleware.requireAuth, chatRouter);
}