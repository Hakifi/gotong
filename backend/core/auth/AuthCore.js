const mysql = require('../../store/MySQL/Index');
const firebase = require('../../store/Firebase/Index');
const API = require('./API');

const conn = mysql.getInstance();
const fbase = firebase.getInstance();
const api = new API();

// await get data from backend

// firebase

// utils

const storeAPIKey = async (api_key, user_id) => {
    return new Promise((resolve, reject) => {
        conn.executeQuery('INSERT INTO Api (user_id, api_key) VALUES (?, ?)', [user_id, api_key])
            .then((result) => {
                if (result.insertId == 0) {
                    reject("Failed to store API Key");
                    return false;
                }
                resolve(true);
                return true;
            })
            .catch((error) => {
                reject(false);
                return false;
            });
    });
}

const deleteAPIKey = async (api_key) => {
    return new Promise((resolve, reject) => {
        conn.executeQuery('DELETE FROM API WHERE api_key = ?', [api_key])
            .then((result) => {
                if (result.affectedRows == 0) {
                    reject(false);
                    return false;
                }
                resolve(true);
                return true;
            })
            .catch((error) => {
                reject(false);
                return false;
            });
    });
}

const getUserID = async (api_key) => {
    return new Promise((resolve, reject) => {
        conn.executeQuery('SELECT * FROM API WHERE api_key = ?', [api_key])
            .then((result) => {
                if (result.length == 0) {
                    reject(false);
                    return false;
                }
                resolve(result[0].user_id);
                return result[0].user_id;
            })
            .catch((error) => {
                reject(false);
                return false;
            });
    });

}

const getUserIDByEmail = async (email) => {
    return new Promise((resolve, reject) => {
        conn.executeQuery('SELECT * FROM Auth WHERE email = ?', [email])
            .then((result) => {
                if (result.length == 0) {
                    reject(false);
                    return false;
                }
                resolve(result[0].user_id);
                return result[0].user_id;
            })
            .catch((error) => {
                reject(false);
                return false;
            });
    });

}

const isUserExist = async (email) => {
    return new Promise((resolve, reject) => {
        conn.executeQuery('SELECT * FROM Auth WHERE email = ?', [email])
            .then((result) => {
                if (result.length == 0) {
                    resolve(false);
                    return false;
                }
                resolve(true);
                return true;
            })
            .catch((error) => {
                reject(false);
                return false;
            });
    });

}

const isUsernameExist = async (username) => {
    return new Promise((resolve, reject) => {
        conn.executeQuery('SELECT * FROM User WHERE username = ?', [username])
            .then((result) => {
                if (result.length == 0) {
                    resolve(false);
                    return false;
                }
                resolve(true);
                return true;
            })
            .catch((error) => {
                reject(false);
                return false;
            });
    });


}




// utils export

const oAuth = async (token) => {
    return new Promise(async (resolve, reject) => {
        try {
            let tokenRes = await fbase.firebaseVerifyToken(token);

            if (!tokenRes) {
                reject('Invalid token');
                return;
            }

            let { name, picture: profile_picture, email, username, email_verified: verified } = tokenRes;

            if (!username) {
                username = email;
            }

            let userExist = await isUserExist(email);

            if (userExist && verified) {
                let user_id = await getUserIDByEmail(email);
                let apiKey = api.generateKey();
                let storeAPI = await storeAPIKey(apiKey, user_id);
                if (storeAPI) {
                    resolve(apiKey);
                    return;
                } else {
                    reject('Failed to store API key');
                    return;
                }
            }

            if (userExist && !verified) {
                reject('Email not verified');
                return;
            }

            if (!userExist) {
                if (await isUsernameExist(username)) {
                    username = username + Math.floor(Math.random() * 1000);
                }

                let apiKey = api.generateKey();
                let hashRandom = api.generateKey();
                let registerRes = await register(email, username, hashRandom, name, profile_picture);
                if (registerRes) {
                    resolve(apiKey);
                    return;
                } else {
                    reject('Registration failed');
                    return;
                }
            }

            reject('Unexpected error');
            return;

        } catch (error) {
            reject(`Error: ${error.message}`);
            return;
        }
    });
}



const login = async (email, password) => {
    return new Promise((resolve, reject) => {
        conn.executeQuery('SELECT * FROM Auth WHERE email = ? AND password = ?', [email, password])
            .then((result) => {
                if (result.length == 0) {
                    resolve(false);
                    return false;
                }
                const apiKey = api.generateKey();
                const storeAPI = storeAPIKey(apiKey, result[0].user_id);
                if (storeAPI) {
                    resolve(apiKey);
                    return apiKey;
                }

                resolve(false);
                return false;
            })
            .catch((error) => {
                reject(false);
                return false;
            });
    });
}

const register = async (email, username, password, name, profile_picture) => {
    if (!email || !username || !password || !name) {
        return false;
    }

    if (await isUserExist(email)) {
        return "email_exist";
    }

    if (await isUsernameExist(username)) {
        return "username_exist";
    }

    try {
        const userResult = await conn.executeQuery('INSERT INTO User (tier_id, username, name, profile_picture) VALUES (?, ?, ?, ?)', [1, username, name, profile_picture]);
        console.log(userResult);
        if (userResult.insertId == 0) {
            return false;
        }

        const authResult = await conn.executeQuery('INSERT INTO Auth (user_id,email, password, isOAuthOnly) VALUES (?, ?, ?, ?)', [userResult.insertId, email, password, 0]);
        console.log('auth')
        console.log(authResult);
        if (authResult.affectedRows == 0) {
            return false;
        }

        const apiKey = api.generateKey();
        const res = await storeAPIKey(apiKey, userResult.insertId);
        return apiKey;
    } catch (error) {
        console.error(error);
        return false;
    }
};

const logout = async (api_key) => {
    return new Promise((resolve, reject) => {
        const res = deleteAPIKey(api_key);
        if (res) {
            resolve(true);
            return true;
        }
        reject(false);
        return false;
    });
}




module.exports = {
    isUserExist,
    oAuth,
    login,
    register,
    getUserID,
    logout
};