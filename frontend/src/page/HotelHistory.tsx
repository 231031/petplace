import { useLocation } from "react-router-dom";
import HotelData from "../components/Hotel-History/HotelData";
import clsx from "clsx";
import { ClientRequest } from "http";

function HotelHistory() {
  const location = useLocation();
  const selectedCage = location.state?.selectedCage;
  console.log(selectedCage);

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
