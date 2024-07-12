import withAuth from "../authentication/WithAuth";
import { useAuth } from "../authentication/AuthContext";
import Banner from "../components/Banner";
import axios from "axios";
import Map from "../components/Map/Map";
import SelectLocation from "../components/Map/SelectLocation";
import { useState } from "react";
import Navbar from "../components/Navbar";

const Test = ({ banner, ipCoordinateSrv }) => {

    const { user, logout } = useAuth();
    const [ipCoordinate, setIPCoordinate] = useState(ipCoordinateSrv);

    const handleLocationSelect = (location) => {
        console.log('Selected location:', location);
        console.log(ipCoordinate);
    };

    return (<div>
        <Navbar user={user} />
        <Banner banner={banner} />
        <Map latitude={-6.2114} longitude={106.8446} height={"298px"} />
        <SelectLocation onSelect={handleLocationSelect} ipCoordinate={ipCoordinate} />
        <button onClick={logout}>Logout</button>
    </div>)
};

export default withAuth(Test);

export async function getServerSideProps(context) {

    const apiUrl = process.env.API_URL;
    const clientIp = context.req.headers['x-forwarded-for'] || context.req.connection.remoteAddress;
    let latitude, longitude;

    try {
        const response = await axios.get(`http://ip-api.com/json/${clientIp}`);
        latitude = response.data.lat;
        longitude = response.data.lon;
    } catch (error) {

    }

    // axios fetching stuff
    const resBanner = await axios.get(`${apiUrl}/getBanner`);

    // data gathering
    const banner = resBanner.data;

    return {
        props: {
            banner: banner || [],
            ipCoordinateSrv: { lat: latitude || 0, lng: longitude || 0 }
        },
    };
}
