import axios from "axios";
import Navbar from "../components/Navbar";
import { useAuth } from "../authentication/AuthContext";
import Banner from "../components/Banner";
import ActivityCardScroll from "../components/Cards/ActivityCardScroll";
import { useEffect, useState } from "react";


const Index = ({ activites, ipCoord }) => {

    const { user } = useAuth();
    const [position, setPosition] = useState({ latitude: ipCoord.latitude, longitude: ipCoord.longitude });
    const [gotong, setGotong] = useState([]);

    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setPosition({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            })
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }

    useEffect(() => {
        getUserLocation();

        const data = axios.get('/api/GetNearestGotong', {
            headers: {
                latitude: position.latitude,
                longitude: position.longitude,
            }
        });

        data.then((res) => {
            setGotong(res.data);
        }).catch((err) => {
            console.error(err);
        })

    }, []);



    return (
        <div className='min-h-screen bg-white'>
            <Navbar user={user} />
            <Banner banner={[]} />
            <div className='container mx-auto mt-6 p-4 sm:p-8'>
                <h1 className='text-xl sm:text-3xl font-semibold text-black'>Gotong Royong Near You</h1>
                <p className='text-gray-500 text-md sm:text-xl font-light mt-2'>Find Gotong Royong near you and help others</p>
            </div>
            {gotong.length > 0 ? <ActivityCardScroll activity={gotong} /> : <div className='container mx-auto mt-6 p-4 sm:p-8'><p className='text-gray-500 text-md sm:text-xl font-light mt-2'>No Gotong Royong near you</p></div>}
        </div>
    )

}

export default Index

export async function getServerSideProps(context) {

    const clientIp = context.req.headers['x-forwarded-for'] || context.req.connection.remoteAddress;

    let latitude = 0, longitude = 0;

    try {
        const response = await axios.get(`http://ip-api.com/json/${clientIp}`);
        latitude = response.data.lat || 0;
        longitude = response.data.lon || 0;
    } catch (error) {
        console.error('Error fetching IP:', error.message);
    }

    let ipCoord = {
        latitude: latitude,
        longitude: longitude
    }

    return {
        props: {
            ipCoord: ipCoord
        },
    };
}