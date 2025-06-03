import React, { useState, useEffect } from "react";
import axios from "axios";
import UploadImage from "@/components/CreateProfile/UploadImage";
import { UploadRes } from '@/types/response';

export default function MyProfile() {
    // State to manage loading status
    const [isLoading, setIsLoading] = useState<boolean>(true);
    // State to manage edit mode
    const [isEditing, setIsEditing] = useState<boolean>(false);
    // State to manage current tab
    const [currentTab, setCurrentTab] = useState<string>("MyProfile");
    // State to manage form data
    const [formData, setFormData] = useState<any>(null);
    // State to manage profile image
    const [image, setImage] = useState<any>(null);
    // State to manage pet data
    const [pet, setPetData] = useState<any>(null);

    const token = localStorage.getItem('token');
    const id = localStorage.getItem('userId');
    const baseApi = import.meta.env.VITE_BASEAPI;

    // Fetch profile data from API
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${baseApi}/user/${id}`, {
                    headers: {
                        "accept": "application/json",
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const data = response.data;
                setFormData({
                    first_name: data.first_name,
                    surename: data.surename,
                    email: data.email,
                    age: data.age,
                    citizen_id: data.citizen_id,
                    tel: data.tel,
                });
                setImage(data.image_profile);
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // Handle input changes for profile form
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle input changes for pet form
    const handleInputChangePet = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPetData({ ...pet, [name]: value });
    };

    // Toggle edit mode
    const toggleEditMode = () => setIsEditing(!isEditing);

    // Handle profile image upload
    const handleImageUpload = (uploadedFiles: UploadRes[]) => {
        if (uploadedFiles.length > 0) {
            const uploadedUrl = uploadedFiles[0].fileUrl;  // Get the first image's URL
            setImage(uploadedUrl);  // Store the URL
        }
    };

    // Handle removing profile image
    const handleRemoveImage = () => {
        setImage(null); // Remove the image
    };

    // Save updated pet profile
    const savePetProfile = async () => {
        try {
            await axios.put(`${baseApi}/user/animal/${id}`, pet, {
                headers: {
                    "accept": "application/json",
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            setIsEditing(false); // Exit edit mode after saving
            window.location.reload();
        } catch (error) {
            console.error("Error updating pet profile:", error);
        }
    };

    // Fetch pet data from API
    useEffect(() => {
        const fetchPetData = async () => {
            try {
                const response = await axios.get(`${baseApi}/user/animal/${id}`, {
                    headers: {
                        "accept": "application/json",
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const data = response.data;
                setPetData({
                    name: data.name,
                    animal_type: data.animal_type,
                    age: data.age,
                    weight: data.weight,
                    breed: data.breed,
                });
            } catch (error) {
                console.error("Error fetching pet data:", error);
            }
        };

        fetchPetData();
    }, []);

    // Save updated user profile
    const saveProfile = async () => {
        try {
            formData.age = parseInt(formData.age);
            await axios.put(`${baseApi}/user/${id}`, formData, {
                headers: {
                    "accept": "application/json",
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            setIsEditing(false); // Exit edit mode after saving
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    // Render content based on current tab
    const renderContent = () => {
        switch (currentTab) {
            case "MyProfile":
                if (isLoading) {
                    return <div>Loading...</div>;
                }
                return (
                    <div>
                        <div className="mt-5 pr-10 flex justify-end">
                            <div className="rounded-full bg-bg shadow shadow-gray-400 w-20 h-7 items-center flex justify-center gap-x-2 text-gray-500 cursor-pointer"
                                onClick={isEditing ? saveProfile : toggleEditMode}
                            >
                                <p>{isEditing ? "Save" : "Edit"}</p>
                                <i className="fa-regular fa-pen-to-square"></i>
                            </div>
                        </div>
                        <div className="mt-5 mx-20">
                            <div className="flex mt-10 gap-x-20 pl-20 items-center">
                                {isEditing ? (
                                    // Edit mode: Upload or remove image
                                    image ? (
                                        <div className="relative w-full h-full rounded-full">
                                            <div className="overflow-hidden rounded-full w-full h-full">
                                                <img
                                                    src={image}
                                                    alt="Uploaded Image"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <button
                                                onClick={handleRemoveImage}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full text-2xl"
                                            >
                                                x
                                            </button>
                                        </div>
                                    ) : (
                                        // Upload new image
                                        <div className="relative w-full h-full bg-gray-200 rounded-full flex justify-center items-center cursor-pointer">
                                            <UploadImage limit={1} onComplete={handleImageUpload} />
                                        </div>
                                    )
                                ) : (
                                    // Display mode: Show profile image
                                    <div className="flex overflow-hidden rounded-full">
                                        <img
                                            src={image || formData.image_profile} // Use new or current image
                                            alt="Profile Image"
                                            className="size-44 object-cover rounded-full"
                                        />
                                    </div>
                                )}

                                <div className="text-xl flex flex-col ml-10 mr-10">
                                    <p>Name</p>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="first_name"
                                            value={formData.first_name}
                                            onChange={handleInputChange}
                                            className="text-gray-500 rounded-lg border-gray-400 w-48 h-14 mt-5"
                                        />
                                    ) : (
                                        <p className="text-gray-500 mt-5">{formData.first_name}</p>
                                    )}
                                </div>

                                <div className="text-xl flex flex-col ml-10 mr-10">
                                    <p>Surname</p>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="surename"
                                            value={formData.surename}
                                            onChange={handleInputChange}
                                            className="text-gray-500 rounded-lg border-gray-400 w-48 mt-5 h-14"
                                        />
                                    ) : (
                                        <p className="text-gray-500 mt-5">{formData.surename}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex mt-10 mx-20 pl-20">
                            <div className="flex flex-col text-xl w-1/2 pl-5">
                                <p>Email</p>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="text-gray-500 rounded-lg border-gray-400 w-48 mt-5 h-14"
                                    />
                                ) : (
                                    <p className="text-gray-500 mt-5">{formData.email}</p>
                                )}
                            </div>
                            <div className="flex flex-col text-xl w-1/2 pl-10">
                                <p>Age</p>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleInputChange}
                                        className="text-gray-500 rounded-lg border-gray-400 w-48 mt-5 h-14"
                                    />
                                ) : (
                                    <p className="text-gray-500 mt-5">{formData.age}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex mt-10 mx-20 pl-20">
                            <div className="flex flex-col text-xl w-1/2 pl-5">
                                <p>Citizen ID</p>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="citizen_id"
                                        value={formData.citizen_id}
                                        onChange={handleInputChange}
                                        className="text-gray-500 rounded-lg border-gray-400 w-48 mt-5 h-14"
                                    />
                                ) : (
                                    <p className="text-gray-500 mt-5">{formData.citizen_id}</p>
                                )}
                            </div>
                            <div className="flex flex-col text-xl w-1/2 pl-10">
                                <p>Phone</p>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="tel"
                                        value={formData.tel}
                                        onChange={handleInputChange}
                                        className="text-gray-500 rounded-lg border-gray-400 w-48 mt-5 h-14"
                                    />
                                ) : (
                                    <p className="text-gray-500 mt-5">{formData.tel}</p>
                                )}
                            </div>
                        </div>
                    </div>
                );
            case "MyPet":
                return (
                    <div>
                        <div className="bg-bg flex flex-col items-center p-10">
                            <div className="w-full flex gap-x-5 rounded-lg shadow shadow-gray-400 h-48">
                                <div className="w-1/4 h-1/4 p-3"></div>
                                {pet ? (
                                    <div className="flex flex-col text-xl w-3/4 gap-y-5 mt-5">
                                        <div className="flex items-center">
                                            <p>Pet Name: </p>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={pet.name}
                                                    onChange={handleInputChangePet}
                                                    className="text-gray-500 rounded-lg border-gray-400 w-28 ml-2 h-7"
                                                />
                                            ) : (
                                                <p className="ml-2"> {pet.name} </p>
                                            )}
                                        </div>
                                        <div className="flex gap-x-5 flex-col space-x-48 w-full h-full">
                                            <div className="flex flex-col items-center gap-y-5">
                                                <div className="flex gap-y-10 w-full">
                                                    <div className="flex w-1/2">
                                                        <p>Pet Type: </p>
                                                        {isEditing ? (
                                                            <input
                                                                type="text"
                                                                name="animal_type"
                                                                value={pet.animal_type}
                                                                onChange={handleInputChangePet}
                                                                className="text-gray-500 rounded-lg border-gray-400 w-28 ml-2 h-7"
                                                            />
                                                        ) : (
                                                            <p className="ml-2"> {pet.animal_type}</p>
                                                        )}
                                                    </div>
                                                    <div className="flex w-1/2">
                                                        <p> Pet Breed : </p>
                                                        {isEditing ? (
                                                            <input
                                                                type="text"
                                                                name="breed"
                                                                value={pet.breed}
                                                                onChange={handleInputChangePet}
                                                                className="text-gray-500 rounded-lg border-gray-400 w-28 ml-2 h-7"
                                                            />
                                                        ) : (
                                                            <p className=""> {pet.breed}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex gap-y-10 w-full">
                                                    <div className="flex w-1/2">
                                                        <p>Pet Age: </p>
                                                        {isEditing ? (
                                                            <input
                                                                type="text"
                                                                name="age"
                                                                value={pet.age}
                                                                onChange={handleInputChangePet}
                                                                className="text-gray-500 rounded-lg border-gray-400 w-28 ml-2 h-7"
                                                            />
                                                        ) : (
                                                            <p className="ml-2"> {pet.age}</p>
                                                        )}
                                                    </div>
                                                    <div className="flex w-1/2">
                                                        <p> Weight: </p>
                                                        {isEditing ? (
                                                            <input
                                                                type="text"
                                                                name="weight"
                                                                value={pet.weight}
                                                                onChange={handleInputChangePet}
                                                                className="text-gray-500 rounded-lg border-gray-400 w-28 ml-2 h-7"
                                                            />
                                                        ) : (
                                                            <p className="ml-2"> {pet.weight}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex w-full h-full justify-center items-center">You have no pet</div>
                                )}
                                {pet ? (
                                    <div className="flex justify-end w-1/4">
                                        <div className="rounded-full bg-bg shadow shadow-gray-400 w-20 h-7 items-center flex justify-center gap-x-2 text-gray-500 cursor-pointer m-2"
                                            onClick={isEditing ? savePetProfile : toggleEditMode}
                                        >
                                            <p>{isEditing ? "Save" : "Edit"}</p>
                                            <i className="fa-regular fa-pen-to-square"></i>
                                        </div>
                                    </div>
                                ) : (
                                    <div> </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            case "Security":
                return (
                    <div className="bg-bg w-full h-full">
                        <div className="flex flex-col p-20 w-full h-full text-xl">
                            <div className="flex flex-col w-full h-full pl-10 pt-20">
                                <p className="text-2xl text-semibold">Change password</p>
                                <div className="flex w-full h-full items-center">
                                    <div className="flex flex-col w-1/2 gap-y-5">
                                        <p>Old Password</p>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="text-gray-500 rounded-lg border-gray-400 w-5/6 h-16"
                                        />
                                    </div>
                                    <div className="flex flex-col w-1/2 gap-y-5">
                                        <p>New Password</p>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="text-gray-500 rounded-lg border-gray-400 w-5/6 h-16"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-bg">
            <div className="flex gap-x-5 w-3/5">
                <button
                    onClick={() => setCurrentTab("MyProfile")}
                    className={`h-16 px-5 text-xl ${currentTab === "MyProfile"
                        ? "text-[#B3802E] border-b-2 border-[#B3802E]"
                        : "text-gray-500 hover:text-[#B3802E] hover:border-b-2 hover:border-[#B3802E]"
                        }`}
                >
                    My Profile
                </button>
            </div>
            <div className="w-3/5 h-3/5 bg-bg rounded-lg shadow shadow-gray-400 mt-5 p-5">
                {renderContent()}
            </div>
        </div>
    );
}