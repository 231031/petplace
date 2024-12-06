import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function SelectProfile() {
  const navigate = useNavigate();
  const location = useLocation();

  // State to manage profile image
  const [image, setImage] = useState(localStorage.getItem('clientImage') || '');
  // State to manage hotel data
  const [hotel, setHotel] = useState({
    name: '',
    email: '',
    check_in: '',
    check_out: '',
    facility_array: '',
    avg_review: '',
    image_array: [],
    image_profile: '',
    role: ''
  });
  // State to track fetch failure
  const [fetchFailed, setFetchFailed] = useState(false);

  const id = localStorage.getItem('userId');
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');

  // Fetch profile and hotel data when component mounts
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }

    // If image is provided in location.state, update and persist it
    if (location.state && location.state.image_profile) {
      setImage(location.state.image_profile);
      localStorage.setItem('clientImage', location.state.image_profile);
      console.log('Updated client image from location:', location.state.image_profile);
    }

    fetch(`http://localhost:5000/api/profile/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch data');
        return response.json();
      })
      .then((data) => {
        console.log('Fetched hotel data:', data);
        setHotel(data[0]);
      })
      .catch((error) => {
        console.error('Error fetching hotel data:', error);
        setFetchFailed(true); // Mark fetch as failed
      });
  }, [id, location.state]);

  // State to manage form data
  const [formData, setFormData] = useState<any>(null);

  // Fetch user profile data when component mounts
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
        setFormData({
          first_name: data.first_name,
          image_profile: data.image_profile
        });
        setImage(data.image_profile);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  // Handle click to navigate to HotelHome
  const handleClick = () => {
    navigate('/hotelhome');
  };

  // Handle click to navigate to home with client role
  const handleClickHome = () => {
    navigate('/', { state: { role: "client" } });
  };

  // Handle click to navigate to CreateProfile
  const handleCreateProfile = () => {
    navigate('/CreateProfile');
  };

  return (
    <div className="h-screen flex">
      {/* Left Container */}
      <div className="flex justify-center bg-bgLogin w-full items-baseline">
        <div className="flex flex-col items-center w-1/2 gap-y-5 pt-64">
          <h1 className="text-5xl mb-10">Select Profile</h1>
          <div className="flex gap-x-10">
            {/* Client Circle */}
            <div className="flex flex-col">
              <div
                className="size-48 rounded-full flex items-center justify-center cursor-pointer overflow-auto border-8 border-white hover:border-navbar"
                onClick={handleClickHome}
              >
                <img
                  src={image} // Image for the client
                  alt="Client"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex justify-center mt-5 gap-x-3">
                <p> Client Profile </p>
                <p className='text-white font-black'> | </p>
                <p> {username} </p>
              </div>
            </div>

            {/* Hotel Circle */}
            {!fetchFailed && (
              <div className="flex flex-col">
                <div
                  className="size-48 rounded-full flex items-center justify-center cursor-pointer overflow-auto border-8 border-white hover:border-navbar"
                  onClick={handleClick}
                >
                  <img
                    src={hotel.image_profile}
                    alt="Hotel"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex justify-center mt-5 gap-x-3">
                  <p> Hotel Owner</p>
                  <p className='text-white font-black'> | </p>
                  <p> {hotel.name} </p>
                </div>
              </div>
            )}
          </div>

          {/* Create Profile */}
          <div>
            <div
              className="bg-white p-2 mt-16 rounded-full w-46 flex text-xl justify-center items-center h-8 space-x-5 cursor-pointer hover:border hover:border-gray-400 hover:border-2"
              onClick={handleCreateProfile}
            >
              <p>Create Profile</p>
              <i className="fa-regular fa-plus" style={{ color: 'gray' }}></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}