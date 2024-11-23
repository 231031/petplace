import { Hotel } from "./HotelData";
import React, { useState } from "react";
import { Profile } from "@/types/response";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa"; // Import star icons
import { useNavigate } from "react-router-dom";


function HotelRating({ avgReview }: { avgReview: number }) {
  const fullStars = Math.floor(avgReview); // Number of full stars
  const halfStar = avgReview % 1 >= 0.5; // Whether to display a half star
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const buttons = ["Sort By", "Distance", "Price", "Rating", "Hot Deal"]; // Button labels

  return (
    <div className="flex items-center">
      {/* Full Stars */}
      {Array(fullStars)
        .fill(0)
        .map((_, i) => (
          <FaStar key={`full-${i}`} className="text-[#A08252]" /> // Full stars color
        ))}
      {/* Half Star */}
      {halfStar && <FaStarHalfAlt className="text-[#A08252]" />}{" "}
      {/* Half star color */}
    </div>
  );
}

function Card({ hotel }: { hotel: Profile }) {

  const navigate = useNavigate();
  const handleHotelClick = (hotel: Profile) => {
    // Navigate to "/hotelbookdetail" and pass the hotel data as state
    navigate('/hoteldetail', { state: { selectedHotel: hotel } });
  };

  return (
    <div className="grid grid-cols-10 gap-4 mb-10 mt-10  rounded-2xl shadow-lg shadow-egg border  border-gray-300  p-4" onClick={() => handleHotelClick(hotel)}
      style={{ cursor: 'pointer' }}>
      <div className="col-span-2">
        <img
          src="https://images.unsplash.com/photo-1612838320302-4b3b3b3b3b3b"
          className="w-full h-full object-cover object-center rounded-lg ml-5 mt-5"
        />
      </div>

      <div className="col-span-6 ml-5 mt-5">
        <h1 className="text-xl font-bold">{hotel.name}</h1>
        <h1 className="mb-2">
          <HotelRating avgReview={hotel.avg_review} />
        </h1>
        <h2 className="text-lg">unknow</h2>
        <h2 className="text-lg">Facility: {hotel.facility}</h2>
        <div>
          {[...new Set(hotel.cages.map((cage) => cage.animal_type))].map(
            (animal_type) => (
              <h5 key={animal_type} className="inline-block mr-2 bg-[#A08252] text-white px-2 mt-10">
                {animal_type}
              </h5>
            )
          )}
        </div>
      </div>
      <div className="col-span-2 mt-16">
        <h1 className="text-lg">Before include tax</h1>
        {/* <h1>{hotel.cage.price[0]}</h1> */}
        <div className="text-2xl font-bold mt-4">{hotel.cages[0].price}</div>

      </div>

      <div className="flex flex-row gap-4 ml-5 mt-5">
        {/* <h5>{hotel.cages[].animal_type}</h5>
        {hotel.cages?.map((cage) => (
          <h5>{cage.animal_type}</h5>
        ))} */}
      </div>
    </div>


  );
}

export default Card;