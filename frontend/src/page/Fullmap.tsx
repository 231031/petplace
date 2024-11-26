import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet-control-geocoder/dist/Control.Geocoder.js';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import { Navigate, useNavigate } from 'react-router-dom';

const FullMap = () => {
    const [position, setPosition] = useState<[number, number] | null>(null); // Current position
    const [searchedPosition, setSearchedPosition] = useState<[number, number] | null>(null); // Position from search or click
    const [error, setError] = useState<string | null>(null);

    


    useEffect(() => {
        // Fetch user's current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setPosition([latitude, longitude]);
                    setSearchedPosition([latitude, longitude]); // Default search position
                },
                () => {
                    setError('Unable to retrieve your location.');
                    setPosition([13.736717, 100.523186]); // Default to Bangkok
                    setSearchedPosition([13.736717, 100.523186]); // Default search position
                }
            );
        } else {
            setError('Geolocation is not supported by this browser.');
            setPosition([13.736717, 100.523186]);
            setSearchedPosition([13.736717, 100.523186]);
        }
    }, []);

    // Add Geocoder with search functionality
    const MapWithGeocoder = () => {
        const map = useMap();

        useEffect(() => {
            const geocoder = L.Control.geocoder({
                defaultMarkGeocode: false, // Do not mark automatically
            }).addTo(map);

            geocoder.on('markgeocode', (e) => {
                const latlng = e.geocode.center;
                setSearchedPosition([latlng.lat, latlng.lng]); // Store searched position
                map.setView(latlng, 13); // Center the map on the searched location
            });

            return () => {
                map.removeControl(geocoder);
            };
        }, [map]);

        return null;
    };

    // Add marker on user click
    const LocationMarker = () => {
        useMapEvents({
            click(e) {
                setSearchedPosition([e.latlng.lat, e.latlng.lng]); // Store clicked position
            },
        });
        return (
            <Marker position={searchedPosition || [13.736717, 100.523186]}>
                <Popup>Selected Location</Popup>
            </Marker>
        );
    };

    const CurrentLocationButton = () => {
        const map = useMap();

        useEffect(() => {
            const button = L.control({ position: 'topright' });

            button.onAdd = () => {
                const div = L.DomUtil.create('button', 'current-location-btn');
                div.innerHTML = '📍 Current Location';
                div.style.padding = '8px';
                div.style.background = '#fff';
                // div.style.border = '1px solid #ccc';
                div.style.cursor = 'pointer';
                div.style.borderRadius = '0.5rem'

                

                

                div.onclick = () => {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                            (position) => {
                                const { latitude, longitude } = position.coords;
                                setPosition([latitude, longitude]);
                                setSearchedPosition([latitude, longitude]);
                                map.setView([latitude, longitude], 13);
                            },
                            () => {
                                alert('Unable to retrieve your location.');
                            }
                        );
                    } else {
                        alert('Geolocation is not supported by this browser.');
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

    
    // Selected Location Button
    const SelectLocationButton = () => {
        const navigate = useNavigate();
        const handleConfirmLocation = () => {
            if (searchedPosition) {
                console.log('Confirmed Location:', searchedPosition);
                alert(`Location Confirmed: selected location`);
                localStorage.setItem("selectedLocation", JSON.stringify(searchedPosition))

                navigate('/createprofile');
                
                // You can send this data to a backend or use it for further processing
            } else {
                alert('No location selected!');
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

    if (!position) {
        return <div>Loading...</div>;
    }

    return (
        <div className="h-screen relative">
            <MapContainer center={searchedPosition || position} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationMarker />
                <MapWithGeocoder />
                <CurrentLocationButton />
            </MapContainer>
            <SelectLocationButton />
        </div>
    );
};

export default FullMap;
