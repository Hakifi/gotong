import nookies from 'nookies';
import axios from 'axios';

export default async function VerifyToken(req, res) {

    if (req.method === 'POST') {
        const cookies = nookies.get({ req });
        const api_key = req.headers['x-api-key'] || cookies.api_key;

        if (!api_key) {
            return res.status(401).json({ error: "Unauthorized" });
        }


        // headers x-api-key
        let postAxiosToCheck = axios.get('http://localhost:8592/api/v1/checkKey', {
            headers: {
                'x-api-key': api_key
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
