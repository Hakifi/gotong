const mysql = require('../../store/MySQL/Index');
const firebase = require('../../store/Firebase/Index');

const conn = mysql.getInstance();
const fbase = firebase.getInstance();

// get name, profile_picture, bio, username

const searchUser = async (search_query) => {
    return new Promise((resolve, reject) => {
        conn.executeQuery('SELECT User.name, User.username, User.profile_picture, Tier.name AS tier_name, Tier.mascot_image FROM User JOIN Tier ON User.tier_id = Tier.tier_id WHERE User.name LIKE ? OR User.username LIKE ?', [`%${search_query}%`, `%${search_query}%`])
            .then((result) => {
                resolve(result);
                return true;
            })
            .catch((error) => {
                reject(false);
                return false;
            });
    });
}

const getUser = async (user_id) => {
    return new Promise((resolve, reject) => {
        conn.executeQuery('SELECT User.name, User.username, User.profile_picture, Tier.name AS tier_name, Tier.mascot_image FROM User JOIN Tier ON User.tier_id = Tier.tier_id WHERE User.user_id = ?', [user_id])
            .then((result) => {
                if (result.length == 0) {
                    reject(false);
                    return false;
                }
                resolve(result[0]);
                return true;
            })
            .catch((error) => {
                reject(false);
                return false;
            });
    });
}

const getUserDetailed = (user_id) => {

}

module.exports = {
    getUser,
    searchUser
}