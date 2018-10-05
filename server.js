var express    = require('express');
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

// Server
var port = 3300;
app.listen(port, function(){
    console.log('listening on port:' + port);
});