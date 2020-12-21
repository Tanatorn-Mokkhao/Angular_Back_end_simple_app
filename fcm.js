var FCM = require('fcm-node');
var serverKey = require('./privatekey.json');
var fcm = new FCM(serverKey);

var message = {
  to: 'diiNDvZdZdk:APA91bH6pNzYIG8cohaGl9DR3Cux43fqYaQCO5PQP-onnCW8qW8DwQZ5gAWBTrRqZA3liZUmM7igPk9_o69aUH0c_1yaYl1ZxBN3dypzdZ96L8JuibgwU50HMFI_33Agr2CVapheThGU',
  notification: {
    title: 'Title of your push notification',
    body: 'Body of your push notification'
  },
};

fcm.send(message, (err, resp) => {
  process.exit();
});
