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
    <div className="grid grid-cols-10 gap-4 mb-10 mt-10 bg-slate-200 mr-20">
      <div className="col-span-2 ">
        <img
          src="https://images.unsplash.com/photo-1612838320302-4b3b3b3b3b3b"
          className="w-full h-full object-cover object-center rounded-lg ml-5 mt-5"
        />

      </div>

      <div className="col-span-8 ml-5 mt-5">
        <h1>{hotel.hotel_name}</h1>
        <h1>*****</h1>
        <h2>{hotel.hotel_address}</h2>
        <h2>{hotel.hotel_facility}</h2>
        <h1 className="flex justify-end mr-10">Before include tax</h1>
      </div>
      <div className="flex flex-row gap-4 ml-5 mt-5">
          <h5>cat</h5>
          <h5>rabbit</h5>
          <h5>hamster</h5>
        </div>
    </div>
  );
}

export default Card;
