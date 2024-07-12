import axios from "axios";
import { useAuth } from "../authentication/AuthContext";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";



const Profile = ({ activities }) => {


    const { user } = useAuth();


    return (
        <div className="bg-white min-h-screen">
            <Navbar user={user} />
            <div class="container mx-auto px-4 py-8">
                <div class="bg-white rounded-lg shadow-md overflow-hidden">

                    <div class="p-6 border-b">
                        <div class="flex items-center">
                            <img src={activities.profile_picture || ''} alt="" class="w-24 h-24 bg-gray-300 rounded-full mr-6" />
                            <div>
                                <h1 class="text-2xl font-bold text-black">{activities.name || ''}</h1>
                                <p class="text-gray-600">{activities.username || ''}</p>
                            </div>
                        </div>
                        <div class="mt-4 flex">

                            <div>
                                <span class="font-semibold text-black">Help Count  </span>
                                <span class="text-gray-600">{activities.help_count || 0}x</span>
                            </div>
                        </div>
                    </div>

                    <div class="p-6 border-b">
                        <h2 class="text-xl font-semibold mb-2 text-black">Bio</h2>
                        <textarea readOnly={true} name="bio" id="" class="bg-gray-100 h-24 rounded-md w-full focus:ring-[#27374D] focus:border-[#27374D]"></textarea>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Profile;

export async function getServerSideProps(context) {
    const searchQuery = decodeURIComponent(context.query.query);

    try {
        const url = process.env.API_URL;
        const res = await axios.get(`${url}/getUserProfileData`, {
            headers: {
                'user_id': searchQuery,
            },
            params: {
                query: searchQuery,
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