import { Profile } from "@/types/response";
import { FaStar, FaStarHalfAlt } from "react-icons/fa"; // Import star icons
import { useNavigate } from "react-router-dom";


function HotelRating({ avgReview }: { avgReview: number }) {
  const fullStars = Math.floor(avgReview); // Number of full stars
  const halfStar = avgReview % 1 >= 0.5;   // Whether to display a half star

  return (
    <div className="flex items-center">
      {/* Full Stars */}
      {Array(fullStars)
        .fill(0)
        .map((_, i) => (
          <FaStar key={`full-${i}`} className="text-[#A08252]" /> // Full stars color
        ))}

      {/* Half Star */}
      {halfStar && <FaStarHalfAlt className="text-[#A08252]" />} {/* Half star color */}
    </div>
  );
}

function Card({ hotel, startDate, endDate }: { hotel: Profile, startDate: string, endDate: string }) {

  const navigate = useNavigate();
  const handleHotelClick = (hotel: Profile) => {
    console.log("hotelsssssss", hotel);
    navigate('/hoteldetail', {
      state: {
        selectedHotel: hotel,
        profile_name: hotel.name,
        startDate: startDate,
        endDate: endDate
      }
    });
  };

  return (
    <div className="grid grid-cols-10 gap-4 mb-10 mt-10  *:rounded-2xl shadow-lg shadow-egg border  border-gray-300  p-4" onClick={() => handleHotelClick(hotel)}
      style={{ cursor: 'pointer' }}>
      <div className="col-span-2">
        {
          (hotel.image_profile && hotel.image_profile != "") ? (
            <img
              // src="https://images.unsplash.com/photo-1612838320302-4b3b3b3b3b3b"
              src={hotel.image_profile || ""}
              className="w-full h-full object-cover object-center rounded-lg ml-5 "
            />

          ) : (
            <div></div>
          )
        }
      </div>

      <div className="col-span-8 ml-5 mt-5">
        <h1>{hotel.name}</h1>
        <h1>
          <HotelRating avgReview={hotel.avg_review} />
        </h1>
        <h2>{hotel.name}</h2>
        <h2>Facility: {hotel.facility}</h2>

      </div>
      <div className="flex flex-row gap-4 ml-5 mt-5">
        {/* <h5>{hotel.cages[].animal_type}</h5> */}
        {hotel.cages?.map((cage) => (
          <h5>{cage.animal_type}</h5>
        ))}
      </div>
    </div>
  );
}

export default Card;