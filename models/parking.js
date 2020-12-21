let Q = require('q');

module.exports = {
  //
  // get the parking list
  //
  list(db) {
    let q = Q.defer();
    let sql = `select * from parking order by name`;

    db.getConnection(function (err, conn) {
      if (err) {
        q.reject(err);
      } else {
        conn.query(sql, [], function (err, rows) {
          if (err) q.reject(err);
          else q.resolve(rows);
        });
        conn.release();
      }
    });

    return q.promise;
  },
  //
  // search the parking list by query
  //
  search(db, query) {
    let q = Q.defer();
    let param = `%${query}%`;
    let sql = `select * from parking where (name like ?) order by name`;

    if (!query) {
      sql = `select * from parking order by name`;
    }

    db.getConnection(function (err, conn) {
      if (err) {
        q.reject(err);
      } else {
        conn.query(sql, [param], function (err, rows) {
          if (err) q.reject(err);
          else q.resolve(rows);
        });
        conn.release();
      }
    });

    return q.promise;
  },
  //
  // add parking
  //
  add(db, name, description, available, lat, lng, photo, shared_by, shared_phone, shared_photo) {
    let q = Q.defer();
    let sql = `
      insert into parking(name, description, available, lat, lng, photo, shared_by, shared_phone, shared_photo, sh  ared_date)
      values(?,?,?,?,?,?,?,?,?,now());
    `;

    db.getConnection((err, conn) => {
      if (err) {
        q.reject(err);
      } else {
        conn.query(sql, [name, description, available, lat, lng, photo, shared_by, shared_phone, shared_photo], (err, rows) => {
          if (err) q.reject(err);
          else q.resolve(rows);
        });
        conn.release();
      }
    });

    return q.promise;
  },
  //
  // get parking by id
  //
  getParkingById(db, id) {
    let q = Q.defer();
    let sql = `select * from parking where id=?`;
    db.getConnection(function (err, conn) {
      if (err) {
        q.reject(err);
      } else {
        conn.query(sql, [id], function (err, rows) {
          if (err) q.reject(err);
          else q.resolve(rows);
        });
        conn.release();
      }
    });
    return q.promise;
  },

  listusers(db) {
    let q = Q.defer();
    let sql = `select * from users`;

    db.getConnection(function (err, conn) {
      if (err) {
        q.reject(err);
      } else {
        conn.query(sql, [], function (err, rows) {
          if (err) q.reject(err);
          else q.resolve(rows);
        });
        conn.release();
      }
    });

    return q.promise;
  },
  searchUsers(db, query) {
    let q = Q.defer();
    let param = `%${query}%`;
    let sql = `select * from users where (username like ?) order by username`;

    if (!query) {
      sql = `select * from users order by username`;
    }

    db.getConnection(function (err, conn) {
      if (err) {
        q.reject(err);
      } else {
        conn.query(sql, [param], function (err, rows) {
          if (err) q.reject(err);
          else q.resolve(rows);
        });
        conn.release();
      }
    });

    return q.promise;
  },

  addUser(db, username, fullname) {
    let q = Q.defer();
    let sql = `
      insert into users(username,fullname)
      values(?,?);
    `;

    db.getConnection((err, conn) => {
      if (err) {
        q.reject(err);
      } else {
        conn.query(sql, [username, fullname], (err, rows) => {
          if (err) q.reject(err);
          else q.resolve(rows);
        });
        conn.release();
      }
    });

    return q.promise;
  }

};
