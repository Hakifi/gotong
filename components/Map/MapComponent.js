import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

const MapComponent = ({ position, onMapClick }) => {
    const MapEvents = () => {
        useMapEvents({
            click: onMapClick,
        });
        return null;
    };

    const ChangeView = ({ center }) => {
        const map = useMap();
        useEffect(() => {
            map.setView(center);
        }, [center]);
        return null;
    };

    const customIcon = new L.Icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41]
    });

    return (
        <MapContainer
            center={position}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
        >
            <ChangeView center={[position.lat, position.lng]} />
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position} icon={customIcon} />
            <MapEvents />
        </MapContainer>
    );
};

export default MapComponent;