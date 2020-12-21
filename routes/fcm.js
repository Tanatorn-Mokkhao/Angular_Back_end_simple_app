var express = require('express');
var router = express.Router();
var FCM = require('fcm-node');
var fcm = new FCM(require('../privatekey.json'));
var User = require('../models/users');

// notification form
router.get('/', (req, res, next) => {
  res.render('notification.html');
});

// send to device directly
router.post('/send', (req, res, next) => {
  let device_token = req.body.device_token;
  let title = req.body.title;
  let msg = req.body.msg;

  console.log(device_token);


  var message = {
    'to': device_token,
    'notification': {
      'title': title,
      'body': msg,
    },
  };
  fcm.send(message, (err, resp) => {
    if (err) {
      res.send({ ok: false, err: err });
    } else {
      res.send({ ok: true });
    }
  });
});

// push by specific user id
router.post('/push', (req, res, next) => {
  let dbPool = req.dbPool;
  let title = req.body.title;
  let msg = req.body.msg;
  let is_accept = req.body.is_accept;
  let reg_devices = [];

  if (is_accept == 'on') {


    // send only accepted users
    User.getAllAcceptedUserWithDeviceToken(dbPool).then(rows => {

      rows.forEach(v => {
        reg_devices.push(v.device_token.trim());
      });

      var message = {
        'registration_ids': reg_devices,
        'notification': {
          'title': title,
          'body': msg,
        },
      };
      fcm.send(message, (err, resp) => {
        if (err) {
          console.log(err);
        }
      });

    });
  } else {
    // send all users
    User.getAllUserWithDeviceToken(dbPool).then(rows => {

      rows.forEach(v => {
        reg_devices.push(v.device_token.trim());
      });

      var message = {
        'registration_ids': reg_devices,
        'notification': {
          'title': title,
          'body': msg,
        },
      };
      fcm.send(message, (err, resp) => {
        if (err) {
          console.log(err);
        }
      });
    });
  }
  res.redirect('/fcm?sent=1');
});

// register device token
router.post('/registerdevice', function (req, res, next) {
  let dbPool = req.dbPool;
  let device_token = req.body.device_token;
  let user_id = req.body.user_id;
  let is_accept = req.body.is_accept;

  User.saveDeviceToken(dbPool, user_id, device_token, is_accept)
    .then(() => {
      res.send({ ok: true });
    }, (err) => {
      res.send({ ok: false, error: err });
    });
});

module.exports = router;
