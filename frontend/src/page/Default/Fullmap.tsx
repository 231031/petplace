import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet-control-geocoder/dist/Control.Geocoder.js';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import { useNavigate } from 'react-router-dom';

const FullMap = () => {
    // State to store user's current location
    const [position, setPosition] = useState<[number, number] | null>(null);
    // State to store location from user actions (search or click)
    const [searchedPosition, setSearchedPosition] = useState<[number, number] | null>(null);
    // State to store error messages
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Fetch user's current location on load
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                ({ coords: { latitude, longitude } }) => {
                    const userPosition = [latitude, longitude];
                    setPosition(userPosition);
                    setSearchedPosition(userPosition);
                },
                () => {
                    setError('Unable to retrieve your location. Using default.');
                    const defaultPosition: [number, number] = [13.736717, 100.523186]; // Default to Bangkok
                    setPosition(defaultPosition);
                    setSearchedPosition(defaultPosition);
                }
            );
        } else {
            setError('Geolocation is not supported by your browser.');
            const defaultPosition: [number, number] = [13.736717, 100.523186];
            setPosition(defaultPosition);
            setSearchedPosition(defaultPosition);
        }
    }, []);

    // Geocoder functionality
    const MapWithGeocoder = () => {
        const map = useMap();

        useEffect(() => {
            const geocoder = L.Control.geocoder({
                defaultMarkGeocode: false,
            }).addTo(map);

            geocoder.on('markgeocode', (e) => {
                const latlng = e.geocode.center;
                setSearchedPosition([latlng.lat, latlng.lng]);
                map.setView(latlng, 13);
            });

            return () => {
                map.removeControl(geocoder);
            };
        }, [map]);

        return null;
    };

    // Marker that updates on map click
    const LocationMarker = () => {
        useMapEvents({
            click: (e) => {
                setSearchedPosition([e.latlng.lat, e.latlng.lng]);
            },
        });

        return searchedPosition ? (
            <Marker position={searchedPosition}>
                <Popup>Selected Location</Popup>
            </Marker>
        ) : null;
    };

    // Button for navigating to the current location
    const CurrentLocationButton = () => {
        const map = useMap();

        useEffect(() => {
            const button = L.control({ position: 'topright' });

            button.onAdd = () => {
                const div = L.DomUtil.create('button', 'current-location-btn');
                div.innerHTML = '📍 Current Location';
                div.style.padding = '8px';
                div.style.background = '#fff';
                div.style.borderRadius = '5px';
                div.style.cursor = 'pointer';

                div.onclick = () => {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                            ({ coords: { latitude, longitude } }) => {
                                const currentPosition: [number, number] = [latitude, longitude];
                                setPosition(currentPosition);
                                setSearchedPosition(currentPosition);
                                map.setView(currentPosition, 13);
                            },
                            () => {
                                alert('Unable to retrieve your location.');
                            }
                        );
                    } else {
                        alert('Geolocation is not supported by your browser.');
                    }
                };

                return div;
            };

            button.addTo(map);

            return () => {
                map.removeControl(button);
            };
        }, [map]);

        return null;
    };

    // Confirm button to save selected location and navigate back
    const SelectLocationButton = () => {
        const handleConfirmLocation = () => {
            if (searchedPosition) {
                localStorage.setItem('selectedLocation', JSON.stringify(searchedPosition));
                alert('Location confirmed successfully!');
                navigate('/createprofile');
            } else {
                alert('Please select a location first.');
            }
        };

        return (
            <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-[1000]">
                <button
                    className="bg-onstep hover:bg-nextstep text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
                    onClick={handleConfirmLocation}
                >
                    Confirm Selected Location
                </button>
            </div>
        );
    };

    if (!position) return <div>Loading map...</div>;

    return (
        <div className="h-screen relative">
            <MapContainer center={searchedPosition || position} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationMarker />
                <MapWithGeocoder />
                <CurrentLocationButton />
            </MapContainer>
            <SelectLocationButton />
            {error && <div className="absolute top-4 left-4 bg-red-500 text-white p-2 rounded-lg">{error}</div>}
        </div>
    );
};

export default FullMap;