const authRouter = require('./auth.route');
const chatRouter = require('./chat.route');
const homeRouter = require('./home.route');
const usersRouter = require('./users.route');
const userRouter = require('./user.route');

const authMiddleware = require('../middlewares/auth.middleware');

module.exports = (app) => {
    app.use('/auth', authRouter);

    app.use('/chat', authMiddleware.requireAuth, chatRouter);

    app.use('/users', authMiddleware.requireAuth, usersRouter);

    app.use('/user', authMiddleware.requireAuth, userRouter);

    app.use('/', authMiddleware.requireAuth, homeRouter);
}