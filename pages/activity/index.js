import { useRouter } from "next/router";
import { useAuth } from "../../authentication/AuthContext"
import Navbar from "../../components/Navbar"
import ImageGallery from "../../components/Image/ImageGallery";
import Slider from "../../components/Image/Slider";
import axios from "axios";
import { notFound } from "next/navigation";
import Map from "../../components/Map/Map";
import { useEffect, useState } from "react";
import Footer from "../../components/Footer";

const Index = ({ activity }) => {

    const { user } = useAuth();
    const router = useRouter();
    const [isUserAlreadyIn, setIsUser] = useState(false);

    const isUserAlready = async () => {
        try {
            let res = await axios.get('http://localhost:8592/api/v1/isUserInActivity',
                {
                    headers: {
                        'x-api-key': user.api_key,
                        'activity_id': activity.activity_id
                    }
                }
            );

            if (res.data === true) {
                setIsUser(true);
            }
        } catch (error) {
            console.error(error)
            console.error('Error joining activity:', error.message);
        }
    }

    useEffect(() => {
        if (user) {
            isUserAlready();
        }
    }, []);

    const joinActivity = async () => {

        if (!user) {
            alert('You need to sign in!')
            return;
        }


        try {
            let res = await axios.post('http://localhost:8592/api/v1/joinActivity',
                {
                    activity_id: activity.activity_id
                },
                {
                    headers: {
                        'x-api-key': user.api_key,
                        activity_id: activity.activity_id
                    }
                }
            );

            if (res.status === 200) {
                alert("Successfully joined activity");
                setIsUser(true);
                return;
            }
        } catch (error) {
            console.error('Error joining activity:', error.message);
            alert("Failed to join activity");
            return;
        }
    }

    const slideFunction = () => {

        let data = [];

        for (let i = 0; i < activity.images.length; i++) {
            let datax = {
                title: activity.activity_name,
                description: activity.description_short,
                image: activity.images[i].url
            }
            data.push(datax);
        }

        return (
            <Slider data={data} />
        );

    };

    return (
        <div>
            <Navbar user={user} />
            <div class="bg-gray-100 min-h-screen px-4">
                <header class="py-4">
                    <button class="p-2 rounded-full hover:bg-gray-700 bg-black" onClick={() => router.back()}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                </header>

                <div class="flex flex-col md:flex-row gap-4">
                    <div className="rounded-lg overflow-hidden h-96">
                        {slideFunction()}
                    </div>

                    <div class="bg-white rounded-lg shadow-md p-4 md:w-1/3 flex flex-col">
                        <div class="flex-grow">
                            <div className="mt-4 grid-cols-3 gap-2 justify-start flex">
                                <div className="col">
                                    <h3 class="font-semibold mb-2 text-black">Status</h3>
                                    {activity.status === "active" ? <span class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium">Active</span> : <span class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium">Inactive</span>}
                                </div>

                                <div className="col">
                                    <h3 class="font-semibold mb-2 text-black">Type</h3>
                                    <span class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">{activity.type}</span>
                                </div>
                            </div>

                            <div class="mt-4 grid grid-cols-3 gap-2">
                                <div>
                                    <h3 class="font-semibold text-black">Post Date</h3>
                                    <p class="text-sm  text-black">{new Date(activity.posted_date).toDateString()} {new Date(activity.posted_date).toTimeString()} </p>
                                </div>
                                <div>
                                    <h3 class="font-semibold  text-black">Date Action</h3>
                                    <p class="text-sm  text-black">{new Date(activity.date_action).toDateString()} {new Date(activity.date_action).toTimeString()} </p>
                                </div>
                                <div>
                                    <h3 class="font-semibold text-black">Joined</h3>
                                    <p class="text-sm  text-black">{activity.total_join}</p>
                                </div>
                                <div class="mt-4">
                                    <h3 class="font-semibold  text-black">Location</h3>
                                    <p class="text-sm text-black">{activity.city}</p>
                                </div>
                                <div class="mt-4">
                                    <h3 class="font-semibold text-black">Address</h3>
                                    <p class="text-sm text-black">{activity.location.address}</p>
                                </div>
                            </div>
                        </div>

                        {!isUserAlreadyIn ? (
                            <button class="w-full bg-gray-600 text-white py-2 rounded-lg mt-6 hover:bg-gray-700 transition duration-300" onClick={joinActivity}>
                                Join This Activity
                            </button>
                        ) : (
                            <button class="w-full bg-gray-600 text-white py-2 rounded-lg mt-6 hover:bg-gray-700 transition duration-300">
                                You're in! Thank you
                            </button>
                        )}
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow-md p-4 mt-4">
                    <div class="flex items-center mb-4">
                        <img src="#" alt="user avatar" class="w-10 h-10 rounded-full mr-3" />
                        <div>
                            <h1 class="text-2xl font-bold text-black">{activity.activity_name}</h1>
                            <p class="text-gray-600">By: {activity.initiator_name}</p>
                        </div>
                    </div>

                    <h2 class="text-xl font-semibold mb-2">Description</h2>
                    <p class="text-gray-700">{activity.description_short}</p>
                    <hr class="my-4" />
                    <Map latitude={activity.location.latitude} longitude={activity.location.longitude} height={"300px"} />
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Index;

export async function getServerSideProps(context) {

    if (!context.query.id) {
        return {
            notFound: true,
        }
    }

    let data;

    const searchQuery = decodeURIComponent(context.query.id);

    let url = process.env.API_URL;
    try {
        let res = await axios.get(`${url}/getActivity`, {
            headers: {
                'activity_id': searchQuery,
            },
            params: {
                query: searchQuery,
            },
        });

        data = res.data;

    } catch (error) {
        console.error('Error fetching activities:', error.message);
        return {
            notFound: true,
        };
    }

    return {
        props: {
            activity: data
        }
    }


}