import axios from 'axios';

async function getCityByCoordinates(latitude, longitude) {
    try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
        const city = response.data.address.city_district || response.data.address.city;
        return city;
    } catch (error) {
        console.error('Error fetching city:', error);
        return null;
    }
}

export default getCityByCoordinates;