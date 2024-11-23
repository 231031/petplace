import { Hotel } from "./HotelData";
import React from "react";

// function Card({hotel}:{hotel:Hotel}) {
//     return (
//         <div>
//         <div>{hotel.hotel_name}</div>
//         {hotel.hotel_id == 1 ? <div>hi</div> : <div>ha</div>}
//         </div>
//     );
//   }

function Card({ hotel }: { hotel: Hotel }) {
  return (
    <div className="grid grid-cols-10 gap-4 mb-10 mt-10 rounded-2xl shadow-lg shadow-egg border  border-gray-300  p-4">
      <div className="col-span-2 ">
        <img
          src="https://images.unsplash.com/photo-1612838320302-4b3b3b3b3b3b"
          className="w-full h-full object-cover object-center rounded-lg ml-5 mt-5"
        />

      </div>

      <div className="col-span-2 ml-5 mt-5">
        <h1>{hotel.hotel_name}</h1>
        <h1>*****</h1>
        <h2>{hotel.hotel_address}</h2>
        <h2>{hotel.hotel_facility}</h2>
        <h1 className="flex justify-end mr-10">Before include tax</h1>
      </div>
      <div className="col-span-3 ml-5 mt-5">
        <h1>{hotel.hotel_name}</h1>
        <h1>*****</h1>
        <h2>{hotel.hotel_address}</h2>
        <h2>{hotel.hotel_facility}</h2>
        <h1 className="flex justify-end mr-10">Before include tax</h1>
      </div>
      <div className="col-span-2 ml-5 mt-5">
        <h1>{hotel.hotel_name}</h1>
        <h1>*****</h1>
        <h2>{hotel.hotel_address}</h2>
        <h2>{hotel.hotel_facility}</h2>
        <h1 className="flex justify-end mr-10">Before include tax</h1>
      </div>
      
    </div>


    
  );
}

export default Card;
