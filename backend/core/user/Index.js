const { getUserID } = require('../auth/AuthCore');
const mysql = require('../../store/MySQL/Index');
const { searchUser, getUser } = require('./Profile');
const { getUserHelpCount } = require('../activity/ActivityCore');

class User {

    constructor() {
        this.conn = mysql.getInstance();
    }

    async getUserProfileData(req, res) {
        let user_id = req.headers['user_id']

        if (!user_id) {
            res.status(400).send('User ID not found');
            return;
        }

        try {
            let user = await getUser(user_id);

            if (!user) {
                res.status(400).send('User not found');
                return;
            }

            let userHelpCount = await getUserHelpCount(user_id);

            user = {
                name: user.name,
                username: user.username,
                profile_picture: user.profile_picture,
                help_count: userHelpCount,
                bio: user.bio,
            };

            res.status(200).send(user);
        } catch (error) {
            console.error('Error getting user profile data:', error);
            res.status(500).send('Internal Server Error');
        }
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