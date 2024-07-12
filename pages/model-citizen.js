import Select from "react-select"
import { useAuth } from "../authentication/AuthContext"
import Navbar from "../components/Navbar"
import { useState } from "react"


const ModelCitizen = ({ }) => {

    const [selectedOption, setSelectedOption] = useState({ value: 'all-time', label: 'All Time' });

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

    const handleSelectChange = (selectedOption) => {
        setSelectedOption(selectedOption);
    }

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
                                { value: 'weekly', label: 'Weekly' },
                                { value: 'monthly', label: 'Monthly' },
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
                        <h3 class="text-lg font-semibold text-black">Username</h3>
                        <p class="text-gray-600 font-medium">Legenda</p>
                        <p class="text-sm text-gray-500">Help 12x</p>
                    </div>

                    <div class="bg-white p-4 rounded-lg shadow text-center order-2 md:order-1">
                        <div class="relative inline-block">
                            <div class="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-2"></div>
                            <div class="absolute -top-2 -right-2 w-10 h-10 bg-[#BBD8FF] rounded-full flex items-center justify-center text-black font-bold">2</div>
                        </div>
                        <h3 class="text-lg font-semibold text-black">Username</h3>
                        <p class="text-gray-600 font-medium">Legenda</p>
                        <p class="text-sm text-gray-500">Help 11x</p>
                    </div>

                    <div class="bg-white p-4 rounded-lg shadow text-center order-3 md:order-3">
                        <div class="relative inline-block">
                            <div class="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-2"></div>
                            <div class="absolute -top-2 -right-2 w-10 h-10 bg-[#B47D4D] rounded-full flex items-center justify-center text-black font-bold">3</div>
                        </div>
                        <h3 class="text-lg font-semibold text-black">Username</h3>
                        <p class="text-gray-600 font-medium">Pahlawan</p>
                        <p class="text-sm text-gray-500">Help 7x</p>
                    </div>
                </div>

                <div class="space-y-3">
                    <div class="bg-white p-4 rounded-lg shadow flex items-center justify-between">
                        <div class="flex items-center">
                            <span class="font-bold mr-4 text-black">4</span>
                            <div class="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
                            <span className="text-black">Username</span>
                        </div>
                        <div class="flex items-center">
                            <span class="mr-4 font-medium text-black">Pahlawan</span>
                            <span class="text-sm text-gray-500">Help 6x</span>
                        </div>
                    </div>

                    <div class="bg-white p-4 rounded-lg shadow flex items-center justify-between">
                        <div class="flex items-center">
                            <span class="font-bold mr-4 text-black">5</span>
                            <div class="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
                            <span className="text-black">Username</span>
                        </div>
                        <div class="flex items-center">
                            <span class="mr-4 font-medium text-black">Pahlawan</span>
                            <span class="text-sm text-gray-500">Help 5x</span>
                        </div>
                    </div>

                    <div class="bg-white p-4 rounded-lg shadow flex items-center justify-between">
                        <div class="flex items-center">
                            <span class="font-bold mr-4 text-black">6</span>
                            <div class="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
                            <span className="text-black">Username</span>
                        </div>
                        <div class="flex items-center">
                            <span class="mr-4 font-medium text-black">Pahlawan</span>
                            <span class="text-sm text-gray-500">Help 5x</span>
                        </div>
                    </div>
                </div>

            </div>
        </div >
    )
}

export default ModelCitizen