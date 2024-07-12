const firebase = require('firebase-admin');
require('dotenv').config({ path: "./secret/.env" });
const operationalStatus = process.env.OPERATIONAL;

if (operationalStatus == 1) {
    var serviceAccount = require("../../secret/gotong-firebase.json");
    firebase.initializeApp({
        credential: firebase.credential.cert(serviceAccount)
    });

    if (firebase.apps.length == 0) {
        sendWebhook("Commerce", "severe", "Error connecting to the Firebase Database");
        return;
    }

    module.exports = firebase;
    console.log("Firebase Connected Successfully");
} else {
    console.log("Firebase cannot be started due to OPERATIONAL STATUS!");
    return;
}