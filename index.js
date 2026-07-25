const express = require('express');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();
const { createServer } = require('node:http');
const { Server } = require('socket.io');
require('dotenv').config();
const port = process.env.PORT;

const database = require('./config/database.js');

database.connect();

// SocketIO
const server = createServer(app);
const io = new Server(server);
global._io = io;
// End SocketIO

app.use(methodOverride('_method'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded());

// parse application/json
app.use(bodyParser.json());

app.use(cookieParser('keyboard cat'));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));
app.use(flash());

const route = require('./routes/index.route.js');
const User = require('./models/user.model.js');

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static('./public'));

route(app);

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});