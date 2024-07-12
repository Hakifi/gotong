import nookies from 'nookies';
import axios from 'axios';

export default async function GetNearestGotong(req, res) {

    if (req.method === 'GET') {

        // headers x-api-key
        let postAxiosToCheck = axios.get('http://localhost:8592/api/v1/getNearestActivity', {
            headers: {
                'latitude': req.headers.latitude,
                'longitude': req.headers.longitude,
            }
        });

        if ((await postAxiosToCheck).status !== 200) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        if ((await postAxiosToCheck).status === 200) {
            return res.status(200).json((await postAxiosToCheck).data);
        }



    }
}
