import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

const HotelDetailPage = () => {
    const [hotelName, setHotelName] = useState("");
    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");
    const [email, setEmail] = useState("");
    const [paypalEmail, setPaypalEmail] = useState("");
    const [facilities, setFacilities] = useState<string[]>(["Parking", "CCTV", "Grooming"]);
    const [newFacility, setNewFacility] = useState("");
    const [images, setImages] = useState<File[]>([]);
    const navigate = useNavigate();

    const handleAddFacility = () => {
        if (newFacility && !facilities.includes(newFacility)) {
            setFacilities([...facilities, newFacility]);
            setNewFacility("");
        }
    };

    const handleRemoveFacility = (facility: string) => {
        setFacilities(facilities.filter((item) => item !== facility));
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const uploadedFiles = Array.from(event.target.files);
            setImages([...images, ...uploadedFiles].slice(0, 10)); // Limit to 10 images
        }
    };

    const handleRemoveImage = (index: number) => {
        const updatedImages = images.filter((_, imgIndex) => imgIndex !== index);
        setImages(updatedImages);
    };

    const handleSubmit = () => {
        const hotelData = {
            hotelName,
            address,
            description,
            email,
            paypalEmail,
            facilities,
            images,
        };
        console.log("Saved Hotel Data:", hotelData);
    };

    return (
        <div className="bg-bg">
            <div className="flex justify-center pb-10">
                <div className="flex w-3/4 items-center flex-col gap-y-2">
                    <div className="pt-10 space-x-1">
                        <button
                            className="bg-egg h-10 w-20 rounded-md text-navbar"
                            onClick = {() => navigate('/hotelhome')}
                            >view
                        </button>  
                        <button className="text-white bg-navbar h-10 w-20 rounded-md">edit</button>   
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-y-6 p-6 w-full max-w-4xl mx-auto">
                <div className ="relative mb-8">
                    <div className="absolute top-0 left-0 flex justify-center gap-x-4">
                                <button className="text-white text-xl bg-navbar p-3 rounded-lg">Hotel detail</button>
                                <button className="text-gray-500 bg-egg py-1 px-2 rounded-lg"
                                onClick = {() => navigate('/room/edit')}>Room detail</button>
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
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Ex. city, state or province, country, and postal code"
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                    </div>

                    {/* Description and Map */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Briefly explain"
                                className="w-full border border-gray-300 rounded-md p-2 h-20"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Select on map</label>
                            <input
                                type="text"
                                placeholder="Select your location"
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                    </div>

                    {/* Email and Paypal Email */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Hotel personal email"
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Paypal email</label>
                            <input
                                type="email"
                                value={paypalEmail}
                                onChange={(e) => setPaypalEmail(e.target.value)}
                                placeholder="Paypal email for payment method"
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                    </div>

                    {/* Hotel Overall Picture */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Hotel Overall Picture (Max. 10)</label>
                        <div className="flex items-center gap-4">
                            {images.map((image, index) => (
                                <div
                                    key={index}
                                    className="relative w-20 h-20 bg-gray-200 rounded-md overflow-hidden flex justify-center items-center"
                                >
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt="Hotel"
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
                            <label className="w-20 h-20 bg-gray-200 rounded-md flex justify-center items-center cursor-pointer">
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                <span>Upload</span>
                            </label>
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
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                            <button
                                onClick={handleAddFacility}
                                className="bg-navbar text-white px-4 py-2 rounded-md"
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {facilities.map((facility, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-md"
                                >
                                    <span>{facility}</span>
                                    <button
                                        onClick={() => handleRemoveFacility(facility)}
                                        className="text-red-500"
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
                        className="bg-navbar text-white w-1/2 py-2 rounded-md mt-4"
                    >
                        Save
                    </button>
                </div>
            </div>

        </div>
    );
};

export default HotelDetailPage;
