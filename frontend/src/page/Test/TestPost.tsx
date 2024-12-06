import React from "react";

const postBookingHotel = async () => {
  const TestPayload = {
    animals: [1],
    cage_id: 1,
    client_id: 1,
    client_name: "aaa",
    end_time: "2024-11-19",
    profile_id: 1,
    profile_name: "aaa",
    start_time: "2024-11-17",
    card_detail: {
      expiry: "2029-11",
      name: "Client First",
      number: "4032032300864326",
      security_code: "111",
    },
  };

  try {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found. Please log in first.");
      alert("No token found. Please log in first.");
      return;
    }

    const response = await fetch("http://localhost:5000/api/hotel/client/booking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(TestPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error:", errorData);
      alert("Error: " + (errorData.message || "Failed to book!"));
      return;
    }

    const data = await response.json();
    console.log("Booking successful:", data);
    alert("Booking successful!");
  } catch (error) {
    console.error("Error:", (error as any).message);
    alert("An error occurred while booking!");
  }
};

const BookingComponent: React.FC = () => {
  return (
    <div>
      <h1>Book a Hotel</h1>
      <button onClick={postBookingHotel}>Book Now</button>
    </div>
  );
};

export default BookingComponent;
