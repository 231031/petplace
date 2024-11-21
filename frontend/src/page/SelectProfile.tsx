import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import Button from '../components/LoginSignup/Button';

export default function SelectProfile() {
  const navigate = useNavigate();

  const SignupClick = () => {
    navigate('/Signup'); // นำทางไปยังหน้า /signin
};


const [hotel, setHotel] = useState({
        name: "",
        email: "",
        check_in:"",
        check_out:"",
        facility_array: "",
        avg_review:"",
        image_array:[],
        image_profile: "",
        role:""
    }
    );
    const id = localStorage.getItem("userId");
    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch(`http://localhost:5000/api/profile/${id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch data");
                return response.json();
            })
            .then((data) => {
                console.log("Fetched hotel data:", data);
                setHotel(data[0]) // ตรวจสอบข้อมูลที่ดึงมาจาก API
                
            })
            .catch((error) => console.error("Error fetching hotel data:", error));
    }, []);

    
  // Function to handle click on the circular button
  const handleClick = () => {
    navigate('/HotelHome'); // Replace '/another-page' with the desired path
  };

  return (
    <div className="h-screen flex">
      {/* container left */}
      <div className="flex justify-center bg-bgLogin w-full items-baseline">
        <div className="flex flex-col items-center w-1/2 gap-y-5 pt-64">
        <h1 className="text-5xl mb-10">Select Profile</h1>
        <div className='flex gap-x-10'>
                {/* Circular Button with Logo */}
                <div className='flex flex-col'>
                    <div
                    className="size-48 rounded-full flex items-center justify-center cursor-pointer overflow-auto border-8 border-white hover:border-navbar"
                    onClick={handleClick}
                    >
                        <img
                            src={hotel.image_profile} // รูปภาพแรกใน array
                            alt="Hotel"
                            className="w-full h-full object-cover"
                            />
                        
                    </div>
                    <p className='flex  justify-center mt-5'>{hotel.role}</p>
                </div>
                
                
                <div className='flex flex-col'>
                    <div
                    className="size-48 rounded-full  flex items-center justify-center cursor-pointer overflow-auto border-8 border-white hover:border-navbar"
                    onClick={handleClick}
                    >
                        <img
                            src={hotel.image_profile} // รูปภาพแรกใน array
                            alt="Hotel"
                            className="w-full h-full object-cover"
                            />
                        
                    </div>
                    <p className='flex  justify-center mt-5'>{hotel.role}</p>
                </div>

                {/* Additional content */}
                        </div>
                        
          
        </div>
      </div>

      {/* container right */}
      {/* <div
        className="flex justify-center w-1/4 items-baseline bg-cover bg-center"
        style={{ backgroundImage: "url('/images/loginbg.png')" }}
      >
        <div className="flex flex-col items-center w-1/2 pt-80 gap-y-5 text-white">
          <h1 className="text-3xl">New Here ?</h1>
          <p>Sign up and explore a petplace</p>
          <Button label='Sign up' onClick={SignupClick} />
        </div>
      </div> */}
    </div>
  );
}
