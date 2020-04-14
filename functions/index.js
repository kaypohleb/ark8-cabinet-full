const functions = require('firebase-functions');
const admin = require("firebase-admin");
const serviceAccount = require('./credentials.json');

const firebase = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://ark8-cabinet.firebaseio.com",
});

exports.handleNewSignups = functions.auth.user().onCreate(async (userRecord) => {
    return await firebase.firestore().collection("users").doc(userRecord.uid).set({
        id: userRecord.uid,
        name: userRecord.displayName,
    }).then(() => {
        console.log("Welcome to ark8");
        return true;
    }).catch(error => {
        console.log("Error:" + error.message);
    });
});