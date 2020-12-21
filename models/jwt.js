let jwt = require('jsonwebtoken');
let Q = require('q');

let secretKey = 'secrets';

module.exports = {
  //
  // get web token
  //
  sign(playload) {
    let token = jwt.sign(playload, secretKey, {
      expiresIn: '2d'
    });
    return token;
  },
  //
  // verify token
  //
  verify(token) {
    let q = Q.defer();
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        q.reject(err)
      } else {
        q.resolve(decoded)
      }
    });
    return q.promise;
  },
}
