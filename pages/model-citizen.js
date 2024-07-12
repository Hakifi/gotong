import Select from "react-select"
import { useAuth } from "../authentication/AuthContext"
import Navbar from "../components/Navbar"
import { useState, useEffect } from "react"
import Footer from "../components/Footer"
import axios from "axios"


const ModelCitizen = ({ }) => {

    const [selectedOption, setSelectedOption] = useState({ value: 'all-time', label: 'All Time' });
    const [data, setData] = useState([]);

    const { user } = useAuth();

    const reactSelectStyle = {
        control: (provided) => ({
            ...provided,
            borderColor: '#e5e7eb',
            '&:hover': {
                borderColor: '#d1d5db',
            },
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#4f46e5' : state.isFocused ? '#e5e7eb' : null,
            color: state.isSelected ? 'white' : 'black',
        }),
    };

    const getData = async () => {
        const dat = await axios.get('http://localhost:8592/api/v1/getTopRank', {
            headers: {
                'time': selectedOption.value
            }
        });
        setData(dat.data);
    }

    const handleSelectChange = (selectedOption) => {
        setSelectedOption(selectedOption);
        getData();
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <div className="w-full min-h-screen bg-white">
            <Navbar user={user} />
            <div class="max-w-4xl mx-auto p-6">
                <h1 class="text-3xl font-bold mb-4 text-black">Leaderboard</h1>

                <div class="mb-4">
                    <div class="border rounded max-w-sm px-3 py-2">
                        <Select
                            styles={reactSelectStyle}
                            onChange={handleSelectChange}
                            value={selectedOption}
                            options={[
                                { value: 'month', label: 'Monthly' },
                                { value: 'all-time', label: 'All Time' },
                            ]} />

                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div class="bg-white p-4 rounded-lg shadow text-center order-1 md:order-2">
                        <div class="relative inline-block">
                            <div class="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-2"></div>
                            <div class="absolute -top-2 -right-2 w-10 h-10 bg-[#F4AC05] rounded-full flex items-center justify-center text-black font-bold">1</div>
                        </div>
                        <h3 class="text-lg font-semibold text-black">{data[0] ? data[0].name : 'No Data'}</h3>
                        <p class="text-gray-600 font-medium">{data[0] ? data[0].username : 'No Data'}</p>
                        <p class="text-sm text-gray-500">Help {data[0] ? data[0].total_help : 0}x</p>
                    </div>

                    <div class="bg-white p-4 rounded-lg shadow text-center order-2 md:order-1">
                        <div class="relative inline-block">
                            <div class="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-2"></div>
                            <div class="absolute -top-2 -right-2 w-10 h-10 bg-[#BBD8FF] rounded-full flex items-center justify-center text-black font-bold">2</div>
                        </div>
                        <h3 class="text-lg font-semibold text-black">{data[1] ? data[1].name : 'No Data'}</h3>
                        <p class="text-gray-600 font-medium">{data[1] ? data[1].username : 'No Data'}</p>
                        <p class="text-sm text-gray-500">Help {data[1] ? data[1].total_help : 0}x</p>
                    </div>

                    <div class="bg-white p-4 rounded-lg shadow text-center order-3 md:order-3">
                        <div class="relative inline-block">
                            <div class="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-2"></div>
                            <div class="absolute -top-2 -right-2 w-10 h-10 bg-[#B47D4D] rounded-full flex items-center justify-center text-black font-bold">3</div>
                        </div>
                        <h3 class="text-lg font-semibold text-black">{data[2] ? data[2].name : 'No Data'}</h3>
                        <p class="text-gray-600 font-medium">{data[2] ? data[2].username : 'No Data'}</p>
                        <p class="text-sm text-gray-500">Help {data[2] ? data[2].total_help : 0}x</p>
                    </div>
                </div>

                <div class="space-y-3">
                    <div class="bg-white p-4 rounded-lg shadow flex items-center justify-between">
                        <div class="flex items-center">
                            <span class="font-bold mr-4 text-black">4</span>
                            <div class="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
                            <span className="text-black">{data[3] ? data[3].name : 'No Data'}</span>
                        </div>
                        <div class="flex items-center">
                            <span class="mr-4 font-medium text-black">{data[3] ? data[3].username : 'No Data'}</span>
                            <span class="text-sm text-gray-500">Help {data[3] ? data[3].total_help : 0}x</span>
                        </div>
                    </div>

                    <div class="bg-white p-4 rounded-lg shadow flex items-center justify-between">
                        <div class="flex items-center">
                            <span class="font-bold mr-4 text-black">5</span>
                            <div class="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
                            <span className="text-black">{data[4] ? data[4].name : 'No Data'}</span>
                        </div>
                        <div class="flex items-center">
                            <span class="mr-4 font-medium text-black">{data[4] ? data[4].username : 'No Data'}</span>
                            <span class="text-sm text-gray-500">Help {data[4] ? data[4].total_help : 0}x</span>
                        </div>
                    </div>

                    <div class="bg-white p-4 rounded-lg shadow flex items-center justify-between">
                        <div class="flex items-center">
                            <span class="font-bold mr-4 text-black">6</span>
                            <div class="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
                            <span className="text-black">{data[5] ? data[5].name : 'No Data'}</span>
                        </div>
                        <div class="flex items-center">
                            <span class="mr-4 font-medium text-black">{data[5] ? data[5].username : 'No Data'}</span>
                            <span class="text-sm text-gray-500">Help {data[5] ? data[5].total_help : 0}x</span>
                        </div>
                    </div>
                </div>

            </div>
            <Footer />
        </div >
    )
}

export default ModelCitizen