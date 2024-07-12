const mysql = require('../../store/MySQL/Index');
const firebase = require('../../store/Firebase/Index');
const { getUser } = require('../user/Profile');

class Web {
    constructor() {
        this.conn = mysql.getInstance();
        this.firebase = firebase.getInstance();
        this.getBanner = this.getBanner.bind(this);
    }

    async getBanner(req, res) {
        try {
            const banner = await this.conn.executeQuery('SELECT * FROM Banner WHERE active = 1');
            res.status(200).json(banner);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error });
        }
    }
}

module.exports = Web;