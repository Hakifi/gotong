const mysql = require('../../store/MySQL/Index');
const firebase = require('../../store/Firebase/Index');
const { getUser } = require('../user/Profile');

const conn = mysql.getInstance();
const fbase = firebase.getInstance();


// store

const addLocation = async (activity_id, address, latitude, longitude) => {
    return new Promise((resolve, reject) => {
        const coordinate = `POINT(${latitude} ${longitude})`;
        conn.executeQuery('INSERT INTO ActivityLocation(activity_id, location_detail, address, coordinate) VALUES (?, ?, ?, ST_GeomFromText(?))', [activity_id, address, address, coordinate])
            .then((result) => {
                if (result.affectedRows == 1) {
                    resolve(result.insertId);
                    return result.insertId;
                }
                reject('Failed to add location');
                return;
            })
            .catch((error) => {
                reject(error);
            });
    });
}

const addPlan = async (activity_id, name, description, date, time) => {
    try {
        const datetime = new Date(`${date}T${time}`);
        return new Promise((resolve, reject) => {
            conn.executeQuery('INSERT INTO ActivityPlan(activity_id, name, description, time) VALUES (?, ?, ?, ?)', [activity_id, name, description, datetime])
                .then((result) => {
                    if (result.affectedRows === 1) {
                        resolve(result.insertId);
                        return result.insertId;
                    } else {
                        reject('Failed to add plan');
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        });
    } catch (error) {
        return Promise.reject('Invalid date or time format');
    }
}

const addImage = async (activity_id, s3_url, s3_path) => {
    return new Promise((resolve, reject) => {
        conn.executeQuery('INSERT INTO ActivityImage(activity_id, s3_url, s3_path) VALUES (?, ?, ?)', [activity_id, s3_url, s3_path])
            .then((result) => {
                if (result.affectedRows === 1) {
                    resolve(result.insertId);
                    return result.insertId;
                }
                reject('Failed to add image');
            })
            .catch((error) => {
                reject(error);
            });
    });
}


const addActivity = async (user_id, name, type, telephone, instagram, date_action, description, city) => {
    return new Promise((resolve, reject) => {
        conn.executeQuery('INSERT INTO Activity(user_id, name, activity_type, telephone, instagram, date_action, description, isAnonym, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [user_id, name, type, telephone, instagram, date_action, description, 0, city])
            .then((result) => {
                if (result.affectedRows === 1) {
                    resolve(result.insertId);
                    return result.insertId;
                }
                reject('Failed to add activity');
            })
            .catch((error) => {
                reject(error);
            });
    });
}

const getActivityTypeSelection = async () => {
    return new Promise((resolve, reject) => {
        conn.executeQuery('SELECT * FROM ActivityType')
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

const distanceBetweenCoordinateInMeters = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in metres
}

const getActivityType = (activity_type_id) => {
    return new Promise((resolve, reject) => {
        conn.executeQuery('SELECT * FROM ActivityType WHERE activity_type_id = ?', [parseInt(activity_type_id)])
            .then((result) => {
                if (result.length > 0) {
                    resolve(result[0]);
                    return result[0];
                }
                reject(false);
                return false;
            })
            .catch((error) => {
                reject(error);
                return false;

            });
    });
}

const getActivityImage = (activity_id) => {
    return new Promise((resolve, reject) => {
        conn.executeQuery('SELECT * FROM ActivityImage WHERE activity_id = ?', [activity_id])
            .then((result) => {
                if (result.length > 0) {
                    resolve(result);
                    return result;
                }
                reject(false);
                return false;
            })
            .catch((error) => {
                reject(error);
                return false;
            });
    });
}

const getActivityJoinCount = (activity_id) => {
    return new Promise((resolve, reject) => {
        conn.executeQuery('SELECT COUNT(*) as count FROM UserJoinActivity WHERE activity_id = ?', [activity_id])
            .then((result) => {
                if (result.length > 0) {
                    resolve(result[0].count);
                    return result[0].count;
                }
                reject(false);
                return false;
            })
            .catch((error) => {
                reject(error);
                return false;
            });
    });
}

const searchActivity = async (keyword, latitude, longitude) => {
    return new Promise((resolve, reject) => {
        conn.executeQuery('SELECT * FROM Activity a JOIN ActivityLocation al ON a.activity_id = al.activity_id WHERE a.name LIKE ? OR a.description LIKE ?', [`%${keyword}%`, `%${keyword}%`])
            .then((result) => {
                for (let i = 0; i < result.length; i++) {
                    result[i].distance = distanceBetweenCoordinateInMeters(latitude, longitude, result[i].coordinate.x, result[i].coordinate.y);
                }
                resolve(result);
                return result;
            })
            .catch((error) => {
                reject(error);
            });
    });
}

const getNearestActivity = async (latitude, longitude) => {
    return new Promise((resolve, reject) => {
        conn.executeQuery(`SELECT
a.*, 
al.location_detail,
al.address,
    ST_X(al.coordinate) AS latitude,
        ST_Y(al.coordinate) AS longitude,
            SQRT(POW((ST_X(al.coordinate) - ${latitude}), 2) + POW((ST_Y(al.coordinate) - ${longitude}), 2)) AS distance
FROM
    Activity a
JOIN
    ActivityLocation al ON a.activity_id = al.activity_id
ORDER BY
    distance ASC LIMIT 20`)
            .then((result) => {
                resolve(result);
                return result;
            })
            .catch((error) => {
                reject(error);
            });
    });
}

const getActivity = async (activity_id) => {
    return new Promise((resolve, reject) => {
        conn.executeQuery('SELECT * FROM Activity WHERE activity_id = ?', [activity_id])
            .then((result) => {
                if (result.length > 0) {
                    resolve(result[0]);
                    return result[0];
                }
                reject(false);
                return false;
            })
            .catch((error) => {
                reject(error);
                return false;
            });
    });
}

const getActivityPlan = async (activity_id) => {
    return new Promise((resolve, reject) => {
        conn.executeQuery('SELECT * FROM ActivityPlan WHERE activity_id = ?', [activity_id])
            .then((result) => {
                if (result.length > 0) {
                    resolve(result);
                    return result;
                }
                reject(false);
                return false;
            })
            .catch((error) => {
                reject(error);
                return false;
            });
    });
}

const getActivityLocation = async (activity_id) => {
    return new Promise((resolve, reject) => {
        conn.executeQuery('SELECT * FROM ActivityLocation WHERE activity_id = ?', [activity_id])
            .then((result) => {
                if (result.length > 0) {
                    resolve(result);
                    return result;
                }
                reject(false);
                return false;
            })
            .catch((error) => {
                reject(error);
                return false;
            });
    });
}

const joinActivity = async (user_id, activity_id) => {
    return new Promise((resolve, reject) => {
        conn.executeQuery("INSERT INTO UserJoinActivity(user_id, activity_id) VALUES (?, ?)", [user_id, activity_id])
            .then((result) => {
                if (result.affectedRows === 1) {
                    resolve(true);
                    return true;
                }
                reject(false)
                return false;
            })
            .catch((error) => {
                reject(false);
                return false;
            })
    });
}

const isUserAMemberOfActivity = async (user_id, activity_id) => {
    return new Promise((resolve, reject) => {
        conn.executeQuery('SELECT * FROM UserJoinActivity WHERE user_id = ? AND activity_id = ?', [user_id, activity_id])
            .then((result) => {
                if (result.length > 0) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
}

const getContributions = async (user_id) => {
    return new Promise((resolve, reject) => {
        conn.executeQuery('SELECT * FROM UserJoinActivity JOIN Activity ON UserJoinActivity.activity_id = Activity.activity_id WHERE UserJoinActivity.user_id = ?', [user_id])
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
}

const verifyContributionLocation = async (activity_id, latitude, longitude) => {
    return new Promise((resolve, reject) => {
        conn.executeQuery('SELECT * FROM ActivityLocation WHERE activity_id = ?', [activity_id])
            .then((result) => {
                if (result.length > 0) {
                    const distance = distanceBetweenCoordinateInMeters(latitude, longitude, result[0].coordinate.x, result[0].coordinate.y);
                    if (distance < 300) {
                        resolve(true);
                        return true;
                    }
                }
                reject(false);
                return false;
            })
            .catch((error) => {
                reject(error);
                return false;
            });
    });
}

const checkIfContributionVerified = async (activity_id, user_id) => {
    return new Promise((resolve, reject) => {
        conn.executeQuery('SELECT * FROM confirm_location WHERE activity_id = ? AND user_id = ?', [activity_id, user_id])
            .then((result) => {
                if (result.length > 0) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
            .catch((error) => {
                console.error('Error checking contribution verification:', error);
                reject(error);
            });
    });
};

const addContributionVerified = async (activity_id, user_id) => {
    return new Promise((resolve, reject) => {
        conn.executeQuery('INSERT INTO confirm_location(activity_id, user_id) VALUES (?, ?)', [activity_id, user_id])
            .then((result) => {
                if (result.affectedRows === 1) {
                    resolve(true);
                    return true;
                }
                reject(false);
                return false;
            })
            .catch((error) => {
                reject(error);
                return false;
            });
    });
}

const getTopRankUserMonth = async () => {
    return new Promise((resolve, reject) => {
        conn.executeQuery(
            `SELECT user_id, COUNT(user_id) AS total_help 
                FROM confirm_location 
                WHERE date_confirm >= NOW() - INTERVAL 1 MONTH 
                GROUP BY user_id 
                ORDER BY total_help DESC LIMIT 6`
        )
            .then(async (results) => {
                const detailedResults = [];

                for (const result of results) {
                    const userDetail = await getUser(result.user_id);

                    detailedResults.push({
                        name: userDetail.name,
                        username: userDetail.username,
                        total_help: result.total_help
                    });
                }

                resolve(detailedResults);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

const getTopRankUserAllTime = async () => {
    return new Promise((resolve, reject) => {
        conn.executeQuery(
            `SELECT user_id, COUNT(user_id) AS total_help 
                 FROM confirm_location 
                 GROUP BY user_id 
                 ORDER BY total_help DESC LIMIT 6`
        )
            .then(async (results) => {
                const detailedResults = [];

                for (const result of results) {
                    const userDetail = await getUser(result.user_id);

                    detailedResults.push({
                        name: userDetail.name,
                        username: userDetail.username,
                        total_help: result.total_help
                    });
                }

                resolve(detailedResults);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

const getUserHelpCount = async (user_id) => {
    return new Promise((resolve, reject) => {
        conn.executeQuery('SELECT COUNT(*) AS total_help FROM confirm_location WHERE user_id = ?', [user_id])
            .then((result) => {
                if (result && result[0]) {
                    resolve(result[0].total_help);
                } else {
                    reject(new Error('Invalid result from query'));
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
}


const getUserActivityHistory = async (user_id) => {
    return new Promise((resolve, reject) => {
        let data = {

        }
    });

}

module.exports = {
    getUserHelpCount,
    getTopRankUserMonth,
    getTopRankUserAllTime,
    addContributionVerified,
    checkIfContributionVerified,
    verifyContributionLocation,
    getContributions,
    getActivityTypeSelection,
    getActivityType,
    getActivityImage,
    getActivityJoinCount,
    getActivity,
    getActivityPlan,
    getActivityLocation,
    searchActivity,
    getNearestActivity,
    isUserAMemberOfActivity,
    joinActivity,
    addActivity,
    addImage,
    addPlan,
    addLocation
}