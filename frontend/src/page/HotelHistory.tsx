import { useLocation } from "react-router-dom";
import HotelData from "../components/Hotel-History/HotelData";
import HotelDataPass from "../components/Hotel-History/HotelDataPass";
import clsx from "clsx";
import { ClientRequest } from "http";
import { useEffect, useState } from "react";

function HotelHistory() {
  const location = useLocation();
  const selectedCage = location.state?.selectedCage;
  console.log(selectedCage);
  const token = localStorage.getItem("token");
  const storedUserId = localStorage.getItem('userId')
  console.log('ID', storedUserId)
  const [hotelServiceUsers, setHotelServiceUsers] = useState([]);
  const [error, setError] = useState(null);
  // Fetch data using async function within useEffect
  useEffect(() => {
    const fetchHotelServiceUsers = async (userId) => {
      try {
        if (!userId || !token) {
          throw new Error("Missing userId or token.");
        }

        // Define the API URL, replacing the static client ID with the dynamic userId
        const apiUrl = `http://localhost:5000/api/hotel/client/${userId}`;
  
        // Sending the fetch request
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,  // Token from localStorage
            "Content-Type": "application/json",  // Ensure content type is set to JSON
          },
        });
  
        if (!response.ok) {
          const errorDetails = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, ${errorDetails}`);
        }
  
        // Parse the response data
        const data = await response.json();
        console.log('first', data)
        setHotelServiceUsers(data);  // Set the data to state
      } catch (error) {
        setError(error.message);  // Set error state
      }
    };

    fetchHotelServiceUsers(storedUserId);  // Call the function with storedUserId
  }, []);  // Dependencies to run useEffect when userId or token changes
  // Display error if occurs
  if (error) {
    return <div>Error: {error}</div>;
  }

  function ReviewForm({ userId }) {
    const [reviewDetail, setReviewDetail] = useState('');
    const [reviewRate, setReviewRate] = useState(0);
    const [name, setName] = useState('');
    const [isNameHidden, setIsNameHidden] = useState(false);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const reviewData = {
        hotel_service_id: 0, // Update with actual value
        profile_id: 0, // Update with actual value
        review_detail: reviewDetail,
        review_rate: reviewRate,
        name: isNameHidden ? '' : name, // If name is hidden, don't send it
      };
  
      try {
        const response = await fetch(`http://localhost:5000/api/hotel/client/review/${userId}`, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reviewData),
        });
        const result = await response.json();
        console.log(result); // Handle response accordingly
      } catch (error) {
        console.error('Error:', error);
      }
    };}  


  return (
    <div className="w-full max-w-7xl mx-auto mt-10">
      {/* {hotelServiceUsers[0].id} */}

      <div className="flex justify-center items-center mb-12">
        <span className="text-2xl font-bold"> Select History Service</span>
      </div>
      <div
        // className="w-1/4 rounded-lg absolute mt-4 left-1/2 transform -translate-x-1/2 flex justify-center items-center space-x-4"
        className="w-1/4 rounded-lg absolute top-24 left-1/2 mt-10 transform -translate-x-1/2 flex justify-center items-center space-x-4"
        style={{ backgroundColor: "#A08252" }}
      >
        <a href="/" className="text-xl text-white p-2">
          Hotel
        </a>
        <a href="/" className="text-xl text-white p-2">
          Care
        </a>
        <a href="/" className="text-xl text-white p-2">
          Clinic
        </a>
        <a href="/" className="text-xl text-white p-2">
          Delivery
        </a>
      </div>

      <div className="ml-20">
        <span className="text-2xl font-bold">Upcoming</span>
        <HotelData hotelList={hotelServiceUsers}></HotelData>      </div>
      <hr className="border-black mx-40" />
      <div className="ml-20 mt-10">
        <span className="text-2xl font-bold">Passed By</span>
        <HotelDataPass hotelList={hotelServiceUsers}></HotelDataPass>
      </div>
    </div>
  );
}

export default HotelHistory;
