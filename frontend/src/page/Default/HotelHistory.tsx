import { useLocation, useNavigate } from "react-router-dom";
import HotelData from "@/components/Hotel-History/HotelData";
import HotelDataPass from "@/components/Hotel-History/HotelDataPass";
import { useEffect, useState } from "react";

function HotelHistory() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedCage = location.state?.selectedCage;
  const token = localStorage.getItem("token");
  const storedUserId = localStorage.getItem('userId');
  const storedUserName = localStorage.getItem('username');
  const [hotelServiceUsers, setHotelServiceUsers] = useState([]);
  const [error, setError] = useState(null);

  // Fetch data using async function within useEffect
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
    const fetchHotelServiceUsers = async (userId: string) => {
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
          if (response.status === 401) {
            navigate("/login")
          }
        }

        const data = await response.json();
        setHotelServiceUsers(data);  // Set the data to state

      } catch (err) {
        if (err) {
          setError(err);  // Set error state
        }
      }
    };

    fetchHotelServiceUsers(storedUserId);  // Call the function with storedUserId
  }, []);  // Dependencies to run useEffect when userId or token changes

  return (
    <div className="w-full max-w-7xl mx-auto mt-10">
      <div className="flex justify-center items-center mb-12">
        <span className="text-2xl font-medium"> Select History Service</span>
      </div>
      <div
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

      {
        (hotelServiceUsers.length > 0) ? (
          <div>
            <div className="ml-20">
              <span className="text-2xl font-medium">Upcoming</span>
              <HotelData hotelList={hotelServiceUsers || []}></HotelData>
            </div>
            <hr className="border-black mx-40" />
            <div className="ml-20 mt-10">
              <span className="text-2xl font-midium">Passed By</span>
              <HotelDataPass hotelList={hotelServiceUsers || []}></HotelDataPass>
            </div>
          </div>
        ) : (
          <div></div>
        )
      }
    </div>
  );
}

export default HotelHistory;