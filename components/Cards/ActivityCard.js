import { useState, useEffect } from "react";

const ActivityCard = ({ activity }) => {
    return (
        <div>
            <div class="md:px-10 px-4 py-6 font-[sans-serif]">
                <div class="container mx-auto">
                    <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-8">


                        {activity.map((activity) => (
                            <div class="max-w-sm mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                                <div class="relative h-52">
                                    <img class="w-full h-full object-cover" src="https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full/catalog-image/103/MTA-94803924/oem_oem_full01.jpg" alt="Kolam Ikan Ikonik Tangerang" />
                                    <div class="absolute bottom-2 right-2 bg-slate-400 text-xs font-semibold px-2 py-1 rounded">
                                        {Math.ceil(activity.distance / 1000)} km
                                    </div>
                                    <div class="absolute top-2 left-2 bg-blue-400 text-xs font-semibold px-2 py-1 rounded">
                                        {activity.type}
                                    </div>
                                </div>
                                <div class="p-6 flex flex-col">
                                    <h2 class="text-xl font-bold text-gray-900 mb-2">{activity.activity_name}</h2>
                                    <div class="mt-auto">
                                        <p class="text-gray-600 text-sm mb-4">Kolam ikan ini adalah peninggalan bersejarah dari zaman megalitikum</p>
                                        <div class="flex justify-between items-center mb-4">
                                            <span class="text-sm text-gray-500">{activity.total_join || 0} people joined</span>
                                            <span class="text-sm text-gray-500">{activity.city}</span>
                                        </div>
                                        <div class="flex space-x-2">
                                            {activity.status === 'active' ? (
                                                <button class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium">Active</button>
                                            ) : (
                                                <button class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium">Inactive</button>
                                            )}
                                            <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">View</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>

            </div>
        </div>
    );

}

export default ActivityCard;