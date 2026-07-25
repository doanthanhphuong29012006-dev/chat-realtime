const authRouter = require('./auth.route');
const chatRouter = require('./chat.route');

const authMiddleware = require('../middlewares/auth.middleware');

module.exports = (app) => {
    app.use('/auth', authRouter);

    app.use('/chat', authMiddleware.requireAuth, chatRouter);
}