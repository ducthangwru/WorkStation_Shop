const path = require("path");
const moment = require('moment');
const express = require("express");
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const session = require('express-session');
const utils = require('./utils/Utils');
require('console-stamp')(console, 'dd-mm-yyyy HH:MM:ss :');

const PORT = 8866;
let app = express();
let server = require('http').Server(app);

server.listen(PORT , () => {
    console.log(`App listen on ${PORT}`);
  })

app.use(bodyParser.json());       
app.use(bodyParser.urlencoded({   
    extended: true
}));
app.use(bodyParser.json({ extended : true}));
app.use(bodyParser.urlencoded({ extended : true}));

app.use(session({
    secret: '@WorkStation!&^^Shop*&',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false},
    name: "FamInbox"
}));

// xu ly khi ma vao link chua dang nhap
app.use(function (req, res, next) {
    req.headers['if-none-match'] = '';
    req.headers['if-modified-since'] = '';
    if (!req.session.token && req.url !== '/' 
        // && req.url.indexOf("_Web") !== -1
        // && req.url.indexOf("_Mess") !== -1
        // && req.url.indexOf("_Stat") !== -1
        // && req.url.indexOf("_Tool") !== -1
        // && req.url.indexOf("_Acc") !== -1
        && req.url !== '/verify' 
        && req.url !== '/login' 
        && req.url !== '/signup' 
        && req.url.indexOf(".") === -1 
        && req.url.indexOf("/api/") === -1) {
        res.redirect(307, '/')
    } else {
        next();
    }
});

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));

const publicController = require('./api/PublicController')

app.use('/api', publicController);

app.get('/', function (req, res, next) {
    res.render('home');
});


app.get('/html/:file', function (req, res, next) {
    res.sendFile(path.resolve(req.app.get('views') + "/" + req.params.file + ".handlebars"))
});
