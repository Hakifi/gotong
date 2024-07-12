import nookies from 'nookies';
import axios from 'axios';

export default async function JoinActivity(req, res) {

    if (req.method === 'POST') {
        const cookies = nookies.get({ req });
        const api_key = req.headers['x-api-key'] || cookies.api_key;

        console.log(req.headers);
        console.log(api_key);
        console.log('asdx')

        if (!api_key) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        let activity_id = req.headers.referer.split('=')[1];

        let postAxiosToCheck = axios.post('http://localhost:8592/api/v1/joinActivity', {
            headers: {
                'x-api-key': api_key,
                'activity_id': activity_id
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

