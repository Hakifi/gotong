const mysql = require('../../store/MySQL/Index');
const { getUserID } = require('../auth/AuthCore');
const { getActivityTypeSelection, addActivity, addLocation, addImage, addPlan, searchActivity, getActivityType, getActivityImage, getActivityJoinCount, getNearestActivity } = require('./ActivityCore');

class Activity {

    constructor() {
        this.conn = mysql.getInstance();
        this.getActivityTypeSelect = this.getActivityTypeSelect.bind(this);
        this.postActivity = this.postActivity.bind(this);
        this.searchActivity = this.searchActivity.bind(this);
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

    async getUrgentActivity(req, res) {

    }

    async getPopularActivity(req, res) {

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

}

module.exports = Activity;