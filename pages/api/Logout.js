import nookies from 'nookies';
import axios from 'axios';

export default async function LogoutAPI(req, res) {
    if (req.method === 'POST') {
        const apiUrl = process.env.API_URL;
        const cookies = nookies.get({ req });
        const api_key = req.headers['x-api-key'] || cookies.api_key;

        try {

            let postAxiosToCheck = axios.get(`${apiUrl}/logout`, {
                headers: {
                    'x-api-key': api_key
                }
            });

            if ((await postAxiosToCheck).status === 200) {
                nookies.destroy({ res }, 'api_key', {
                    path: '/',
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                });
                return res.status(200).json({ message: "success" });
            }

            if ((await postAxiosToCheck).status !== 200) {
                return res.status(500).json({ error: "failed" });
            }

        } catch (error) {
            return res.status(500).json({ error: "failed" });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
