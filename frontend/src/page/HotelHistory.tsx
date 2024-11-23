import { useLocation } from "react-router-dom";
import HotelData from "../components/Hotel-History/HotelData";
import clsx from "clsx";
import { ClientRequest } from "http";

function HotelHistory() {
  const location = useLocation();
  const selectedCage = location.state?.selectedCage;
  console.log("aaaa", selectedCage);
  return (
    <div className=''>
      <div className="flex justify-center bg-slate-200">
        <span className="text-2xl"> Select History Service</span>
      </div>
      <div className="flex flex-row mt-2 justify-center">
        <div className="flex justify-center bg-slate-500 px-5">1</div>
        <div className="flex justify-center bg-slate-500 px-5">2</div>
        <div className="flex justify-center bg-slate-500 px-5">3</div>
        <div className="flex justify-center bg-slate-500 px-5">4</div>
      </div>
      <div className="ml-20">
        <span className="text-2xl">Upcoming</span>
        <HotelData></HotelData>
      </div>
      <hr className="border-black mx-40" />
      <div className="ml-20 mt-10">
        <span className="text-2xl">Passed By</span>
        <HotelData></HotelData>
      </div>
    </div>

  );
}

export default HotelHistory;
