import { useLocation } from "react-router-dom";
import HotelData from "../components/Hotel-History/HotelData";
import clsx from "clsx";
import { ClientRequest } from "http";
import { useEffect } from "react";

function HotelHistory() {
  const location = useLocation();
  const selectedCage = location.state?.selectedCage;
  console.log(selectedCage);
  const token = localStorage.getItem("token");
  const storedUserId = localStorage.getItem('userId')
  console.log('ID', storedUserId)


  const fetchHotelServiceUsers = async (userId) => {
    try {
      // Retrieve the token from localStorage
      const token = localStorage.getItem("token");
  
      if (!token) {
        throw new Error("Authentication token not found. Please log in.");
      }
  
      // Check token format (for debugging purposes)
      console.log("Using Token:", token);
  
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
  
      // Check if the response status is not OK
      if (!response.ok) {
        const errorDetails = await response.text();  // Get the error response body
        throw new Error(`HTTP error! status: ${response.status}, ${errorDetails}`);
      }
  
      // Parse the response data
      const data = await response.json();
      console.log("Hotel Service Users:", data);
      return data;
    } catch (error) {
      console.error("Error fetching hotel service users:", error.message);
    }
  };
  
    // Using useEffect to fetch data on component mount
    useEffect(() => {
      const fetchData = async () => {
        if (storedUserId) {
          const hotelServiceUsers = await fetchHotelServiceUsers(storedUserId);
          if (hotelServiceUsers && hotelServiceUsers.length > 0) {
            console.log("First User:", hotelServiceUsers[0]);
          } else {
            console.log("No users found or data is empty.");
          }
        } else {
          console.error("User ID is not available.");
        }
      };
  
      fetchData();
    }, [storedUserId]); // Dependency array ensures it runs when `storedUserId` changes

  // Call the function with the userId dynamically (for example, replace this with actual userId)
  fetchHotelServiceUsers(storedUserId);
  

  return (
    <div className="w-full max-w-6xl mx-auto mt-10">

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
        <HotelData></HotelData>
      </div>
      <hr className="border-black mx-40" />
      <div className="ml-20 mt-10">
        <span className="text-2xl font-bold">Passed By</span>
        <HotelData></HotelData>
      </div>
    </div>
  );
}

export default HotelHistory;
