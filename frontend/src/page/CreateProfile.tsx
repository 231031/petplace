import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import InputBox from '../components/CreateProfile/InputBox';
import Button from '../components/LoginSignup/Button';
import { useNavigate } from 'react-router-dom';
import UploadImage from "@/components/UploadImage";

function CreateProfile() {
    const [formData, setFormData] = useState({
        profileType: '',
        profileName: '',
        tel: '',
        email: '',
        address: '',
        paypal: '',
        long: '',
        lat: '',
    });
    const [error, setError] = useState(''); // Form error
    const [geoError, setGeoError] = useState<string | null>(null); // Geolocation error
    const [successMessage, setSuccessMessage] = useState('');
    const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null); // Track marker position
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const UserId = localStorage.getItem('userId') ?? '';
    const token = localStorage.getItem('token')
    

    const handleLocationChange = (lat: number, lng: number) => {
        setFormData({ ...formData, lat: lat.toString(), long: lng.toString() });
        setMarkerPosition([lat, lng]); // Update the marker position
    };

    const handleSignup = async () => {
        const userId = parseInt(UserId, 10);

        if (isNaN(userId)) {
            setError('Invalid User ID');
            return;
        }
        const payload = {
            address: formData.address,
            avg_review: 0,
            check_in: "string",
            check_out: "string",
            email: formData.email,
            facility: "string",
            facility_array: ["string"],
            id: 0,
            image: "string",
            image_array: ["string"],
            latitude: parseFloat(formData.lat), // Latitude from formData
            longitude: parseFloat(formData.long), // Longitude from formData
            name: formData.profileName,
            payment: formData.paypal,
            paypal_email: formData.paypal,
            role: formData.profileType,
            tel: formData.tel,
            user_id: userId
        };

        try {
            const response = await fetch('http://localhost:5000/api/profile/create', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setSuccessMessage('Signup successful! Redirecting...');
                setTimeout(() => navigate('/HotelHome'), 2000); // Redirect after success
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Signup failed');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        }
    };

    const LoginClick = () => {
        navigate('/Login');
    };

    const FullMapClick = () => {
        navigate('/FullMap');
    };

    const [position, setPosition] = useState<[number, number] | null>(null);
    
    const LocationMarker = () => {
        useMapEvents({
            click(e) {
                const lat = e.latlng.lat;
                const lng = e.latlng.lng;
                handleLocationChange(lat, lng); // Update formData with new lat/lng
            },
        });

        return (
            <Marker position={markerPosition || [13.736717, 100.523186]} />
        );
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setPosition([latitude, longitude]);
                    handleLocationChange(latitude, longitude); // Update formData with initial position
                },
                (err) => {
                    setError('Unable to retrieve your location.');
                    // setPosition([13.736717, 100.523186]); // Default to Bangkok if error
                }
            );
        } else {
            setError('Geolocation is not supported by this browser.');
            // setPosition([13.736717, 100.523186]); // Default to Bangkok if geolocation not supported
        }
    }, []);

    console.log("long", formData.long);
    console.log("lat", formData.lat);



    if (!position) {
        return <div>Loading...</div>;
    }

    return (
        <div className="h-screen flex">
            {/* container left */}
            <div
                className="flex justify-center w-1/4 items-baseline bg-cover bg-center"
                style={{ backgroundImage: "url('/images/loginbg.png')" }}
            >
                <div className="flex flex-col items-center w-4/5 pt-64 gap-y-5 text-white">
                    <h1 className="text-3xl">Already have an account?</h1>
                    <p>Log in and explore Pet Place</p>
                    <Button label="Log in" onClick={LoginClick} />
                </div>
            </div>
            {/* container right */}
            <div className="flex justify-center bg-bgLogin w-3/4 items-baseline">
                <div className="flex flex-col items-center w-1/2 gap-y-5 pt-36">
                    <h1 className="text-3xl">Sign Up</h1>
                    <p>Fill the form to sign up to Pet Place</p>
                    <div className="flex flex-row gap-x-5 gap-y-5 pl-5 pt-5 w-full ">
                        <div className="flex flex-col gap-y-2 w-1/3">
                            <p>Profile</p>
                            <select
                                name="profileType"
                                value={formData.profileType}
                                onChange={handleChange}
                                className="rounded-lg text-yellow border border-2 border-bg hover:border-yellow focus:border-yellow focus:outline-none focus:border-yellow focus:ring-1 focus:ring-yellow h-12 "
                            >
                                <option value="">Select profile</option>
                                <option value="hotel">Hotel</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-y-2 w-1/3">
                            <p>Profile Name</p>
                            <InputBox
                                placeholder="Profile Name"
                                name="profileName"
                                value={formData.profileName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="flex flex-col justify-end w-1/3">
                            <UploadImage limit={2} />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-y-5 gap-x-5 pl-5 mb-5">
                        <div className="flex flex-col gap-y-2">
                            <p>Email</p>
                            <InputBox
                                placeholder="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="flex flex-col gap-y-2">
                            <p>Tel</p>
                            <InputBox
                                placeholder="Tel"
                                name="tel"
                                value={formData.tel}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="flex flex-col gap-y-2">
                            <p>PayPal Email</p>
                            <InputBox
                                placeholder="PayPal Email"
                                name="paypal"
                                value={formData.paypal}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="flex flex-col gap-y-2 w-full">
                            <p>Address</p>
                            <div className="flex gap-x-5">
                                <input
                                    type="text"
                                    className="rounded-lg text-yellow border border-2 border-bg hover:border-yellow focus:border-yellow focus:outline-none focus:border-yellow focus:ring-1 focus:ring-yellow h-40 w-1/2"
                                />
                                <div className="h-40 w-1/2">
                                    {geoError && <div>{geoError}</div>}
                                    <MapContainer
                                        center={position}
                                        zoom={13}
                                        style={{ height: '100%', width: '100%' }}
                                    >
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                        <LocationMarker />
                                    </MapContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <Button label="Go to Full Map" onClick={FullMapClick} /> */}
                    <Button label="Sign up" onClick={handleSignup} />
                </div>
            </div>
        </div>
    );
}

export default CreateProfile;
