const { getUserID } = require('../auth/AuthCore');
const mysql = require('../../store/MySQL/Index');
const { searchUser } = require('./Profile');

class User {

    constructor() {
        this.conn = mysql.getInstance();
    }

    async searchUser(req, res) {
        let search_query = req.headers['search_query'];

        if (!search_query) {
            res.status(400).json({ error: 'Missing search query' });
            return;
        }

        const user = await searchUser(search_query);

        res.status(200).json(user);
    }

}

module.exports = User;