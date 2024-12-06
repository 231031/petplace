import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import UploadImage from "../components/UploadImage";
import { UploadRes, ProfileRes } from "@/types/response";
import { GetProfileByID, UpdateProfile } from "@/helper/profile";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from 'leaflet';
import "leaflet-control-geocoder";
import toast, { Toaster } from "react-hot-toast";

const HotelDetailPage = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<ProfileRes | null>(null);
    const [hotelName, setHotelName] = useState("");
    const [address, setAddress] = useState("");
    const [detail, setDetail] = useState("");
    const [email, setEmail] = useState("");
    const [checkin, setCheckin] = useState("");
    const [checkout, setCheckout] = useState("");
    const [paypalEmail, setPaypalEmail] = useState("");
    const [facilities, setFacilities] = useState<string[]>([]);
    const [newFacility, setNewFacility] = useState("");
    const [images, setImages] = useState<UploadRes[]>([]);
    const [position, setPosition] = useState<[number, number] | null>(null);
    const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null); // Track marker position
    const [geoError, setGeoError] = useState<string | null>(null); // Geolocation error
    const [searchedPosition, setSearchedPosition] = useState<[number, number] | null>(null); // Position from search or click

    // Fetch profile data when component mounts
    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login");
        } else if (localStorage.getItem("role") && localStorage.getItem("role") !== "hotel") {
            navigate("/")
        }
        const fetchProfile = async () => {
            try {
                const userId = localStorage.getItem('userId') || '';
                const res = await GetProfileByID(parseInt(userId), "hotel");
                setProfile(res);
                setHotelName(res.profile.name || "");
                setAddress(res.profile.address || "");
                setEmail(res.profile.email || "");
                setCheckin(res.profile.check_in || "");
                setCheckout(res.profile.check_out || "");
                setPaypalEmail(res.profile.paypal_email || "");
                setSearchedPosition([res.profile.latitude || 13.736717, res.profile.longitude || 100.523186]);
                setFacilities(Array.isArray(res.profile.facility_array) ? res.profile.facility_array : []);
                setImages(res.profile.image_array ? res.profile.image_array.map((url) => ({ fileUrl: url, filePath: '', accountId: '0' })) : []);
                setDetail(res.profile.detail || "");
            } catch (err) {
                toast.error("Failed to fetch profile");
                console.error(err);
            }
        };
        fetchProfile();
    }, []);

    // Handle adding a new facility
    const handleAddFacility = () => {
        if (newFacility && !facilities.includes(newFacility)) {
            setFacilities([...facilities, newFacility]);
            setNewFacility("");
        }
    };

    // Geocoder component to search for locations
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

    // Marker component to display selected location
    const LocationMarker = () => {
        const map = useMap();

        useMapEvents({
            click(e) {
                setSearchedPosition([e.latlng.lat, e.latlng.lng]); // Store clicked position
            },
        });
        useEffect(() => {
            if (searchedPosition) {
                map.setView(searchedPosition, 13); // Set the map view to the marker's position
            }
        }, [searchedPosition, map]);
        return (
            <Marker position={searchedPosition || [13.736717, 100.523186]}>
                <Popup>Selected Location</Popup>
            </Marker>
        );
    };

    // Handle removing a facility
    const handleRemoveFacility = (facility: string) => {
        setFacilities(facilities.filter((item) => item !== facility));
    };

    // Handle image upload
    const handleImageUpload = (uploadedFiles: UploadRes[]) => {
        setImages(prev => [...prev, ...uploadedFiles].slice(0, 10));
    };

    // Handle image removal
    const handleRemoveImage = (index: number) => {
        const updatedImages = images.filter((_, imgIndex) => imgIndex !== index);
        setImages(updatedImages);
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!profile) {
            toast.error("Profile not loaded");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const payload = {
                id: profile.profile.id,
                user_id: profile.profile.user_id,
                name: hotelName,
                address: address,
                email: email,
                paypal_email: paypalEmail,
                check_in: checkin,
                check_out: checkout,
                latitude: searchedPosition[0] || 0,
                longitude: searchedPosition[1] || 0,
                role: "hotel",
                tel: profile.profile.tel || "",
                facility_array: facilities,
                detail: detail,
                image_array: images.map((image) => image.fileUrl),
            };

            const res = await UpdateProfile(payload);
            toast.success(res);
        } catch (err: any) {
            if (err) {
                toast.error(err)
            }
        }
    };

    return (
        <div className="bg-bg">
            <Toaster position="top-center" reverseOrder={false} />
            <div className="flex justify-center pb-10">
                <div className="flex w-3/4 items-center flex-col gap-y-2">
                    <div className="pt-10 space-x-1">
                        <button
                            className="bg-[#FFFBF5] border shadow-lg h-10 w-20 rounded-md text-navbar"
                            onClick={() => navigate('/hotelhome')}>
                            View
                        </button>
                        <button className="text-white bg-nextstep border shadow-lg h-10 w-20 rounded-md">Edit</button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-y-6 p-6 w-full max-w-4xl mx-auto">
                <div className="relative mb-8">
                    <div className="absolute top-0 left-0 flex justify-center gap-x-4">
                        <button className="text-white text-xl bg-nextstep p-3 rounded-lg">Hotel detail</button>
                        <button className="text-gray-500 bg-egg border shadow-lg py-1 px-2 rounded-lg"
                            onClick={() => navigate('/room/edit')}>Room detail</button>
                    </div>
                </div>
                {/* Form */}
                <div className="bg-bg p-4 rounded-lg shadow-lg flex flex-col gap-y-6">
                    {/* Hotel Name and Address */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Hotel Name</label>
                            <input
                                type="text"
                                value={hotelName}
                                onChange={(e) => setHotelName(e.target.value)}
                                placeholder="Hotel Name"
                                className="w-full bg-[#FFFBF5] border border-gray-400 rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Ex. city, state or province, country, and postal code"
                                className="w-full bg-[#FFFBF5] border border-gray-400 rounded-md p-2"
                            />
                        </div>
                    </div>

                    {/* Description and Map */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                value={detail}
                                onChange={(e) => setDetail(e.target.value)}
                                placeholder="Briefly explain"
                                className="w-full bg-[#FFFBF5] border border-gray-400 rounded-md p-2 h-20"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Select on map</label>
                            {geoError && <div>{geoError}</div>}
                            <MapContainer
                                center={position || [13.736717, 100.523186]}
                                zoom={13}
                                style={{ height: '100%', width: '100%' }}
                            >
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <LocationMarker />
                                <MapWithGeocoder />
                            </MapContainer>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Hotel personal email"
                                className="w-full bg-[#FFFBF5] border border-gray-400 rounded-md p-2"
                            />
                        </div>
                    </div>

                    {/* Email and Paypal Email */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex col-span-1 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Check-in</label>
                                <input
                                    type="time"
                                    value={checkin}
                                    onChange={(e) => setCheckin(e.target.value)}
                                    className="w-full bg-[#FFFBF5] border border-gray-400 rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Check-out</label>
                                <input
                                    type="time"
                                    value={checkout}
                                    onChange={(e) => setCheckout(e.target.value)}
                                    className="w-full bg-[#FFFBF5] border border-gray-400 rounded-md p-2"
                                />
                            </div>
                        </div>
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700">Paypal email</label>
                            <input
                                type="email"
                                value={paypalEmail}
                                onChange={(e) => setPaypalEmail(e.target.value)}
                                placeholder="Paypal email for payment method"
                                className="w-full bg-[#FFFBF5] border border-gray-400 rounded-md p-2"
                            />
                        </div>
                    </div>

                    {/* Hotel Overall Picture */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Hotel Overall Picture (Max. 10)</label>
                        <div className="flex bg-[#FFFBF5] border border-gray-400 p-1 rounded-md items-center gap-4 flex-wrap">
                            {images.map((image, index) => (
                                <div
                                    key={index}
                                    className="relative w-20 h-20 bg-gray-200 rounded-md overflow-hidden flex justify-center items-center"
                                >
                                    <img
                                        src={image.fileUrl}
                                        alt={`Uploaded ${index}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-1 right-1 bg-navbar text-white text-xs rounded-lg px-1"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            <UploadImage
                                limit={10 - images.length}
                                onComplete={handleImageUpload}
                            />
                        </div>
                    </div>

                    {/* Facilities */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Facility for every room</label>
                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={newFacility}
                                onChange={(e) => setNewFacility(e.target.value)}
                                placeholder="Add new facility"
                                className="w-full bg-[#FFFBF5] border border-gray-300 rounded-md p-2"
                            />
                            <button
                                onClick={handleAddFacility}
                                className="bg-nextstep text-white px-4 py-2 rounded-md"
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {facilities.map((facility, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 bg-[#FFFBF5] border border-gray-300 px-4 py-2 rounded-md"
                                >
                                    <span className="text-gray-500">{facility}</span>
                                    <button
                                        onClick={() => handleRemoveFacility(facility)}
                                        className="text-gray-500"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-center items-center">
                <div className="flex justify-center w-1/2 pt-4 pb-16">
                    <button
                        onClick={handleSubmit}
                        className="bg-nextstep text-white w-1/4 py-2 rounded-2xl mt-4"
                    >
                        Save
                    </button>
                </div>
            </div>

        </div>
    );
};

export default HotelDetailPage;