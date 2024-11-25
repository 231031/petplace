import { Hotel } from "./HotelData";
import React, { useState } from "react";

// function Card({hotel}:{hotel:Hotel}) {
//     return (
//         <div>
//         <div>{hotel.hotel_name}</div>
//         {hotel.hotel_id == 1 ? <div>hi</div> : <div>ha</div>}
//         </div>
//     );
//   }

function Card({ hotel }: { hotel: Hotel }) {
  const [isCanceled, setIsCanceled] = useState(false); // State to handle cancellation

  const handleCancelClick = () => {
    setIsCanceled(true); // Switch to canceled view
  };

  const handleBackClick = () => {
    setIsCanceled(false); // Switch back to default view
  };

  return (
    <div>
      {isCanceled
        ? // <div className="p-4 border border-gray-300 rounded-lg shadow-md">
          //   <h2 className="text-center text-xl font-semibold text-red-600">
          //     Booking Canceled
          //   </h2>
          //   <p className="text-center text-gray-500">
          //     You have successfully canceled your booking.
          //   </p>
          //   <div className="flex justify-center mt-4">
          // <button
          //   onClick={handleBackClick}
          //   className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
          // >
          //   Back
          // </button>
          //   </div>
          // </div>
          (hotel.status === "pending" || hotel.status === "accepted") && (
            <div className="rounded-2xl shadow-lg shadow-egg border border-gray-300 p-4">
              <div className="grid grid-cols-10 gap-4 mb-10 mt-10 ">
                <div className="col-span-2">
                  <img
                    src="https://images.unsplash.com/photo-1612838320302-4b3b3b3b3b3b"
                    className="w-full h-full object-cover object-center rounded-lg ml-5 mt-5"
                  />
                </div>

                <div className="col-span-3 ml-5 mt-5">
                  <h2 className="text-xl font-medium">
                    {hotel.cage_room.cage_type}
                  </h2>
                  <h1 className="space-x-2 text-lg">
                    <span className="bg-size pl-2 pr-1 ">
                      {hotel.cage_room.size}{" "}
                    </span>
                    <span className="">Size</span>
                    <span>{hotel.cage_room.width} x</span>
                    <span>{hotel.cage_room.lenth} x</span>
                    <span>{hotel.cage_room.height}</span>
                  </h1>

                  <h2 className="text-lg">
                    Accommodates: {hotel.cage_room.max_capacity}{" "}
                  </h2>
                  <h2 className="text-lg">
                    Facility: {hotel.cage_room.facility}
                  </h2>
                </div>
                <div className="col-span-2 ml-5 mt-5">
                  <h1 className="text-xl font-medium">
                    {hotel.animal_hotel_services[0].animal_user.name}
                  </h1>
                  <h1 className="flex items-center space-x-2">
                    <span className="text-lg">Pet type:</span>
                    <span>
                      {hotel.animal_hotel_services[0].animal_user.animal_type}
                    </span>
                  </h1>

                  <h2>
                    <span className="text-lg">Age:</span>
                    <span>
                      {hotel.animal_hotel_services[0].animal_user.age}
                    </span>
                  </h2>
                  <h2>
                    <span className="text-lg">Pet breed:</span>
                    <span>
                      {hotel.animal_hotel_services[0].animal_user.breed}
                    </span>
                  </h2>
                  <h2>
                    <span className="text-lg">Weight:</span>
                    <span>
                      {hotel.animal_hotel_services[0].animal_user.weight}
                    </span>
                  </h2>
                </div>
                <div className="col-span-3 ml-5 mt-5 space-y-1">
                  <h1 className="ml-auto text-lg px-4 text-right">
                    Check in {hotel.start_time}
                  </h1>
                  <h1 className="ml-auto text-lg px-4 text-right">
                    Check out {hotel.end_time}
                  </h1>
                  <h2 className="ml-auto text-right px-4 font-bold text-2xl ">
                    {hotel.price} ฿
                  </h2>
                  {hotel.status === "pending" && (
                    <div className="flex justify-end mt-auto mb-0 space-x-4 pt-2">
                      <button
                        onClick={handleBackClick}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
                      >
                        Back
                      </button>
                    </div>
                  )}
                </div>
                {/* <div className="flex flex-row gap-4 ml-5 mt-5 w-full bg-red-600">
                  da
                </div> */}
              </div>
              <div className="grid grid-cols-10 bg-slate-500">
                <div className="col-span-2 bg-red-600"></div>
                <div className="col-span-8 bg-blue-600">
                  <h1 className="text-medium text-lg">Cancelation</h1>
                  
                </div>
              </div>
            </div>
          )
        : (hotel.status === "pending" || hotel.status === "accepted") && (
            <div className="grid grid-cols-10 gap-4 mb-10 mt-10 rounded-2xl shadow-lg shadow-egg border border-gray-300 p-4">
              <div className="col-span-2">
                <img
                  src="https://images.unsplash.com/photo-1612838320302-4b3b3b3b3b3b"
                  className="w-full h-full object-cover object-center rounded-lg ml-5 mt-5"
                />
              </div>

              <div className="col-span-3 ml-5 mt-5">
                <h2 className="text-xl font-medium">
                  {hotel.cage_room.cage_type}
                </h2>
                <h1 className="space-x-2 text-lg">
                  <span className="bg-size pl-2 pr-1 ">
                    {hotel.cage_room.size}{" "}
                  </span>
                  <span className="">Size</span>
                  <span>{hotel.cage_room.width} x</span>
                  <span>{hotel.cage_room.lenth} x</span>
                  <span>{hotel.cage_room.height}</span>
                </h1>

                <h2 className="text-lg">
                  Accommodates: {hotel.cage_room.max_capacity}{" "}
                </h2>
                <h2 className="text-lg">
                  Facility: {hotel.cage_room.facility}
                </h2>
              </div>
              <div className="col-span-2 ml-5 mt-5">
                <h1 className="text-xl font-medium">
                  {hotel.animal_hotel_services[0].animal_user.name}
                </h1>
                <h1 className="flex items-center space-x-2">
                  <span className="text-lg">Pet type:</span>
                  <span>
                    {hotel.animal_hotel_services[0].animal_user.animal_type}
                  </span>
                </h1>

                <h2>
                  <span className="text-lg">Age:</span>
                  <span>{hotel.animal_hotel_services[0].animal_user.age}</span>
                </h2>
                <h2>
                  <span className="text-lg">Pet breed:</span>
                  <span>
                    {hotel.animal_hotel_services[0].animal_user.breed}
                  </span>
                </h2>
                <h2>
                  <span className="text-lg">Weight:</span>
                  <span>
                    {hotel.animal_hotel_services[0].animal_user.weight}
                  </span>
                </h2>
              </div>
              <div className="col-span-3 ml-5 mt-5 space-y-1">
                <h1 className="ml-auto text-lg px-4 text-right">
                  Check in {hotel.start_time}
                </h1>
                <h1 className="ml-auto text-lg px-4 text-right">
                  Check out {hotel.end_time}
                </h1>
                <h2 className="ml-auto text-right px-4 font-bold text-2xl ">
                  {hotel.price} ฿
                </h2>
                {hotel.status === "pending" && (
                  <div className="flex justify-end mt-auto mb-0 space-x-4 pt-2">
                    <button
                      onClick={handleCancelClick}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
              <div className="flex flex-row gap-4 ml-5 mt-5 w-full bg-red-600"></div>
            </div>
          )}
    </div>
  );
}

export default Card;
