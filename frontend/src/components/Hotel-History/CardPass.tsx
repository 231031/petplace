import { ReviewHotelService } from "@/helper/hotel";
import { Hotel } from "./HotelDataPass";
import React, { useEffect, useState } from "react";
import { ReviewPayload } from "@/types/payload";
import { FaRegStar, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


function CardPass({ hotel }: { hotel: Hotel }) {
  const [reviewPayload, setReviewPayload] = useState<ReviewPayload>({
    hide_name: false,
    hotel_service_id: 1,
    profile_id: hotel.cage_room.profile_id, // Use profile ID from `hotel`
    review_detail: "",
    review_image: "",
    review_image_array: [],
    review_rate: 1,
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '-');
  };

  const navigate =useNavigate();
  const [isReviewing, setIsReviewing] = useState(false); // State to toggle between components

  // Function to handle Review button click
  const handleReviewClick = () => {
    setIsReviewing(true);
  };
  return (
    <div className="">
      {isReviewing ? (
        // Show ReviewForm component if reviewing
        <ReviewForm hotel={hotel} onReturn={() => setIsReviewing(false)} />
      ) : (
        // Show Card component if not reviewing
        (hotel.status === "canceled" ||
          hotel.status === "rejected" ||
          hotel.status === "completed") && (
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
                <span className=" bg-size pl-2 pr-1 ">{hotel.cage_room.size} </span>
                <span className="">Size</span>
                <span>{hotel.cage_room.width} x</span>
                <span>{hotel.cage_room.lenth} x</span>
                <span>{hotel.cage_room.height}</span>
              </h1>

              <h2 className="text-lg">Accommodates: {hotel.cage_room.max_capacity} </h2>
              <h2 className="text-lg">Facility: {hotel.cage_room.facility}</h2>
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
                <span>{hotel.animal_hotel_services[0].animal_user.breed}</span>
              </h2>
              <h2>
                <span className="text-lg">Weight:</span>
                <span>{hotel.animal_hotel_services[0].animal_user.weight}</span>
              </h2>
            </div>
            <div className="col-span-3 ml-5 mt-5 space-y-1">
              <h1 className="ml-auto text-lg  px-4 text-right">
                Check in : {formatDate(hotel.start_time)}
              </h1>
              <h1 className="ml-auto text-lg  px-4 text-right">
                Check out : {formatDate(hotel.end_time)}
              </h1>
              <h2 className="ml-auto text-right  px-4 font-medium text-2xl ">
                {hotel.price} ฿
              </h2>
              {hotel.status === "completed" && (
                <div className="flex justify-end mt-auto mb-0 space-x-4 pt-2">
                  <button
                    onClick={handleReviewClick}
                    className="bg-bgLogin px-4 py-2 border rounded-2xl shadow-lg shadow-egg"
                  >
                    Review
                  </button>
                  <button
                    onClick={()=>navigate("/hotelsearch")}
                    className="bg-button  px-4 py-2 border rounded-2xl shadow-lg shadow-egg"
                  >
                    Book Again
                  </button>
                </div>
              )}
            </div>
            <div className="flex flex-row gap-4 ml-5 mt-5 w-full bg-red-600"></div>
            {/* {hotel.status === "completed" && (
              <div className="flex justify-end mt-5 bg-slate-400">
                <button
                  onClick={handleReviewClick}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Review
                </button>
              </div>
            )} */}
          </div>
        )
      )}
    </div>
  );
}

// ReviewForm component for review submission
function ReviewForm({
  hotel,
  onReturn,
}: {
  hotel: Hotel;
  onReturn: () => void; // Function to handle return to Card
}) {
  const [rating, setRating] = useState(0); // State for star rating
  const [hideName, setHideName] = useState(false); // State for "hide your name"
  const [reviewText, setReviewText] = useState(""); // State for review text
  const [reviewImage, setReviewImage] = useState(""); // Single review image
  const [hotelServiceId, setHotelServiceId] = useState(0); // Single review image
  const [profileId, setProfileId] = useState(0); // Single review image
  const [reviewImageArray, setReviewImageArray] = useState<string[]>([]); // Multiple images

  useEffect(() => {
    setHotelServiceId(hotel.animal_hotel_services[0].hotel_service_id || 0); // Dynamically set service ID
    setProfileId(hotel.cage_room?.profile_id || 0); // Dynamically set profile ID
  }, [hotel]);

  const handleSubmit = async () => {
    try {
      const reviewPayload: ReviewPayload = {
        hide_name: hideName, // Use state value
        hotel_service_id: hotelServiceId, // Prop passed to component
        profile_id: profileId, // Prop passed to component
        review_detail: reviewText, // Use state value
        review_image: reviewImage, // Use state value
        review_image_array: reviewImageArray, // Use state value
        review_rate: rating, // Use state value
      };
      console.log("Review submitted for:", hotel, reviewPayload);
      await ReviewHotelService(reviewPayload);
      onReturn(); // Return to previous component (Card)
    } catch (error) {
      console.log("error review", error);
    }
  };

  return (
    <div className="grid grid-cols-10 gap-4 mb-10 mt-10 rounded-2xl shadow-lg shadow-egg border border-gray-300 p-4">
      <div className="col-span-2">
        <img
          src="https://images.unsplash.com/photo-1612838320302-4b3b3b3b3b3b"
          className="w-full h-full object-cover object-center rounded-lg ml-5 mt-5"
        />
      </div>

      <div className="col-span-4 ml-5 mt-5">
        <h2 className="text-xl font-bold">Review </h2>
        <h1>
          {/* Star Ratings */}
          <div className="flex items-center space-x-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => setRating((prev) => (prev === star ? 0 : star))} // Toggle star
          className="text-3xl" // Adjust size as needed
        >
          {rating >= star ? (
            <FaStar className="text-star" /> // Filled star
          ) : (
            <FaRegStar className="text-star" /> // Outlined star
          )}
        </button>
      ))}
    </div> 
        </h1>
        <h1 className="flex items-center space-x-4 text-lg">
          {/* Name and Visibility Toggle */}
          <div className="flex items-center space-x-2">
            <p className="font-semibold">Your name:</p>
            <span>Somkiat</span>
          </div>
          <label className="flex items-center space-x-1">
            <input
              type="checkbox"
              checked={hideName}
              onChange={(e) => setHideName(e.target.checked)}
              className="w-4 h-4"
            />
            <span>Hide your name</span>
          </label>
        </h1>

        {/* Discussion Input */}
        <h1 className="flex space-x-4 text-lg">
          {/* Name and Visibility Toggle */}
          <p className="font-semibold">Discussion:</p>
          <textarea
            placeholder="Explain us your journey"
            value={reviewText}
            onChange={(e) => {
              setReviewText(e.target.value);
            }}
            // className="w-full border p-2 rounded-lg resize-none focus:ring-2 focus:ring-blue-300"
            className="border rounded-lg"
          />
        </h1>
      </div>

      <div className="flex flex-col col-span-4 ml-5 mt-5 justify-end">
        {/* Action Buttons */}
        <div className="mt-0 mb-auto ml-auto mr-0">
          <label htmlFor="">dasdas</label>
        </div>
        <div className="flex space-x-4 mt-auto mb-0 ml-auto mr-0">
          <button
            onClick={onReturn}
            className="bg-Login  px-4 py-2 border rounded-2xl shadow-lg shadow-egg"
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            className="bg-button  px-4 py-2 border rounded-2xl shadow-lg shadow-egg"
          >
            Submit
          </button>
        </div>
      </div>
      <div className="flex flex-row gap-4 ml-5 mt-5">
        {/* <h5>{hotel.cages[].animal_type}</h5>
          {hotel.cages?.map((cage) => (
            <h5>{cage.animal_type}</h5>
          ))} */}
      </div>
    </div>

    // <div className="p-6 rounded-2xl shadow-lg border border-gray-300 bg-white">
    //   <h1 className="text-xl font-bold mb-4">
    //     Review {hotel.cage_room.cage_type}
    //   </h1>

    //   {/* Star Ratings */}
    //   <div className="mb-4">
    //     <p className="mb-2 font-semibold">Rate your experience:</p>
    //     <div className="flex items-center space-x-1">
    //       {[1, 2, 3, 4, 5].map((star) => (
    //         <button
    //           key={star}
    //           onClick={() => setRating(star)}
    //           className={`text-2xl ${
    //             rating >= star ? "text-yellow-500" : "text-gray-400"
    //           }`}
    //         >
    //           â˜…
    //         </button>
    //       ))}
    //     </div>
    //   </div>

    // {/* Name Visibility Toggle */}
    // <div className="mb-4">
    //   <p className="mb-2 font-semibold">Your name: Somkiat</p>
    //   <label className="flex items-center space-x-2">
    //     <input
    //       type="checkbox"
    //       checked={hideName}
    //       onChange={(e) => setHideName(e.target.checked)}
    //       className="w-4 h-4"
    //     />
    //     <span>Hide your name</span>
    //   </label>
    // </div>

    // {/* Discussion Input */}
    // <div className="mb-4">
    //   <p className="mb-2 font-semibold">Discussion:</p>
    //   <textarea
    //     placeholder="Explain us your journey"
    //     value={reviewText}
    //     onChange={(e) => {
    //       setReviewText(e.target.value);
    //     }}
    //     className="w-full h-32 border p-2 rounded-lg resize-none focus:ring-2 focus:ring-blue-300"
    //   />
    // </div>

    // {/* Action Buttons */}
    // <div className="flex space-x-4">
    //   <button
    //     onClick={onReturn}
    //     className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400"
    //   >
    //     Back
    //   </button>
    //   <button
    //     onClick={handleSubmit}
    //     className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600"
    //   >
    //     Submit
    //   </button>
    // </div>
    // </div>
  );
}
export default CardPass;