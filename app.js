require('dotenv').config();

var express = require('express'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  path = require('path'),
  mysql = require('mysql'),
  nunjucks = require('nunjucks');


var parking = require('./routes/parking');
var fcm = require('./routes/fcm');
var users = require('./routes/users');
var jwt = require('./models/jwt');


// initial app config
app = express();
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
nunjucks.configure('templates', {
  autoescape: true,
  express: app,
});


// enable CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


// create mysql poolable connection
let dbPool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});


// set character set to UTF-8
dbPool.on('connection', (connection) => {
  connection.query('SET NAMES utf8')
});


// set request to mysql pool
app.use((req, res, next) => {
  req.dbPool = dbPool;
  next();
});


// default home page
app.get('/', (req, res) => {
  res.send('Parking API Server Worked!');
});


// token middleware
let authToken = (req, res, next) => {
  if (req.method == 'OPTIONS') {
    next();
  } else {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (process.env.USE_TOKEN == 'true') {
      if (!token) {
        return res.status(403).send({
          ok: false,
          msg: 'No token provided.',
        });
      }

      jwt.verify(token).then(decoded => {
        console.log('Verify token passed!');
      }, err => {
        return res.status(403).send({
          ok: false,
          msg: 'Token is invalid!',
        });
      });
    }
    next();
  }
};


// set app routing
app.use('/parking', authToken, parking);
app.use('/fcm', fcm);
app.use('/users', users);


// server start
var port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Server is listening on port ' + port);
});


module.exports = app;
