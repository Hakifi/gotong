const crypto = require('crypto');
const mysql = require('../../store/MySQL/Index');

class API {

    constructor() {
        this.conn = mysql.getInstance();
    }

    checkKeyExist(key) {
        this.conn.executeQuery("SELECT * FROM `API` WHERE `api_key` = '" + key + "'")
            .then((result) => {
                if (result.length > 0) {
                    return true;
                }
                return false;
            })
            .catch((error) => {
                console.error('Error checking key:', error);
                return false;
            });
    }

    generateKey() {
        let key = crypto.randomBytes(20).toString('hex');
        while (this.checkKeyExist(key)) {
            key = crypto.randomBytes(20).toString('hex');
        }
        return key;
    }

}

module.exports = API;