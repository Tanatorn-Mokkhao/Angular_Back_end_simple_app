var express = require('express');
var router = express.Router();
var Parking = require('../models/parking');

// get all parking
router.get('/', (req, res, next) => {
  let dbPool = req.dbPool;

  Parking.list(dbPool).then((rows) => {
    let parkings = [];
    rows.forEach(p => {
      // convert binary to base64 image
      let photo = null;
      if (p.photo) {
        photo = 'data:image/jpeg;base64,' + new Buffer(p.photo, 'binary').toString('base64');
      }

      parkings.push({
        'id': p.id,
        'name': p.name,
        'description': p.description,
        'available': p.available,
        'distance': p.distance,
        'lat': p.lat,
        'lng': p.lng,
        'photo': photo,
        'shared_by': p.shared_by,
        'shared_phone': p.shared_phone,
        'shared_date': p.shared_date,
        'shared_photo': p.shared_photo,
      });
    });
    res.send({ ok: true, rows: parkings });
  }, (error) => {
    res.send({ ok: false, error: error });
  });
});


// search parking by query
router.get('/search/:query?', (req, res, next) => {
  let dbPool = req.dbPool;
  let query = req.params.query || '';

  Parking.search(dbPool, query).then((rows) => {
    let parkings = [];
    rows.forEach(p => {
      // convert binary to base64 image
      let photo = null;
      if (p.photo) {
        photo = 'data:image/jpeg;base64,' + new Buffer(p.photo, 'binary').toString('base64');
      }

      parkings.push({
        'id': p.id,
        'name': p.name,
        'description': p.description,
        'available': p.available,
        'distance': p.distance,
        'lat': p.lat,
        'lng': p.lng,
        'photo': photo,
        'shared_by': p.shared_by,
        'shared_phone': p.shared_phone,
        'shared_date': p.shared_date,
        'shared_photo': p.shared_photo,
      });
    });
    res.send({ ok: true, rows: parkings });
  }, (error) => {
    res.send({ ok: false, error: error });
  });
});

// get parking by id
router.get('/get/:id', (req, res, next) => {
  let dbPool = req.dbPool;
  let id = req.params.id;

  Parking.getParkingById(dbPool, id).then((rows) => {
    let parking = {};
    rows.forEach(p => {
      // convert binary to base64 image
      let photo = null;
      if (p.photo) {
        photo = 'data:image/jpeg;base64,' + new Buffer(p.photo, 'binary').toString('base64');
      }

      parking = {
        'id': p.id,
        'name': p.name,
        'description': p.description,
        'available': p.available,
        'distance': p.distance,
        'lat': p.lat,
        'lng': p.lng,
        'photo': photo,
        'shared_by': p.shared_by,
        'shared_phone': p.shared_phone,
        'shared_date': p.shared_date,
        'shared_photo': p.shared_photo,
      };
    });
    res.send({ ok: true, rows: parking });
  }, (error) => {
    res.send({ ok: false, error: error });
  });
});

// add new parking
router.post('/add', function (req, res, next) {
  let dbPool = req.dbPool;
  let name = req.body.name;
  let description = req.body.description || '';
  let available = req.body.available || 1;
  let lat = req.body.lat || 0;
  let lng = req.body.lng || 0;
  let photo = req.body.photo;
  let shared_by = req.body.shared_by || '';
  let shared_phone = req.body.shared_phone || '';
  let shared_photo = req.body.shared_photo || '';

  // convert base64 to binary
  let photoBinary = null;
  if (photo) {
    photo = photo.replace(/^data:image\/jpeg+;base64,/, "");
    photo = photo.replace(/ /g, '+');
    photoBinary = Buffer.from(photo, 'base64');
  }

  if (name) {
    Parking.add(dbPool, name, description, available, lat, lng, photoBinary, shared_by, shared_phone, shared_photo)
      .then(rows => {
        let parking = {
          'id': rows.insertId,
          'name': name,
          'description': description,
          'available': available,
          'lat': lat,
          'lng': lng,
          'photo': photo,
          'shared_by': shared_by,
          'shared_phone': shared_phone,
          'shared_photo': shared_photo,
        };
        res.send({ ok: true, parking: parking });
      }, (error) => {
        res.send({ ok: false, error: error });
      });
  } else {
    res.send({ ok: false, error: 'data incomplete!' });
  }
});
router.get('/listusers', (req, res, next) => {
  let dbPool = req.dbPool;

  Parking.listusers(dbPool).then((rows) => {
    let users = [];
    rows.forEach(p => {
      // convert binary to base64 image
      users.push({
        'id': p.id,
        'username': p.username,
        'fullname': p.fullname,
      })

    });
    res.send({ ok: true, rows: users });
  }, (error) => {
    res.send({ ok: false, error: error });
  });
});

router.get('/searchU/:query?', (req, res, next) => {
  let dbPool = req.dbPool;
  let query = req.params.query || '';

  Parking.searchUsers(dbPool, query).then((rows) => {
    let parkings = [];
    rows.forEach(p => {
      // convert binary to base64 image

      parkings.push({
        'id': p.id,
        'username': p.username,
        'fullname': p.fullname,
      });
    });
    res.send({ ok: true, rows: parkings });
  }, (error) => {
    res.send({ ok: false, error: error });
  });
});


router.post('/adduser', function (req, res, next) {
  let dbPool = req.dbPool;
  let username = req.body.username;
  let fullname = req.body.fullname;

  // convert base64 to binary
  if (username) {
    Parking.addUser(dbPool, username, fullname)
      .then(rows => {
        let parking = {
          'id': rows.insertId,
          'username': p.username,
          'fullname': p.fullname,
        };
        res.send({ ok: true, parking: parking });
      }, (error) => {
        res.send({ ok: false, error: error });
      });
  } else {
    res.send({ ok: false, error: 'data incomplete!' });
  }
});

module.exports = router;
