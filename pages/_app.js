import '../src/app/globals.css';
import 'leaflet/dist/leaflet.css';
import nookies from 'nookies';
import { AuthProvider } from "../authentication/AuthContext";
import axios from 'axios';

function MyApp({ Component, pageProps }) {
    return (
        <AuthProvider initialUser={pageProps.user}>
            <Component {...pageProps} />
        </AuthProvider>
    )
}

MyApp.getInitialProps = async ({ ctx }) => {
    const cookies = nookies.get(ctx);
    let user = null;

    if (cookies.api_key) {
        try {
            const response = await axios.post('http://localhost/api/VerifyToken',
                {},
                {
                    headers: {
                        'x-api-key': cookies.api_key
                    }
                }
            );

            if (response.status === 200) {
                user = response.data;
                user.api_key = cookies.api_key;
            }

        } catch (error) {
            console.error('Error verifying API key:', error);
        }
    }

    return { pageProps: { user } };
};

export default MyApp
