import admin from "firebase-admin";

const serviceAccount = require("config/firebase-service.json");

if(!admin.apps.length){
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://aurora-tip-bot-default-rtdb.firebaseio.com/",
    });
}


export default admin;
