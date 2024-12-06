import React, { useState, useEffect } from "react";
import axios from "axios";
import UploadImage from "@/components/CreateProfile/UploadImage";
import { UploadRes } from '@/types/response';
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function MyProfile() {
    const [profile, setProfileData] = useState<any>(null); // เก็บข้อมูลโปรไฟล์
    const [isLoading, setIsLoading] = useState<boolean>(true); // แสดงสถานะการโหลด
    const [isEditing, setIsEditing] = useState<boolean>(false); // โหมดแก้ไข
    const [isAdding, setIsAdding] = useState<boolean>(false);

    const [currentTab, setCurrentTab] = useState<string>("MyProfile");

    const [formData, setFormData] = useState<any>(null);





    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const id = localStorage.getItem('userId');
    const [image, setImage] = useState<any>(null);
    const [petImage, setPetImage] = useState<any>(null);
    const [pet, setPetData] = useState<any>(null);
    const [allPet, setAllPet] = useState<any>(null);

    // ดึงข้อมูลโปรไฟล์จาก API
    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login");
        }
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/user/${id}`, {
                    headers: {
                        "accept": "application/json",
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const data = response.data;
                console.log("user data", data);
                setProfileData(data);
                setFormData({
                    first_name: data.first_name,
                    surename: data.surename,
                    email: data.email,
                    age: data.age,
                    citizen_id: data.citizen_id,
                    tel: data.tel,
                    image_profile: data.image_profile

                });
                setImage(data.image_profile)


            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const fetchPetData = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/user/animals/${id}`, {
                headers: {
                    "accept": "application/json",
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = response.data;
            setAllPet(data);
        } catch (error) {
            console.error("Error fetching pet data:", error);
        }
    };

    useEffect(() => {
        fetchPetData();
    }, []);


    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRemovePetImage = () => {
        setPetImage(null); // Clear the pet image from the state
        setPetData((prevPet: any) => {
            return {
                ...prevPet,
                image_array: [],
            };
        });
    };


    const handleSelectPet = (id: string) => {
        if (id != "") {
            setIsAdding(false);
            const selectedPetInfo = allPet.find((pet) => pet.id === parseInt(id));
            console.log(id);
            if (selectedPetInfo) {
                // setSelectedPet(selectedPetInfo);
                setPetData({
                    id: parseInt(id),
                    name: selectedPetInfo.name,
                    animal_type: selectedPetInfo.animal_type,
                    age: selectedPetInfo.age,
                    weight: selectedPetInfo.weight,
                    breed: selectedPetInfo.breed,
                    image: selectedPetInfo.image,
                    image_array: []
                });
                setPetImage(selectedPetInfo.image)
            }
        }
    }

    // Toggle edit mode
    const toggleEditMode = () => setIsEditing(!isEditing);

    // Save updated profile
    const handlePetImageUpload = (uploadedFiles: UploadRes[]) => {
        if (uploadedFiles.length > 0) {
            const uploadedUrl = uploadedFiles[0].fileUrl;  // Get the URL of the uploaded image

            // Ensure the uploaded image is added as the first item in the image array
            setPetImage(uploadedUrl);  // Temporarily store the first uploaded image URL

            // Add the new image URL to the pet image array at the first index
            setPetData((prevPet: any) => ({
                ...prevPet,
                image_array: [uploadedUrl, ...(prevPet.image_array || [])],  // Add to the first index
            }));
        }
    };

    const handleImageUpload = (uploadedFiles: UploadRes[]) => {
        if (uploadedFiles.length > 0) {
            const uploadedUrl = uploadedFiles[0].fileUrl;  // Get the first image's URL
            setImage(uploadedUrl);  // Store the URL
        }
    };
    const handleRemoveImage = () => {
        setImage(null); // ลบรูปภาพ

    };

    const [animalType, setAnimalType] = useState<string>(""); // ใช้ string เป็นค่าเริ่มต้น

    const handleInputChangePet = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === "animal_type") {
            setAnimalType(value); // อัปเดตค่า animal_type เมื่อมีการเลือกจาก select
        }
        setPetData((prevPet: any) => ({
            ...prevPet,
            [name]: value,
        }));
    };

    useEffect(() => {
        if (isAdding && allPet) {
            setIsAdding(false);
            const lastPetInx = allPet?.length - 1
            const lastPet = allPet ? allPet[lastPetInx] : null; // Retrieve the last pet object
            if (lastPet) {
                setPetData({
                    id: lastPet.id,
                    name: lastPet.name,
                    animal_type: lastPet.animal_type,
                    age: lastPet.age,
                    weight: lastPet.weight,
                    breed: lastPet.breed,
                    image: lastPet.image,
                    image_array: lastPet.image_array,
                });
            }
        }
    }, [allPet]);

    // Save updated pet profile
    const savePetProfile = async () => {


        try {
            const updatedPet = {
                ...pet,
                age: parseInt(pet.age),
                weight: parseFloat(pet.weight),
            };

            if (isAdding && isEditing) {
                const AddingPet = {
                    ...updatedPet,
                    user_id: parseInt(id),
                };
                const response = await axios.post(`http://localhost:5000/api/user/animals`, [AddingPet], {
                    headers: {
                        accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(response.status);
                if (response.status === 201) {
                    fetchPetData();
                    toast.success(response.data);
                    setIsEditing(false);
                } else {
                    handleSetAddingPetData();
                }

            } else {
                const response = await axios.put(`http://localhost:5000/api/user/animal/${pet.id}`, updatedPet, {
                    headers: {
                        accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    toast.success(response.data);
                    setIsEditing(false);
                    fetchPetData();
                }
            }

        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data ||
                error.message ||
                "An unknown error occurred.";

            toast.error(errorMessage);
            console.error("Error updating pet profile:", error);
        }
    };

    const handleSetAddingPetData = () => {
        setPetData({
            id: 0,
            name: "",
            animal_type: "",
            age: "",
            weight: "",
            breed: "",
            image: "",
            image_array: []
        });
        setPetImage("")
        setIsEditing(true)
        setIsAdding(true)
    };



    // Save updated user profile
    const saveProfile = async () => {

        try {
            formData.age = parseInt(formData.age)
            formData.image_profile = image
            const response = await axios.put(`http://localhost:5000/api/user/${id}`, formData, {
                headers: {
                    "accept": "application/json",
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            console.log("User profile updated:", response.data);
            // setFormData(response.data);
            setIsEditing(false); // Exit edit mode after saving
            // window.location.reload();
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };


    // สลับโหมดแก้ไข

    const renderContent = () => {
        switch (currentTab) {
            case "MyProfile":
                if (isLoading) {
                    return <div>Loading...</div>;
                }
                return (
                    <div>
                        <div className=" mt-5 pr-10 flex justify-end ">
                            <div className="rounded-full bg-bg shadow shadow-gray-400 w-20 h-7 items-center flex justify-center gap-x-2 text-gray-500 cursor-pointer"
                                onClick={isEditing ? saveProfile : toggleEditMode}
                            >
                                <p >{isEditing ? "Save" : "Edit"}</p>
                                <i className="fa-regular fa-pen-to-square"></i>
                            </div>
                        </div>
                        <div className="mt-5  mx-20">
                            <div className="flex mt-10   gap-x-20 items-center ">
                                {isEditing ? (
                                    image ? (
                                        <div className="relative flex-shrink-0 w-24 h-24 rounded-full">
                                            <div className="overflow-hidden rounded-full w-full h-full">
                                                <img
                                                    src={image}
                                                    alt="Uploaded Image"
                                                    className="w-full h-full object-cover rounded-full"
                                                />
                                            </div>
                                            <button
                                                onClick={handleRemoveImage}
                                                className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full text-2xl w-5 h-5"
                                            >
                                                x
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="relative flex-shrink-0 w-24 h-24 bg-gray-200 rounded-full flex justify-center items-center cursor-pointer">
                                            <UploadImage limit={1} onComplete={handleImageUpload} />
                                        </div>
                                    )
                                ) : (
                                    <div className="flex-shrink-0 w-24 h-24 rounded-full overflow-hidden">
                                        <img
                                            src={formData.image_profile || image}
                                            alt="Profile Image"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}

                                <div className="text-xl flex flex-col  ml-10 mr-10">
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

                                <div className="text-xl flex flex-col  ml-10 mr-10">
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
                        <div className="flex   mt-10  mx-20 flex pl-20 ">
                            <div className="flex flex-col  text-xl w-1/2 pl-5 ">
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
                            <div className="flex flex-col  text-xl w-1/2 pl-10">
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
                        <div className="flex  mt-10  mx-20 flex pl-20">
                            <div className="flex flex-col  text-xl w-1/2 pl-5">
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
                return <div>
                    <div className="flex flex-row">
                        <select
                            className="text-gray-500 bg-[#FFFBF5] border border-gray-400 p-2 rounded-lg"
                            // value={selectedPetId}
                            onChange={(e) => handleSelectPet(e.target.value)}
                        >
                            <option value="">Select Pet</option>
                            {
                                (allPet && allPet.length > 0) ? (

                                    allPet.map((pet) => (
                                        <option key={pet.id} value={pet.id}>
                                            {pet.name} : {pet.animal_type}
                                        </option>
                                    ))

                                ) : (
                                    <option>No Pet</option>
                                )
                            }

                        </select>
                        <button onClick={() => handleSetAddingPetData()}
                            className="ml-5 shadow-xl text-black px-4 py-2 rounded-md hover:bg-[#be914c]">Add Pet</button>
                    </div>

                    {
                        (pet) ? (
                            <div className="bg-bg flex flex-col items-center p-10 ">
                                <div className="w-full flex gap-x-5 rounded-lg shadow shadow-gray-400 h-48">

                                    <div className="w-1/4 h-1/4 p-3">
                                        {isEditing ? (
                                            // โหมดแก้ไข: อัปโหลดหรือลบรูปภาพ
                                            (petImage) ? (
                                                <div className="relative w-full h-44  ">
                                                    <div className="overflow-hidden  w-full h-full">
                                                        <img
                                                            src={petImage}
                                                            alt="Uploaded Image"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={handleRemovePetImage}
                                                        className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full text-2xl w-5 h-5  "
                                                    >
                                                        x
                                                    </button>
                                                </div>
                                            ) : (
                                                // อัปโหลดรูปใหม่
                                                <div className="relative w-full top-16  h-full rounded-full flex justify-center items-center cursor-pointer">
                                                    <UploadImage limit={1} onComplete={handlePetImageUpload} />
                                                </div>
                                            )
                                        ) : (
                                            // โหมดแสดงผล: แสดงรูปโปรไฟล์
                                            <div className="flex ">
                                                {
                                                    (petImage) ? (
                                                        <img
                                                            src={petImage} // ใช้รูปภาพใหม่หรือรูปภาพปัจจุบัน
                                                            alt="Profile Image"
                                                            className="size-44 "
                                                        />
                                                    ) : (
                                                        <div></div>
                                                    )
                                                }
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col text-xl  w-3/4 gap-y-5 mt-5 ">
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
                                                <p className="ml-2 text-gray-500"> {pet.name} </p>
                                            )}
                                        </div>

                                        <div className="flex gap-x-5 flex-col space-x-48  w-full h-full">
                                            <div className="flex justify-between w-full">
                                                <div className="flex flex-col items-center gap-y-5 w-full">

                                                    <div className="flex gap-y-10  w-full">
                                                        <div className="flex w-1/2 ">
                                                            <p>Pet Type: </p>
                                                            {isEditing ? (
                                                                <select
                                                                    name="animal_type"
                                                                    value={pet.animal_type}
                                                                    onChange={handleInputChangePet}
                                                                    className="flex text-xs text-gray-500 rounded-lg border-gray-400 w-28 ml-2 h-8"
                                                                >
                                                                    <option value="" disabled>
                                                                        Select Pet Type
                                                                    </option>
                                                                    <option value="" disabled>Select pet type</option>
                                                                    <option value="dog">dog</option>
                                                                    <option value="cat">cat</option>
                                                                    <option value="bird">bird</option>
                                                                    <option value="ferret">ferret</option>
                                                                    <option value="rabbit">rabbit</option>
                                                                    <option value="hamster">hamster</option>
                                                                    <option value="fish">fish</option>
                                                                    <option value="chinchilla">chinchilla</option>
                                                                    <option value="hedgehog">hedgehog</option>
                                                                    <option value="sugarglider">sugar glider</option>
                                                                </select>
                                                            ) : (
                                                                <p className="ml-2 text-gray-500">{pet.animal_type}</p>
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
                                                                <p className=" ml-2 text-gray-500"> {pet.breed}</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-y-10  w-full">
                                                        <div className="flex  w-1/2">
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
                                                                <p className="ml-2  text-gray-500"> {pet.age}</p>
                                                            )}
                                                        </div>
                                                        <div className="flex w-1/2  ">
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
                                                                <p className="ml-2 text-gray-500"> {pet.weight}</p>
                                                            )}
                                                        </div>
                                                    </div>


                                                </div>
                                                <div className="flex justify-end">
                                                    <div className="rounded-full bg-bg shadow shadow-gray-400 w-20 h-7 items-center flex justify-center gap-x-2 text-gray-500 cursor-pointer m-2"
                                                        onClick={isEditing ? savePetProfile : toggleEditMode}
                                                    >
                                                        <p>{isEditing ? "Save" : "Edit"}</p>
                                                        <i className="fa-regular fa-pen-to-square"></i>
                                                    </div>
                                                </div>




                                            </div>

                                        </div>


                                    </div>

                                </div>
                            </div>
                        ) : (
                            <div className="mt-5 ont-medium">
                                Select Pet First
                            </div>
                        )
                    }

                </div >; // Empty content for now
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
                <button
                    onClick={() => setCurrentTab("MyPet")}
                    className={`h-16 px-5 text-xl ${currentTab === "MyPet"
                        ? "text-[#B3802E] border-b-2 border-[#B3802E]"
                        : "text-gray-500 hover:text-[#B3802E] hover:border-b-2 hover:border-[#B3802E]"
                        }`}
                >
                    My Pet
                </button>

            </div>
            <div className="w-3/5 h-3/5 bg-bg rounded-lg shadow shadow-gray-400 mt-5 p-5">
                <Toaster position="top-center" reverseOrder={false} />
                {renderContent()}
            </div>
        </div>
    );
}
