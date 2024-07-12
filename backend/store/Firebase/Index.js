const axios = require('axios');
const jwt = require('jsonwebtoken');

class Firebase {
    static instance;

    static getInstance() {
        if (!Firebase.instance) {
            Firebase.instance = new Firebase();
        }
        return Firebase.instance;
    }

    constructor() {
        this.firebase = require('./Firebase');
        this.firebaseVerifyToken = this.firebaseVerifyToken.bind(this);
        this.firebaseGetUser = this.firebaseGetUser.bind(this);
        this.isUserExistByEmail = this.isUserExistByEmail.bind(this);
    }


    /**
     * @param {string} token - The token to verify.
     * @returns {string} UID of the user.
     */

    firebaseVerifyToken(token) {
        return new Promise((resolve, reject) => {
            this.firebase.auth().verifyIdToken(token)
                .then((decodedToken) => {
                    resolve(decodedToken);
                    return decodedToken;
                })
                .catch((error) => {
                    console.error("auth/firebase : " + error);
                    reject(error);
                });
        });
    }

    /**
     * @param {string} uid - The UID of the user.
     * @returns {Object} The user record.
     */

    firebaseGetUser(uid) {
        return new Promise((resolve, reject) => {
            this.firebase.auth().getUser(uid)
                .then((userRecord) => {
                    resolve(userRecord);
                })
                .catch((error) => {
                    console.error('Error fetching user data:', error);
                    reject(error);
                });
        });
    }

    isUserExistByEmail(email) {
        return new Promise((resolve, reject) => {
            this.firebase.auth().getUserByEmail(email)
                .then((userRecord) => {
                    if (userRecord) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                })
                .catch((error) => {
                    if (error.message.includes('There is no user record corresponding to the provided identifier.')) {
                        console.log("asdasdas");
                        resolve(false);
                        return false;
                    }
                    reject(error);
                });
        });
    }
}

module.exports = Firebase;