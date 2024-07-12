const { register, login, logout, getUserID, oAuth } = require('./AuthCore');
const mysql = require('../../store/MySQL/Index');
const firebase = require('../../store/Firebase/Index');
const { getUser } = require('../user/Profile');
const API = require('./API');
class Auth {

    constructor() {
        this.conn = mysql.getInstance();
        this.firebase = firebase.getInstance();
        this.api = new API();
        this.checkAuth = this.checkAuth.bind(this);
        this.register = this.register.bind(this);
        this.oAuth = this.oAuth.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.getUserSimple = this.getUserSimple.bind(this);
    }

    async checkAuth(req, res, next) {
        let api_key = req.headers['x-api-key'];

        if (!api_key) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        try {
            this.conn.executeQuery('SELECT * FROM API WHERE api_key = ?', [api_key])
                .then((result) => {
                    if (result.length == 0) {
                        res.status(401).json({ error: "Unauthorized" });
                        return;
                    }

                    next();
                })
                .catch((error) => {
                    console.error(error);
                    res.status(500).json({ error: error });
                });
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: error });
        }
    }

    async getUserSimple(req, res) {
        let api_key = req.headers['x-api-key'];

        if (!api_key) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const userId = await getUserID(api_key);

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const user = await getUser(userId);

        if (!user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        if (user) {
            let userData = {
                name: user.name,
                username: user.username,
                tier: user.tier_name,
                mascot: user.mascot_image,
                profile_picture: user.profile_picture,
            }
            res.status(200).json(userData);
            return;
        }

    }

    async oAuth(req, res) {
        let token = req.body.token;

        if (!token) {
            res.status(400).json({ error: "Invalid Request" });
            return;
        }

        let oAuthRes = await oAuth(token);

        if (!oAuthRes) {
            res.status(500).json({ error: "OAuth Failed" });
            return;
        }

        if (oAuthRes == "email_exist") {
            res.status(400).json({ error: "Email already exist" });
            return;
        }

        if (oAuthRes == "username_exist") {
            res.status(400).json({ error: "Username already exist" });
            return;
        }

        if (oAuthRes == "email_not_verified") {
            res.status(400).json({ error: "Email not verified" });
            return;
        }

        if (oAuthRes) {

            const user_id = await getUserID(oAuthRes);
            const user = await getUser(user_id);

            if (!user) {
                res.status(500).json({ error: "Failed to get user data" });
                return;
            }

            const userAndAPIKey = {
                ...user,
                api_key: oAuthRes
            }

            res.status(200).json(userAndAPIKey);
            return;
        }

    }

    async login(req, res) {
        let email = req.body.email;
        let password = req.body.password;

        if (!email || !password) {
            res.status(400).json({ error: "Invalid Request" });
            return;
        }

        let loginRes = await login(email, password);

        if (!loginRes) {
            res.status(500).json({ error: "Login Failed" });
            return;
        }

        if (loginRes) {
            res.status(200).json({ api_key: loginRes });
            return;
        }
    }

    async register(req, res) {
        let email = req.body.email;
        let username = req.body.username;
        let password = req.body.password;
        let name = req.body.name;

        // if email exist

        if (!email || !username || !password || !name) {
            res.status(400).json({ error: "Invalid Request" });
            return;
        }

        let registerRes = await register(email, username, password, name);

        if (!registerRes) {
            console.log(registerRes);
            res.status(500).json({ error: "Register Failed" });
            return;
        }

        if (registerRes == "email_exist") {
            res.status(400).json({ error: "Email already exist" });
            return;
        }

        if (registerRes == "username_exist") {
            res.status(400).json({ error: "Username already exist" });
            return;
        }

        if (registerRes) {
            res.status(200).json({ api_key: registerRes });
            return;
        }


    }

    async logout(req, res) {
        let api_key = req.headers['x-api-key'];

        let logoutx = await logout(api_key);

        if (!logoutx) {
            res.status(500).json({ error: "Logout Failed" });
            return;
        }

        if (logoutx) {
            res.status(200).json({ message: "Logout Success" });
            return;
        }
    }





}

module.exports = Auth