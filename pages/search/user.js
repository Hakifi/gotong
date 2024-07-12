import { useEffect, useState } from 'react';
import { useAuth } from '../../authentication/AuthContext';
import Navbar from '../../components/Navbar';
import ActivityCard from '../../components/Cards/ActivityCard';
import axios from 'axios';
import { useRouter } from 'next/router';
import UserCard from '../../components/Cards/UserCard';
import Footer from '../../components/Footer';

const User = ({ activities, query }) => {
    const { user } = useAuth();

    return (
        <div className='bg-white min-h-screen'>
            <div className=" p-6">
                <Navbar user={user} />
                <div className='container mx-auto mt-6 '>
                    <h2 className='text-2xl font-semibold text-black'>Search Result for User</h2>
                    <p className='text-gray-500'>Showing search result for "{query}"</p>
                </div>
                <UserCard userData={activities ? activities : []} />
            </div>
            <Footer />
        </div>
    );
};

export default User;

export async function getServerSideProps({ query }) {
    const searchQuery = decodeURIComponent(query.query);

    try {
        const url = process.env.API_URL;
        const res = await axios.get(`${url}/searchUser`, {
            headers: {
                'search_query': searchQuery,
            },
            params: {
                query: searchQuery, // Use searchQuery here
            },
        });

        const activities = res.data;

        return {
            props: {
                activities,
                query: searchQuery, // Pass searchQuery as query prop
            },
        };
    } catch (error) {
        console.error('Error fetching activities:', error.message);
        return {
            props: {
                activities: [],
                query: searchQuery,
            },
        };
    }
}
