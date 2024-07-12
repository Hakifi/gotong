import { useState, useEffect } from 'react';
import { useAuth } from '../authentication/AuthContext';
import Navbar from '../components/Navbar';
import axios from 'axios';
import Footer from '../components/Footer';

const Contribution = () => {
    const [contributions, setContributions] = useState({ past: [], upcoming: [], now: [] });
    const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
    const [selectedContribution, setSelectedContribution] = useState(null);

    const { user } = useAuth();

    const getContributions = async () => {
        try {
            let res = await axios.get('http://localhost:8592/api/v1/getContributions', {
                headers: {
                    'x-api-key': user.api_key,
                }
            });

            setContributions(res.data);
        } catch (error) {
            console.error('Error getting contributions:', error.message);
            alert("Failed to get contributions");
        }
    };

    const verifyContribution = async () => {

        getLocation();

        if (location.latitude === 0 && location.longitude === 0) {
            alert("Failed to get location, click again or refresh!");
            return;
        }

        try {
            let res = await axios.post('http://localhost:8592/api/v1/verifyContribution',
                {

                },
                {
                    headers: {
                        'x-api-key': user.api_key,
                        'latitude': location.latitude,
                        'longitude': location.longitude,
                        'activity_id': selectedContribution.activity_id
                    }
                }
            );

            if (res.status === 200) {
                if (res.data === true) {
                    alert("Successfully verified contribution");
                    getContributions();
                    return;
                }

                if (res.data.error === 'Already verified') {
                    alert('Alerady Verified');
                    return;
                }

                if (res.data === false) {
                    alert("Failed to verify contribution, check your location");
                    return;
                }
            }
        } catch (error) {
            console.error('Error verifying contribution:', error.message);
            alert("Failed to verify contribution");
        }
    };

    const getLocation = async () => {
        navigator.geolocation.getCurrentPosition((position) => {
            setLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        });
    };

    useEffect(() => {
        getContributions();
    }, []);

    return (
        <div className='min-h-screen bg-white'>
            <Navbar user={user} />
            <div className='container mx-auto mt-6 p-4 sm:p-8'>
                <h1 className='text-xl sm:text-3xl font-semibold text-black'>Your Contributions</h1>
                <p className='text-gray-500 text-md sm:text-xl font-light mt-2'>View your contributions</p>

                {selectedContribution && (
                    <button onClick={verifyContribution} className='mt-4 p-2 bg-blue-500 text-white rounded'>
                        Verify Contribution
                    </button>
                )}

                {['now', 'past', 'upcoming'].map((category) => (
                    <div key={category}>
                        <h2 className='text-lg sm:text-2xl font-semibold text-black capitalize'>{category}</h2>
                        <ul>
                            {contributions[category].length > 0 ? (
                                contributions[category].map((contribution, index) => (
                                    <li key={index} onClick={() => category === 'now' ? setSelectedContribution(contribution) : null} className={`flex items-center justify-between p-2 border-b border-gray-200 cursor-pointer`}>
                                        <img src={contribution.images_thumb} alt={contribution.activity_name} className='w-16 h-16' />
                                        <p className='text-black'>{contribution.activity_name}</p>
                                        <p className='text-black'>{new Date(contribution.date_action).getDate()}/{new Date(contribution.date_action).getMonth() + 1}/{new Date(contribution.date_action).getFullYear()}</p>
                                    </li>
                                ))
                            ) : (
                                <li>No {category} contributions</li>
                            )}
                        </ul>
                    </div>
                ))}
            </div>
            <Footer />
        </div>
    );
}

export default Contribution;
