import React, { useState, useEffect } from "react";
import axios from "axios";
import UploadImage from "@/components/CreateProfile/UploadImage";

export default function MyProfile() {
    const [profile, setProfileData] = useState<any>(null); // เก็บข้อมูลโปรไฟล์
    const [isLoading, setIsLoading] = useState<boolean>(true); // แสดงสถานะการโหลด
    const [isEditing, setIsEditing] = useState<boolean>(false); // โหมดแก้ไข
    const [formData, setFormData] = useState<any>({
        name: "",
        surname: "",
        email: "",
        dob: "",
        citizenId: "",
        phone: "",
    });

    const token = localStorage.getItem('token');
    const id = localStorage.getItem('userId');

    // ดึงข้อมูลโปรไฟล์จาก API
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/profile/${id}`, {
                    headers: {
                        "accept": "application/json",
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const data = response.data[0];
                setProfileData(data);
                setFormData({
                    name: data.name,
                    surname: data.surname,
                    email: data.email,
                    dob: data.dob,
                    citizenId: data.citizenId,
                    phone: data.phone,
                });
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // จัดการการอัปโหลดรูปภาพใหม่
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    

    // สลับโหมดแก้ไข
    const toggleEditMode = () => setIsEditing(!isEditing);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-bg">
            <div className="flex gap-x-5 w-3/5 ">
                    <button className="h-16 text-gray-500 hover:text-[#B3802E]  focus:text-[#B3802E] bg-bg px-5 text-xl hover:border-b-2 hover:border-[#B3802E] focus:border-b-2 focus:border-[#B3802E]">My Profile</button>
                    <button className="h-16 text-gray-500 hover:text-[#B3802E]  focus:text-[#B3802E] bg-bg px-5 text-xl hover:border-b-2 hover:border-[#B3802E] focus:border-b-2 focus:border-[#B3802E]">My Pet</button>
                    <button className="h-16 text-gray-500 hover:text-[#B3802E]  focus:text-[#B3802E] bg-bg px-5 text-xl hover:border-b-2 hover:border-[#B3802E] focus:border-b-2 focus:border-[#B3802E]">Security</button>
            </div>
            <div className="w-3/5 h-3/5 bg-bg rounded-lg shadow shadow-gray-400 mt-5">
                
                <div className=" mt-5 pr-10 flex justify-end ">
                    <div className="rounded-full bg-bg shadow shadow-gray-400 w-20 h-7 items-center flex justify-center gap-x-2 text-gray-500 cursor-pointer"
                        onClick={toggleEditMode}
                    >
                        <p>{isEditing ? "Save" : "Edit"}</p>
                        <i className="fa-regular fa-pen-to-square"></i>
                    </div>
                </div>
                <div className="mt-5  mx-20">
                    <div className="flex mt-10   gap-x-20 pl-20 items-center">
                        <div className="overflow-hidden rounded-full h-full ">
                                    <img
                                        src={profile.image_profile}
                                        // alt="Uploaded"
                                        className="size-44 object-cover"
                                    />
                        </div>

                        <div className="text-xl flex flex-col  ml-10 mr-10">
                            <p>Name</p>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="text-gray-500 rounded-lg border-gray-400 w-48 h-14 mt-5"
                                />
                            ) : (
                                <p className="text-gray-500 mt-5">{formData.name}</p>
                            )}
                        </div>

                        <div className="text-xl flex flex-col  ml-10 mr-10">
                            <p>Surname</p>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="text-gray-500 rounded-lg border-gray-400 w-48 mt-5 h-14"
                                />
                            ) : (
                                <p className="text-gray-500 mt-5">{formData.name}</p>
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
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="text-gray-500 rounded-lg border-gray-400 w-48 mt-5 h-14"
                                />
                            ) : (
                                <p className="text-gray-500 mt-5">{formData.name}</p>
                            )}
                    </div>
                    <div className="flex flex-col  text-xl w-1/2 pl-10">
                            <p>Date of birth</p>
                            
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="text-gray-500 rounded-lg border-gray-400 w-48 mt-5 h-14"
                                />
                            ) : (
                                <p className="text-gray-500 mt-5">{formData.name}</p>
                            )}
                    </div>
                
                </div>
                <div className="flex  mt-10  mx-20 flex pl-20">
                    <div className="flex flex-col  text-xl w-1/2 pl-5">
                                <p>Citizen ID</p>
                               
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="text-gray-500 rounded-lg border-gray-400 w-48 mt-5 h-14"
                                />
                            ) : (
                                <p className="text-gray-500 mt-5">{formData.name}</p>
                            )}
                        </div>
                        <div className="flex flex-col text-xl w-1/2 pl-10">
                                <p>Phone</p>
                                
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="text-gray-500 rounded-lg border-gray-400 w-48 mt-5 h-14"
                                />
                            ) : (
                                <p className="text-gray-500 mt-5">{formData.name}</p>
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
}
