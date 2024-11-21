import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import InputBox from '../components/CreateProfile/InputBox';
import Button from '../components/LoginSignup/Button';
import { useNavigate } from 'react-router-dom';
import UploadImage from "@/components/CreateProfile/UploadImage";
import { UploadRes } from '@/types/response';

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
    const [images, setImages] = useState<UploadRes[]>([]);

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

    const handleImageUpload = (uploadedFiles: UploadRes[]) => {
        // setImages(res.profile.image_array ? res.profile.image_array.map((url) => ({ fileUrl: url, filePath: '', accountId: '0' })) : []);
        setImages(prev => [...prev, ...uploadedFiles].slice(0, 10));
        
    };

    const handleRemoveImage = (index: number) => {
        const updatedImages = images.filter((_, imgIndex) => imgIndex !== index);
        setImages(updatedImages);
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
            // image: "",
            image_array: images.map((image) => image.fileUrl),
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

    

    console.log("long", formData.long);
    console.log("lat", formData.lat);



    if (!position) {
        return <div>Loading...</div>;
    }

    return (
        <div className="h-screen flex">
            {/* container left
            <div
                className="flex justify-center w-1/4 items-baseline bg-cover bg-center"
                style={{ backgroundImage: "url('/images/loginbg.png')" }}
            >
                <div className="flex flex-col items-center w-4/5 pt-64 gap-y-5 text-white">
                    <h1 className="text-3xl">Already have an account?</h1>
                    <p>Log in and explore Pet Place</p>
                    <Button label="Log in" onClick={LoginClick} />
                </div>
            </div> */}
            {/* container right */}
            <div className="flex justify-center bg-bgLogin w-full items-baseline">
                <div className="flex flex-col items-center w-1/4 gap-y-5 pt-36">
                    <h1 className="text-3xl">Create Profile</h1>
                    <p>Fill the form to Create your Profile</p>
                    <div className="flex justify-center ">
                        {images.map((image, index) => (
                            <div
                                key={index}
                                className="relative w-36 h-36 bg-gray-200 rounded-full overflow-hidden flex justify-center items-center mr-2"
                            >
                                <img
                                    src={image.fileUrl}
                                    alt={`Uploaded ${index}`}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-1"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                        {/* Show Upload button if the limit is not reached */}
                        {images.length < 1 && (
                            <div className="relative w-20 h-20 bg-gray-200 rounded-full flex justify-center items-center cursor-pointer">
                                <UploadImage
                                    limit={10 - images.length}
                                    onComplete={handleImageUpload}
                                />
                            </div>
                        )}
                        </div>
                    <div className="flex flex-row gap-x-5 gap-y-5 pl-5 pt-5 w-full items-end">
                        <div className="flex flex-col gap-y-2 w-1/2">
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
                        <div className="flex flex-col gap-y-2 w-1/2 ">
                            <p>Profile Name</p>
                            <InputBox
                                placeholder="Profile Name"
                                name="profileName"
                                value={formData.profileName}
                                onChange={handleChange}
                            />
                        </div>
                        
                    </div>
                    <div className='flex w-full '>
                        <div className="flex flex-wrap flex-col gap-y-5 gap-x-5 pl-5 mb-5  w-1/2">
                            <div className="flex flex-col gap-y-2 ">
                                <p>Email</p>
                                <InputBox
                                    placeholder="Email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex flex-col gap-y-2  ">
                                <p>Tel</p>
                                <InputBox
                                    placeholder="Tel"
                                    name="tel"
                                    value={formData.tel}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex flex-col gap-y-2  ">
                                <p>PayPal Email</p>
                                <InputBox
                                    placeholder="PayPal Email"
                                    name="paypal"
                                    value={formData.paypal}
                                    onChange={handleChange}
                                />
                            </div>
                            
                        </div>
                        <div className="flex flex-col gap-y-2 w-full pl-5 ">
                            <p>Address</p>
                            <div className="flex gap-x-5">
                                <input
                                    type="text"
                                    className="flex rounded-lg text-yellow border border-2 border-bg hover:border-yellow focus:border-yellow focus:outline-none focus:border-yellow focus:ring-1 focus:ring-yellow h-36 w-full "
                                />
                                
                            </div>
                            <div className="h-24 w-full rounded-lg">
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
                    
                    {/* <Button label="Go to Full Map" onClick={FullMapClick} /> */}
                    <Button label="Create" onClick={handleSignup} />
                </div>
            </div>
        </div>
    );
}

export default CreateProfile;
