import axios from 'axios';
import nookies from 'nookies';

export default async function OAuth(req, res) {
    if (req.method !== 'POST') {
        res.status(405).end();
        return;
    }

    const referer = req.headers.referer || req.headers.origin;

    if (!referer) {
        return res.status(400).json({ error: 'jangan di scrape lah bang, kan malu sendiri kalo gagal :(', status: 'BANNED', code: 400 });
    }

    const { token } = req.body;

    try {
        const response = await axios.post('http://localhost:8592/api/v1/oAuth', { token });
        console.log(response);

        if (response.data.error) {
            return res.status(401).json({ error: response.data.error });
        }

        if (response.data.api_key) {
            nookies.set({ res }, 'api_key', response.data.api_key, {
                maxAge: 30 * 24 * 60 * 60, // 30 days
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
            });
        }

        return res.status(200).json(response.data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}