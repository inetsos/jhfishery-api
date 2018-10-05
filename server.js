var express    = require('express');
var vhost = require('vhost');

var app        = express();

var mongoose   = require('mongoose');
var bodyParser = require('body-parser');

// Database
console.log(process.env.MONGO_DB);
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_DB, { useCreateIndex: true, useNewUrlParser: true} );
var db = mongoose.connection;
db.once('open', function () {
    console.log('DB connected!');
});
db.on('error', function (err) {
    console.log('DB ERROR:', err);
});

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, content-type, x-access-token');
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

// API
app.use('/api/users', require('./api/users'));
app.use('/api/auth', require('./api/auth'));
app.use('/api/upload', require('./api/upload'));  
app.use('/api/invoices', require('./api/invoices'));
app.use('/api/sellers', require('./api/sellers'));
app.use('/api/unstorings', require('./api/unstorings'));

app.use('/', (req, res) => {
    res.statusCode = 200; // 통신 성공
    res.setHeader('Content-Type', 'text/plain;charset=UTF-8');
    res.end('2019. 새로운 시작 \n\nWON soft?\n');
});

var hostname = 'jhfishery-api.ebizpia.co.kr'; // 서버 컴퓨터의 ip
var port = 3300; //

var server = express();
server.use(vhost(hostname, app));

// Server
//var port = 3300;
server.listen(port, function(){
    console.log(`Server running at http://${hostname}:${port}/`);
});