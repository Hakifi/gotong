import nookies from 'nookies';
import axios from 'axios';

export default async function Register(req, res) {
    if (req.method === 'POST') {
        const referer = req.headers.referer || req.headers.origin;
        const { email, username, password, name } = req.body;
        const apiUrl = process.env.API_URL;

        if (!referer) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        if (!email || !username || !password || !name) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        try {
            const response = await axios.post(`${apiUrl}/register`, {
                email: email,
                username: username,
                password: password,
                name: name
            });

            if (response.status === 200) {
                const api_key = response.data.api_key;
                if (api_key) {
                    nookies.set({ res }, 'api_key', api_key, {
                        maxAge: 30 * 24 * 60 * 60, // 30 days
                        path: '/',
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'Strict',
                    });
                    return res.status(200).json({ status: "OK" });
                }
            }
            return res.status(401).json({ error: "Unauthorized" });
        } catch (error) {
            console.error(error);
            return res.status(401).json({ error: "Unauthorized" });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}
