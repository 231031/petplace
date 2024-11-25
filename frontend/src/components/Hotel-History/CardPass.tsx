import { ReviewHotelService } from "@/helper/hotel";
import { Hotel } from "./HotelDataPass";
import React, { useState } from "react";



function Card({ hotel }: { hotel: Hotel }) {
  const ReviewPayload: ReviewPayload = {
    hide_name: false, // Boolean value (not an identifier)
    hotel_service_id: 1, // Example service ID
    profile_id: 1, // Example profile ID
    review_detail: "", // Empty string for review details
    review_image: "", // Single image URL
    review_image_array: [], // Empty array for multiple images
    review_rate: 1, // Example rating
  };

  // console.log("profile id",hotel)
  // ReviewHotelService(ReviewPayload);

  const [isReviewing, setIsReviewing] = useState(false); // State to toggle between components

  // Function to handle Review button click
  const handleReviewClick = () => {
    setIsReviewing(true);
  };
  return (
    <div>
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
                Pet type:{" "}
                {hotel.animal_hotel_services[0].animal_user.animal_type}
              </h1>
              <h2>Age: {hotel.animal_hotel_services[0].animal_user.age}</h2>
              <h2>
                Pet breed: {hotel.animal_hotel_services[0].animal_user.breed}
              </h2>
              <h2>
                Weight: {hotel.animal_hotel_services[0].animal_user.weight}
              </h2>
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
            {hotel.status === "completed" && (
              <div className="flex justify-end mt-5">
                <button
                  onClick={handleReviewClick}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Review
                </button>
              </div>
            )}
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

  const handleSubmit = () => {
    const reviewPayload = {
      rating,
      hideName,
      reviewText,
    };
    console.log("Review submitted for:", hotel, reviewPayload);
    onReturn(); // Return to previous component (Card)
  };

  return (
    <div className="p-6 rounded-2xl shadow-lg border border-gray-300 bg-white">
      <h1 className="text-xl font-bold mb-4">
        Review {hotel.cage_room.cage_type}
      </h1>

      {/* Star Ratings */}
      <div className="mb-4">
        <p className="mb-2 font-semibold">Rate your experience:</p>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={`text-2xl ${
                rating >= star ? "text-yellow-500" : "text-gray-400"
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      {/* Name Visibility Toggle */}
      <div className="mb-4">
        <p className="mb-2 font-semibold">Your name: Somkiat</p>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={hideName}
            onChange={(e) => setHideName(e.target.checked)}
            className="w-4 h-4"
          />
          <span>Hide your name</span>
        </label>
      </div>

      {/* Discussion Input */}
      <div className="mb-4">
        <p className="mb-2 font-semibold">Discussion:</p>
        <textarea
          placeholder="Explain us your journey"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          className="w-full h-32 border p-2 rounded-lg resize-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={onReturn}
          className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
export default Card;
