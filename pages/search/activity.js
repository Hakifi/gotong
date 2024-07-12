import { useEffect, useState } from 'react';
import { useAuth } from '../../authentication/AuthContext';
import Navbar from '../../components/Navbar';
import ActivityCard from '../../components/Cards/ActivityCard';
import axios from 'axios';
import { useRouter } from 'next/router';
import Footer from '../../components/Footer';

const Activity = ({ activities, query }) => {
    const { user } = useAuth();

    return (
        <div className="bg-white min-h-screen p-6">
            <Navbar user={user} />
            <div className='container mx-auto mt-6 '>
                <h2 className='text-2xl font-semibold text-black'>Search Result for Activities</h2>
                <p className='text-gray-500'>Showing search result for "{query}"</p>
            </div>
            <ActivityCard activity={activities ? activities : []} />
            <Footer />
        </div>
    );
};

export default Activity;

export async function getServerSideProps(context) {
    const searchQuery = decodeURIComponent(context.query.query);

    const clientIp = context.req.headers['x-forwarded-for'] || context.req.connection.remoteAddress;

    let latitude = 0, longitude = 0;

    try {
        const response = await axios.get(`http://ip-api.com/json/${clientIp}`);
        latitude = response.data.lat;
        longitude = response.data.lon;

    } catch (error) {
        console.error('Error fetching IP:', error.message);
    }

    try {

        const url = process.env.API_URL;
        const res = await axios.get(`${url}/searchActivity`, {
            headers: {
                'search_query': searchQuery,
                'latitude': latitude || 0,
                'longitude': longitude || 0,
            },
            params: {
                query: searchQuery, // Use searchQuery here
            },
        });

        const activities = res.data;
        console.log(activities);
        console.log(searchQuery);

        return {
            props: {
                activities: activities,
                query: searchQuery, // Pass searchQuery as query prop
            },
        };
    } catch (error) {
        console.error(error)
        console.error('Error fetching activities:', error.message);
        return {
            props: {
                activities: [],
                query: searchQuery,
            },
        };
    }
}
