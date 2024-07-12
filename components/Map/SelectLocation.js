import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import AsyncSelect from 'react-select/async';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import getCityByCoordinates from '../../utils/GetCity';

const MapWithNoSSR = dynamic(() => import('./MapComponent'), {
    ssr: false
});

const SelectLocation = ({ onSelect }) => {
    const [position, setPosition] = useState({ lat: 51.505, lng: -0.09 });
    const [userPosition, setUserPosition] = useState({ lat: 0, lng: 0 });
    const [address, setAddress] = useState('');

    useEffect(() => {
        getUserLocation();
    }, []);

    const getUserLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    updatePosition(latitude, longitude);
                    setUserPosition({ lat: latitude, lng: longitude });
                },
                () => {
                    alert('Cannot Proceed');
                }
            );
        } else {
            console.log("Geolocation is not available");
        }
    };

    const updatePosition = (lat, lng) => {
        setPosition({ lat, lng });
        reverseGeocode(lat, lng);
    };

    const reverseGeocode = async (lat, lng) => {
        try {
            const response = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            setAddress(response.data.display_name);
            onSelect({ latitude: lat, longitude: lng, address: response.data.display_name, city: response.data.address.city_district || response.data.address.city || response.data.address.county });
        } catch (error) {
            console.error('Error reverse geocoding:', error);
        }
    };

    const getDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the Earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in km
        return distance;
    };

    const deg2rad = (deg) => {
        return deg * (Math.PI / 180);
    };

    const handleMapClick = (e) => {
        const { lat: clickedLat, lng: clickedLng } = e.latlng;
        const { lat: currentLat, lng: currentLng } = userPosition;

        const distance = getDistance(currentLat, currentLng, clickedLat, clickedLng);

        if (distance > 1) {
            alert("Positions cannot be more than 1km apart.");
            return;
        }

        updatePosition(clickedLat, clickedLng);
    };

    const loadOptions = async (inputValue) => {
        if (inputValue.length < 3) return [];

        try {
            const response = await axios.get(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(inputValue)}`
            );
            return response.data.map(place => ({
                value: { lat: parseFloat(place.lat), lng: parseFloat(place.lon) },
                label: place.display_name
            }));
        } catch (error) {
            console.error('Error searching places:', error);
            return [];
        }
    };

    const handleSelectChange = (selectedOption) => {
        if (selectedOption) {
            const { lat, lng } = selectedOption.value;
            const { lat: currentLat, lng: currentLng } = userPosition;

            const distance = getDistance(currentLat, currentLng, lat, lng);

            if (distance > 1) {
                alert("Positions cannot be more than 1km apart.");
                return;
            }

            updatePosition(lat, lng);
        }
    };

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

    return (
        <div className="map-selector w-full mx-auto p-2 ">
            <div className="mb-8 relative z-50">
                <AsyncSelect
                    loadOptions={loadOptions}
                    onChange={handleSelectChange}
                    placeholder="Search for a place..."
                    className="text-sm text-black z-50"
                    classNamePrefix="select"
                    styles={reactSelectStyle}
                />
            </div>
            <div className="h-96 rounded-lg overflow-hidden shadow-lg z-10">
                <MapWithNoSSR position={position} onMapClick={handleMapClick} />
            </div>
            <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow">
                <p className="text-sm font-semibold text-gray-700 mb-2">Selected Location:</p>
                <p className="text-sm text-gray-600 mb-1">{address}</p>
                <button className="text-sm text-blue-500 hover:underline" onClick={getUserLocation}>Use my current location</button>
            </div>
        </div>
    );
}

export default SelectLocation;
