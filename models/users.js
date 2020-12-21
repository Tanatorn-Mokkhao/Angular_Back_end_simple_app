let Q = require('q');

module.exports = {
  //
  // user login
  //
  login(db, username, password) {
    let q = Q.defer();
    let sql = `select * from users where username=? and password=?`;

    db.getConnection((err, conn) => {
      if (err) {
        q.reject(err);
      } else {
        conn.query(sql, [username, password], (err, rows) => {
          if (err) q.reject(err);
          else q.resolve(rows);
        });
        conn.release();
      }
    });

    return q.promise;
  },
  //
  // login by user
  //
  loginByUsername(db, username) {
    let q = Q.defer();
    let sql = `select * from users where username=?`;

    db.getConnection((err, conn) => {
      if (err) {
        q.reject(err);
      } else {
        conn.query(sql, [username], (err, rows) => {
          if (err) q.reject(err);
          else q.resolve(rows);
        });
        conn.release();
      }
    });
    return q.promise;
  },

  //
  // save device token by user id
  //
  saveDeviceToken(db, userId, deviceToken, isAccept) {
    let q = Q.defer();
    let sql = `update users set device_token=?, is_accept=? where id=?`;
    db.getConnection((err, conn) => {
      if (err) {
        q.reject(err);
      } else {
        conn.query(sql, [deviceToken, isAccept, userId], (err) => {
          if (err) q.reject(err);
          else q.resolve();
        });
        conn.release();
      }
    });
    return q.promise;
  },
  //
  // get device token by user id
  //
  getDeviceToken(db, userId) {
    let q = Q.defer();

    db.getConnection((err, conn) => {
      if (err) {
        q.reject(err);
      } else {
        let sql = `select device_token from users where id=?`;
        conn.query(sql, [userId], (err, rows) => {
          if (err) q.reject(err);
          else q.resolve(rows);
        });
        conn.release();
      }
    });

    return q.promise;
  },
  //
  // get user by username
  //
  getUserByUsername(db, username) {
    let q = Q.defer();

    db.getConnection((err, conn) => {
      if (err) {
        q.reject(err);
      } else {
        let sql = `select * from users where username=?`;
        conn.query(sql, [username], (err, rows) => {
          if (err) q.reject(err);
          else q.resolve(rows);
        });
        conn.release();
      }
    });

    return q.promise;
  },
  //
  // get user by user id
  //
  getUserById(db, id) {
    let q = Q.defer();

    db.getConnection((err, conn) => {
      if (err) {
        q.reject(err);
      } else {
        let sql = `select * from users where id=?`;
        conn.query(sql, [id], (err, rows) => {
          if (err) q.reject(err);
          else q.resolve(rows);
        });
        conn.release();
      }
    });

    return q.promise;
  },
  //
  // get all users with device token
  //
  getAllUserWithDeviceToken(db) {
    let q = Q.defer();

    db.getConnection((err, conn) => {
      if (err) {
        q.reject(err);
      } else {
        let sql = `select * from users where device_token is not null order by username`;
        conn.query(sql, [], (err, rows) => {
          if (err) q.reject(err);
          else q.resolve(rows);
        });
        conn.release();
      }
    });

    return q.promise;
  },
  //
  // get all accepted users with device token
  //
  getAllAcceptedUserWithDeviceToken(db) {
    let q = Q.defer();

    db.getConnection((err, conn) => {
      if (err) {
        q.reject(err);
      } else {
        let sql = `select * from users where is_accept="Y" and device_token is not null order by username`;
        conn.query(sql, [], (err, rows) => {
          if (err) q.reject(err);
          else q.resolve(rows);
        });
        conn.release();
      }
    });

    return q.promise;
  }
};
