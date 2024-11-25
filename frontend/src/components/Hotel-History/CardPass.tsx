import { ReviewHotelService } from "@/helper/hotel";
import { Hotel } from "./HotelDataPass";
import React, { useState } from "react";

const ReviewPayload: ReviewPayload = {
  hide_name: false, // Boolean value (not an identifier)
  hotel_service_id: 1, // Example service ID
  profile_id: 1, // Example profile ID
  review_detail: "", // Empty string for review details
  review_image: "", // Single image URL
  review_image_array: [], // Empty array for multiple images
  review_rate: 1, // Example rating
};

ReviewHotelService(ReviewPayload);

function Card({ hotel }: { hotel: Hotel }) {
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
    const handleSubmit = () => {
      console.log("Review submitted for:", hotel);
      onReturn(); // Return to previous component (Card)
    };
  
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-2">Review {hotel.cage_room.cage_type}</h1>
        <textarea
          placeholder="Write your review here"
          className="w-full h-32 border p-2 mt-2 rounded-lg"
        />
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 mt-2"
        >
          Submit
        </button>
        <button
          onClick={onReturn}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 mt-2 ml-2"
        >
          Cancel
        </button>
      </div>
    );
  }
export default Card;
