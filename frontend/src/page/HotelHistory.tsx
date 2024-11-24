import { useLocation } from "react-router-dom";
import HotelData from "../components/Hotel-History/HotelData";
import HotelDataPass from "../components/Hotel-History/HotelDataPass";
import clsx from "clsx";
import { ClientRequest } from "http";

function HotelHistory() {
  const location = useLocation();
  const selectedCage = location.state?.selectedCage;
<<<<<<< HEAD
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
=======
  console.log("aaaa", selectedCage);
  return (
    <div className=''>
      <div className="flex justify-center bg-slate-200">
        <span className="text-2xl"> Select History Service</span>
>>>>>>> 208f78282ce3e34c81ff3804ce285b31dd0459de
      </div>
      <div className="flex flex-row mt-2 justify-center">
        <div className="flex justify-center bg-slate-500 px-5">1</div>
        <div className="flex justify-center bg-slate-500 px-5">2</div>
        <div className="flex justify-center bg-slate-500 px-5">3</div>
        <div className="flex justify-center bg-slate-500 px-5">4</div>
      </div>
      <div className="ml-20">
<<<<<<< HEAD
        <span className="text-2xl font-bold">Upcoming</span>
        <HotelData hotelList={hotelServiceUsers}></HotelData>      </div>
      <hr className="border-black mx-40" />
      <div className="ml-20 mt-10">
        <span className="text-2xl font-bold">Passed By</span>
        <HotelDataPass hotelList={hotelServiceUsers}></HotelDataPass>
=======
        <span className="text-2xl">Upcoming</span>
        <HotelData></HotelData>
      </div>
      <hr className="border-black mx-40" />
      <div className="ml-20 mt-10">
        <span className="text-2xl">Passed By</span>
        <HotelData></HotelData>
>>>>>>> 208f78282ce3e34c81ff3804ce285b31dd0459de
      </div>
    </div>

  );
}

export default HotelHistory;
