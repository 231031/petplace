import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InputBox from '../../components/CreateProfile/InputBox';
import Button from '../../components/LoginSignup/Button';
import UploadImage from "@/components/CreateProfile/UploadImage";
import { UploadRes } from '@/types/response';
import MapView from '@/components/CreateProfile/Map'; // Assuming you have a map component
import toast, { Toaster } from 'react-hot-toast';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.js';
import { useMap } from 'react-leaflet';

function CreateProfile() {
    // State to manage form data
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

    // State to manage error messages
    const [error, setError] = useState(''); // Form error
    const [successMessage, setSuccessMessage] = useState(''); // Success message
    const [image, setImage] = useState<string | null>(null); // Store one image URL or null

    const navigate = useNavigate();
    const UserId = localStorage.getItem('userId') ?? '';
    const token = localStorage.getItem('token');

    // Map component with geocoder
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

    // Handle form input changes and save to localStorage
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const updatedFormData = { ...formData, [name]: value };
        setFormData(updatedFormData);
        localStorage.setItem('formData', JSON.stringify(updatedFormData)); // Save to localStorage
    };

    // Load form data from localStorage when component mounts
    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login");
        }

        const savedFormData = localStorage.getItem('formData');
        if (savedFormData) {
            setFormData(JSON.parse(savedFormData)); // Load saved data on page load
        }
    }, []);

    // Handle image upload
    const handleImageUpload = (uploadedFiles: UploadRes[]) => {
        if (uploadedFiles.length > 0) {
            const uploadedUrl = uploadedFiles[0].fileUrl; // Get the first image's URL
            setImage(uploadedUrl); // Store the URL
            localStorage.setItem('image', uploadedUrl); // Save image URL to localStorage
        }
    };

    // Handle image removal
    const handleRemoveImage = () => {
        setImage(null); // Clear the image when removed
        localStorage.removeItem('image'); // Remove image from localStorage
    };

    // Get selected position from localStorage
    var selectedPosition = localStorage.getItem('selectedLocation');
    var parsedLocation = JSON.parse(selectedPosition) || [];

    // Handle form submission
    const handleSignup = async () => {
        const userId = parseInt(UserId, 10);
        if (isNaN(userId)) {
            setError('Invalid User ID');
            return;
        }
        const payload = {
            address: formData.address,
            avg_review: 0,
            check_in: 'string',
            check_out: 'string',
            email: formData.email,
            facility: 'string',
            facility_array: ['string'],
            id: 0,
            image_profile: image,
            latitude: parseFloat(parsedLocation[0]), // Latitude from formData
            longitude: parseFloat(parsedLocation[1]), // Longitude from formData
            name: formData.profileName,
            payment: formData.paypal,
            paypal_email: formData.paypal,
            role: formData.profileType,
            tel: formData.tel,
            user_id: userId,
        };

        try {
            const response = await fetch('http://localhost:5000/api/profile/create', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setSuccessMessage('Signup successful! Redirecting...');
                setTimeout(() => {
                    localStorage.removeItem('formData'); // Clear saved form data on success
                    localStorage.removeItem('image'); // Clear image data on success
                    navigate('/hotelhome');
                }, 2000);
            } else {
                const errorData = await response.json();
                setError(errorData || 'Signup failed');
                toast.error(errorData)
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        }
    };

    // Handle click to navigate to full map
    const handleClickFullMap = () => {
        navigate('/FullMap');
    };

    return (
        <div className="h-screen flex">
            <Toaster position='top-center' reverseOrder={false}></Toaster>
            <div className="flex justify-center bg-bgLogin w-full items-baseline">
                <div className="flex flex-col items-center w-1/4 gap-y-5 pt-24">
                    <h1 className="text-3xl">Create Profile</h1>
                    <p>Fill the form to Create your Profile</p>
                    <div className="flex justify-center mt-10">
                        {image ? (
                            <div className="relative w-36 h-36 bg-gray-200 rounded-full flex justify-center items-center mr-2">
                                <div className=' overflow-hidden rounded-full'>
                                    <img
                                        src={image}
                                        alt="Uploaded Image"
                                        className="w-full h-full object-cover "
                                    />
                                </div>
                                <button
                                    onClick={handleRemoveImage}
                                    className="absolute top-1 right-1  bg-red-500 text-white text-xs rounded-full text-2xl size-7"
                                >
                                    x
                                </button>
                            </div>
                        ) : (
                            <div className="relative w-20 h-20 bg-gray-200 rounded-full flex justify-center items-center cursor-pointer">
                                <UploadImage limit={1} onComplete={handleImageUpload} />
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
                                className="rounded-lg w-52 text-yellow border border-2 border-bg hover:border-yellow focus:border-yellow focus:outline-none focus:border-yellow focus:ring-1 focus:ring-yellow h-12"
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
                    <div className="flex w-full  gap-x-3">
                        <div className="flex flex-wrap flex-col gap-y-5 gap-x-5  pl-5 mb-5  w-1/2 ">
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
                        </div>
                        <div className="flex flex-col gap-y-2 w-full pl-5">
                            <p>Address</p>
                            <div className="flex gap-x-5">
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="flex rounded-lg text-yellow border border-2 border-bg hover:border-yellow focus:border-yellow focus:outline-none focus:border-yellow focus:ring-1 focus:ring-yellow h-20 w-full p-2"
                                    style={{ resize: 'none', overflowY: 'auto' }}
                                />
                            </div>

                            <MapView
                                latitude={parsedLocation[0]}
                                longitude={parsedLocation[1]}
                            />

                            <div className="h-12 w-full mb-5 rounded-lg bg-onstep hover:bg-nextstep cursor-pointer text-white flex justify-center items-center" onClick={handleClickFullMap}>
                                Select Position
                            </div>
                        </div>
                    </div>
                    {error && <div className="text-red-500 mt-3">{error}</div>}
                    {successMessage && <div className="text-green-500 mt-3">{successMessage}</div>}
                    <Button onClick={handleSignup} label='Create'> </Button>
                </div>
            </div>
        </div>
    );
}

export default CreateProfile;