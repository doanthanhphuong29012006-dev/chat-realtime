// [GET]/chat
module.exports.index = (req, res) => {
    _io.on('connection', (socket) => {
        console.log('a user connected', socket.id);
    });

    res.render('pages/chat/index', {
        pageTitle: "Chat"
    });
}