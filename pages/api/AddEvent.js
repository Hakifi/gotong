import { IncomingForm } from 'formidable';
import axios from 'axios';
import fs from 'fs';
import nookies from 'nookies';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function AddEvent(req, res) {
    if (req.method === 'POST') {
        const cookies = nookies.get({ req });
        const api_key = req.headers['x-api-key'] || cookies.api_key;

        if (!api_key) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const form = new IncomingForm({ multiples: true });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Error parsing form:', err);
                return res.status(500).json({ error: 'Error processing upload' });
            }

            const formData = new FormData();

            // Append all fields
            Object.keys(fields).forEach(key => {
                if (key === 'plan') {
                    formData.append('plan', fields.plan[0]);
                } else {
                    formData.append(key, fields[key][0]);
                }
            });

            // Append image files
            if (files.image) {
                if (Array.isArray(files.image)) {
                    files.image.forEach((file, index) => {
                        formData.append('image', fs.createReadStream(file.filepath), file.originalFilename);
                    });
                } else {
                    formData.append('image', fs.createReadStream(files.image.filepath), files.image.originalFilename);
                }
            }

            try {
                const response = await axios.post(`${process.env.API_URL}/postActivity`, formData, {
                    headers: {
                        ...formData.getHeaders(),
                    },
                });

                res.status(200).json(response.data);
            } catch (error) {
                console.error('Error sending data to server:', error);
                res.status(500).json({ error: 'Error sending data to server' });
            }
        });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}