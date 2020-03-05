const admin = require('firebase-admin');
const serviceAccount = process.env.FIREBASE_CONFIG ? 
    JSON.parse(process.env.FIREBASE_CONFIG) : require('../../credentials.json');

const firebase = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://ark8-cabinet.firebaseio.com'
  });

module.exports = firebase;