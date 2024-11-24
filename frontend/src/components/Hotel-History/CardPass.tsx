import { Hotel } from "./HotelDataPass";
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
    <div>
    {(hotel.status === "canceled" || hotel.status === "rejected" || hotel.status === "completed") && (
      <div className="grid grid-cols-10 gap-4 mb-10 mt-10 rounded-2xl shadow-lg shadow-egg border  border-gray-300  p-4">
        <div className="col-span-2 ">
          <img
            src="https://images.unsplash.com/photo-1612838320302-4b3b3b3b3b3b"
            className="w-full h-full object-cover object-center rounded-lg ml-5 mt-5"
          />
        </div>
    
        <div className="col-span-2 ml-5 mt-5">
          <h2>{hotel.cage_room.cage_type}</h2>
          <h1>
            {hotel.cage_room.size} {hotel.cage_room.width} x
            {hotel.cage_room.lenth} x {hotel.cage_room.height}
          </h1>
          <h2>Accommodates: {hotel.cage_room.max_capacity} </h2>
          <h2>Facility: {hotel.cage_room.facility}</h2>
        </div>
        <div className="col-span-3 ml-5 mt-5">
          <h1>{hotel.animal_hotel_services[0].animal_user.name}</h1>
          <h1>
            Pet type: {hotel.animal_hotel_services[0].animal_user.animal_type}
          </h1>
          <h2>Age: {hotel.animal_hotel_services[0].animal_user.age}</h2>
          <h2>Pet breed: {hotel.animal_hotel_services[0].animal_user.breed}</h2>
          <h2>Weight: {hotel.animal_hotel_services[0].animal_user.weight}</h2>
        </div>
        <div className="col-span-3 ml-5 mt-5">
          <h1>Check in {hotel.start_time}</h1>
          <h1>Check out {hotel.end_time}</h1>
          <h2>{hotel.price}</h2>
        </div>
        <div className="flex flex-row gap-4 ml-5 mt-5">
          {/* <h5>{hotel.cages[].animal_type}</h5>
          {hotel.cages?.map((cage) => (
            <h5>{cage.animal_type}</h5>
          ))} */}
        </div>
      </div>
    )}
    </div>
  );
}

export default Card;
