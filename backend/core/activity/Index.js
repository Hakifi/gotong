const mysql = require('../../store/MySQL/Index');
const { getUserID } = require('../auth/AuthCore');
const { getUser } = require('../user/Profile');
const { getActivityTypeSelection, addActivity, addLocation, addImage, addPlan, searchActivity, getActivityType, getActivityImage, getActivityJoinCount, getNearestActivity, getActivity, getActivityPlan, getActivityLocation, joinActivity, isUserAMemberOfActivity, getContribution, getContributions, verifyContributionLocation, checkIfContributionVerified, addContributionVerified, getTopRankUserMonth, getTopRankUserAllTime } = require('./ActivityCore');

class Activity {

    constructor() {
        this.conn = mysql.getInstance();
        this.getActivityTypeSelect = this.getActivityTypeSelect.bind(this);
        this.postActivity = this.postActivity.bind(this);
        this.searchActivity = this.searchActivity.bind(this);
        this.joinActivity = this.joinActivity.bind(this);
        this.isUserInActivity = this.isUserInActivity.bind(this);
    }


    async getActivityTypeSelect(req, res) {

        const activityTypes = await getActivityTypeSelection();

        if (!activityTypes) {
            res.status(500).json([]);
            return;
        }

        if (activityTypes.length == 0) {
            res.status(200).json([]);
            return;
        }

        if (activityTypes.length > 0) {
            res.status(200).json(activityTypes);
            return;
        }

    }

    async searchActivity(req, res) {
        let { latitude, longitude } = req.headers;
        let { search_query } = req.headers;

        if (!latitude || !longitude) {
            res.status(400).json({ error: 'Missing latitude or longitude' });
            return;
        }

        if (!search_query) {
            res.status(400).json({ error: 'Missing search query' });
            return;
        }

        if (search_query) {
            searchActivity(search_query, latitude, longitude)
                .then(async (result) => {

                    for (let i = 0; i < result.length; i++) {

                        const activity_type_name = await getActivityType(result[i].activity_type);
                        const images = await getActivityImage(result[i].activity_id);

                        result[i] = {
                            activity_id: result[i].activity_id,
                            activity_name: result[i].name,
                            status: result[i].activity_status,
                            type: activity_type_name.activity_type_name,
                            images_thumb: images[0].s3_url,
                            description_short: result[i].description.length > 100 ? result[i].description.substring(0, 100) + '...' : result[i].description,
                            posted_date: result[i].creation_date,
                            date_action: result[i].date_action,
                            total_join: await getActivityJoinCount(result[i].activity_id),
                            city: result[i].city,
                            distance: result[i].distance
                        }
                    }


                    res.status(200).json(result);
                    return;
                })
                .catch((error) => {
                    res.status(500).json({ error: error });
                    return;
                });
        }


    }

    async getNearestActivity(req, res) {
        let { latitude, longitude } = req.headers;

        if (!latitude || !longitude) {
            res.status(400).json({ error: 'Missing latitude or longitude' });
            return;
        }

        const result = await getNearestActivity(latitude, longitude);

        if (!result) {
            res.status(500).json([]);
            return;
        }

        if (result) {
            for (let i = 0; i < result.length; i++) {

                const activity_type_name = await getActivityType(result[i].activity_type);
                const images = await getActivityImage(result[i].activity_id);

                result[i] = {
                    activity_id: result[i].activity_id,
                    activity_name: result[i].name,
                    status: result[i].activity_status,
                    type: activity_type_name.activity_type_name,
                    images_thumb: images[0].s3_url,
                    description_short: result[i].description.length > 100 ? result[i].description.substring(0, 100) + '...' : result[i].description,
                    posted_date: result[i].creation_date,
                    date_action: result[i].date_action,
                    total_join: await getActivityJoinCount(result[i].activity_id),
                    city: result[i].city,
                    distance: result[i].distance
                }
            }

            res.status(200).json(result);

        }
    }

    async getActivity(req, res) {
        const activity_id = req.headers['activity_id'];

        if (!activity_id) {
            res.status(400).json({ error: 'Missing activity id' });
            return;
        }

        let api_key = req.headers['x-api-key'];
        let result = await getActivity(activity_id);

        if (!result) {
            res.status(500).json({ error: 'Failed to get activity' });
            return;
        }

        if (result) {

            const userData = await getUser(result.user_id);
            const activity_type_name = await getActivityType(result.activity_type);
            const location = await getActivityLocation(result.activity_id);
            const images = await getActivityImage(result.activity_id);
            const plans = await getActivityPlan(result.activity_id);

            for (let i = 0; i < images.length; i++) {
                images[i] = {
                    url: images[i].s3_url,
                }
            }

            result = {
                activity_id: result.activity_id,
                activity_name: result.name,
                initiator_name: userData.name,
                initiator_profile_picture: userData.profile_picture,
                isUrgent: activity_type_name.urgent === 0 ? false : true,
                contact_person: {
                    telephone: result.telephone,
                    instagram: result.instagram
                },
                status: result.activity_status,
                type: activity_type_name.activity_type_name,
                images: images,
                description_short: result.description,
                posted_date: result.creation_date,
                date_action: result.date_action,
                total_join: await getActivityJoinCount(result.activity_id),
                city: result.city,
                location: {
                    address: location[0].address,
                    latitude: location[0].coordinate.x,
                    longitude: location[0].coordinate.y
                },
                resource: {

                },
                plans: plans,
            }

            res.status(200).json(result);
        }
    }

    async isUserInActivity(req, res) {
        let api_key = req.headers['x-api-key'];

        if (!api_key) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        let user_id = await getUserID(api_key);

        if (!user_id) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        let activity_id = req.headers['activity_id'];

        try {
            let isUserAMember = await isUserAMemberOfActivity(user_id, activity_id);
            res.status(200).json(isUserAMember);
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async getUserContributions(req, res) {
        let api_key = req.headers['x-api-key'];

        if (!api_key) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        let user_id = await getUserID(api_key);

        if (!user_id) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        try {
            let contributions = await getContributions(user_id);

            if (!contributions) {
                res.status(500).json([]);
                return;
            }

            let result = {
                past: [],
                upcoming: [],
                now: []
            }

            for (let i = 0; i < contributions.length; i++) {

                const activity_type_name = await getActivityType(contributions[i].activity_type);
                const images = await getActivityImage(contributions[i].activity_id);

                contributions[i] = {
                    activity_id: contributions[i].activity_id,
                    activity_name: contributions[i].name,
                    date_action: contributions[i].date_action,
                    images_thumb: images[0].s3_url,
                }

                if (new Date(contributions[i].date_action) < new Date()) {
                    result.past.push(contributions[i]);
                }

                if (new Date(contributions[i].date_action) > new Date()) {
                    result.upcoming.push(contributions[i]);
                }


                if (new Date(contributions[i].date_action).getDate() == new Date().getDate()) {
                    result.now.push(contributions[i]);
                }
            }
            console.log(result);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async verifyContribution(req, res) {
        let api_key = req.headers['x-api-key'];
        let { activity_id, latitude, longitude } = req.headers;

        console.log(activity_id, latitude, longitude);

        if (!api_key) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        let user_id = await getUserID(api_key);

        if (!user_id) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        if (!activity_id || !latitude || !longitude) {
            res.status(400).json({ error: "Missing activity_id or location" });
            return;
        }

        try {
            const check = await checkIfContributionVerified(activity_id, user_id);

            if (check) {
                res.status(200).json({ error: "Already verified" });
                return;
            }

            const verificationRes = await verifyContributionLocation(activity_id, latitude, longitude);

            if (!verificationRes) {
                res.status(500).json({ error: "Failed to verify contribution" });
                return;
            }

            const addContr = await addContributionVerified(activity_id, user_id);

            if (!addContr) {
                res.status(500).json({ error: "Failed to verify contribution" });
                return;
            }

            res.status(200).json({ message: "Success" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async getTopUser(req, res) {
        let { time } = req.headers;

        if (time === 'month') {
            const result = await getTopRankUserMonth();
            res.status(200).json(result);
            return;
        }

        if (time === 'all-time') {
            const result = await getTopRankUserAllTime();
            res.status(200).json(result);
            return;
        }

        res.status(400).json({ error: "Invalid time" });
    }



    // post

    async postActivity(req, res) {

        let api_key = req.headers['x-api-key'];

        if (!api_key) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        let user_id = await getUserID(api_key);

        if (!user_id) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        try {

            const imageUrls = req.files ? req.files.map((file) => ({ location: file.location, key: file.key })) : [];

            const {
                activity_name,
                activity_type,
                date_action,
                description,
                latitude,
                longitude,
                address,
                city,
                telephone,
                instagram,
                plan
            } = req.body;

            let planX = JSON.parse(plan);


            const activity_id = await addActivity(user_id, activity_name, activity_type, telephone, instagram, date_action, description, city);

            if (!activity_id) {
                // delete s3 here

                res.status(500).json({ error: 'Failed to add activity' });
                return;
            }

            const location_id = await addLocation(activity_id, address, latitude, longitude);

            if (!location_id) {
                // delete s3 here

                res.status(500).json({ error: 'Failed to add location' });
                return;
            }

            if (planX) {
                planX.forEach(async (item) => {
                    const { name, description, date, time } = item;
                    const plan_id = await addPlan(activity_id, name, description, date, time);

                    if (!plan_id) {
                        // delete s3 here

                        res.status(500).json({ error: 'Failed to add plan' });
                        return;
                    }
                });
            }

            if (imageUrls) {
                imageUrls.forEach(async (url) => {
                    const image_id = await addImage(activity_id, url.location, url.key);

                    if (!image_id) {
                        // delete s3 here

                        res.status(500).json({ error: 'Failed to add image' });
                        return;
                    }
                });
            }

            res.status(200).json({ message: 'Success' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Failed', details: error.message });
        }
    }

    async joinActivity(req, res) {
        let api_key = req.headers['x-api-key'];
        let activity_id = req.headers['activity_id'];

        if (!api_key) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        let user_id = await getUserID(api_key);

        if (!user_id) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const joinActivityX = await joinActivity(user_id, activity_id);

        if (!joinActivityX) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        res.status(200).json({ message: "Success" });
        return;
    }

}

module.exports = Activity;