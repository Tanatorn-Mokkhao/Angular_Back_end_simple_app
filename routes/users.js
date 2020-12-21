var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var moment = require('moment');
var User = require('../models/users');
var Jwt = require('../models/jwt');

router.post('/login', (req, res, next) => {
  let db = req.dbPool;
  let username = req.body.username;
  let password = req.body.password;

  if (username && password) {
    let encryptedPassword = crypto.createHash('md5').update(password).digest('hex');

    User.login(db, username, encryptedPassword).then(rows => {
      if (rows.length) {
        let userId = rows[0].id;
        let token = Jwt.sign({ userId: userId });
        res.send({ ok: true, token: token, userId: userId });
      } else {
        res.send({ ok: false, error: 'Invalid username or password!' });
      }
    }, error => {
      res.send({ ok: false, error: error });
    })
  } else {
    res.send({ ok: false, error: 'Incorrect data!' });
  }
});

router.post('/loginbyuser', (req, res, next) => {
  let db = req.dbPool;
  let username = req.body.username;
  if (username) {
    User.loginByUsername(db, username).then(rows => {
      if (rows.length) {
        let userId = rows[0].id;
        let token = Jwt.sign({ userId: userId });
        res.send({ ok: true, token: token, userId: userId });
      } else {
        res.send({ ok: false, error: 'Invalid username or password!' });
      }
    }, error => {
      res.send({ ok: false, error: error });
    })
  } else {
    res.send({ ok: false, error: 'Incorrect data!' });
  }
});

module.exports = router;
