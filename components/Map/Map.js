import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import('react-leaflet').then((mod) => mod.TileLayer),
    { ssr: false }
);
const Marker = dynamic(
    () => import('react-leaflet').then((mod) => mod.Marker),
    { ssr: false }
);

const Map = ({ latitude, longitude, zoom = 13, height }) => {
    const [L, setL] = useState(null);

    useEffect(() => {
        import('leaflet').then((L) => {
            setL(L);
            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: '/images/pin-48.svg',
                iconUrl: '/images/pin-48.svg',
                shadowUrl: '/images/marker-shadow.png'
            });
        });
    }, []);

    const openMaps = () => {
        window.open(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`, '_blank');
    }

    if (!L) return null;

    return (
        <div className="relative rounded-xl overflow-hidden shadow-lg">
            <MapContainer
                center={[latitude, longitude]}
                zoom={zoom}
                style={{ height: height, width: '100%' }}
                className="z-0"
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[latitude, longitude]} />
            </MapContainer>
            <div className="absolute top-0 right-0 z-30 m-4">
                <button
                    onClick={openMaps}
                    className="bg-green-400 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                    Google Maps
                </button>
            </div>
        </div>
    );
};

export default Map;