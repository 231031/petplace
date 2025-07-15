import { BASE_API } from "@/config/config";
import { formatDateToStringNew } from "@/helper/utils";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function PaymentSelect() {
  // State to manage selected payment method
  // const [select, setSelect] = useState<number | null>(0);
  // State to manage payment details
  const [paymentDetails, setPaymentDetails] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardType: "",
  });
  // State to manage error messages
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const selectedCage = location.state?.selectedCage;
  const selectedPets = location.state?.selectedPets;
  const profile_name = location.state?.hotelName;

  // Handle payment method selection
  // const handleSelect = (choice: number) => {
  //     setSelect(choice);

  // };

  // Handle input change for payment details
  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const { name, value } = e.target;
  //     setPaymentDetails(prev => ({
  //         ...prev,
  //         [name]: value
  //     }));
  // };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPaymentDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle booking confirmation
  const handleBooking = async () => {
    try {
      // Validate selected pets
      if (!selectedPets || selectedPets.length === 0) {
        setError("Please select at least one pet to book");
        return;
      }

      // Validate start and end dates
      if (!location.state?.startDate || !location.state?.endDate) {
        setError("Please select start and end date to book");
        return;
      }

      // Validate selected cage
      if (!selectedCage) {
        setError("Do not have selected cage");
        return;
      }

      // Validate payment details
      if (
        !paymentDetails.cardName ||
        !paymentDetails.cardNumber ||
        !paymentDetails.expiry ||
        !paymentDetails.cvv
      ) {
        setError("Please fill in all payment details");
        return;
      }

      // Get client details from localStorage
      const client_id = parseInt(localStorage.getItem("userId") || "0");
      const client_name = localStorage.getItem("username") || "";

      // Validate client details
      if (!client_id || !client_name) {
        setError("กรุณาเข้าสู่ระบบใหม่");
        navigate("/login");
        return;
      }

      // Prepare booking payload
      const bookingPayload = {
        animals: selectedPets,
        cage_id: selectedCage.id,
        client_id: client_id,
        client_name: client_name,
        profile_id: selectedCage.profile_id,
        profile_name: profile_name,
        start_time: formatDateToStringNew(location.state.startDate),
        end_time: formatDateToStringNew(location.state.endDate),
        card_detail: {
          name: paymentDetails.cardName,
          number: paymentDetails.cardNumber,
          expiry: paymentDetails.expiry,
          security_code: paymentDetails.cvv,
        },
      };
      const token = localStorage.getItem("token");

      // Validate token
      if (!token) {
        console.error("No token found. Please log in first.");
        alert("No token found. Please log in first.");
        return;
      }

      // Send booking request to the server
      const response = await fetch(`${BASE_API}/hotel/client/booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingPayload),
      });

      // Handle response
      if (!response.ok) {
        const errorData = await response.json();
        alert("Error: " + (errorData.message || "Failed to book!"));
        return;
      }

      await response.json();
      alert("Booking successful!");
    } catch (error) {
      console.error("Error:", (error as any).message);
      alert("An error occurred while booking!");
    }

    // Navigate to booking success page
    navigate("/hotelbooksuccess");
  };

  return (
    <div className="h-screen">
      <div className="max-w-2xl w-full mx-auto mt-10">
        <ol className="flex items-center w-full text-xs text-gray-900 font-medium sm:text-base ">
          <li className="flex w-full relative text-black after:content-[''] after:w-72 after:h-2 after:bg-yellow after:inline-block after:absolute lg:after:top-5 after:top-5 after:left-14 ">
            <div className="block whitespace-nowrap z-10 relative">
              <span className="w-8 h-8 bg-onstep border-2 border-transparent rounded-full flex justify-center items-center mx-auto mb-3 text-sm text-black lg:w-10 lg:h-10 z-20 ">
                1
              </span>
              <p className="text-center">Book Detail</p>
            </div>
          </li>
          <li className="flex w-full relative text-black before:content-[''] before:w-1/2 before:h-2 before:bg-yellow before:inline-block before:absolute before:left-0 lg:before:top-5 before:top-5 after:content-[''] after:w-full  after:h-2 after:bg-gray-200 after:inline-block after:absolute after:left-10  lg:after:top-5 after:top-5 ">
            <div className="block whitespace-nowrap z-10 relative">
              <span className="w-8 h-8 bg-onstep border-2 border-transparent rounded-full flex justify-center items-center mx-auto mb-3 text-sm text-black lg:w-10 lg:h-10 z-20">
                2
              </span>
              <p className="text-center">Payment</p>
            </div>
          </li>
          <li className="flex relative text-black before:content-[''] before:w-1/2 before:h-2 before:bg-gray-200 before:inline-block before:absolute before:left-0 lg:before:top-5 before:top-5">
            <div className="block whitespace-nowrap z-10 relative">
              <span className="w-8 h-8 bg-nextstep border-2 border-transparent rounded-full flex justify-center items-center mx-auto mb-3 text-sm text-black lg:w-10 lg:h-10 z-20">
                3
              </span>
              <p className="text-center">Book Success</p>
            </div>
          </li>
        </ol>
      </div>
      <p className="text-2xl font-bold max-w-6xl w-full mx-auto mt-5">
        Select Payment Method
      </p>
      <div className="flex flex-col gap-3 max-w-7xl mx-auto mt-5">
        <div>
          <div className="flex items-center">
            <div className="shadow shadow-gray-400 w-full p-6 ml-12">
              <p className="text-xl font-bold mb-4">Credit/Debit Card</p>
              <div className="grid grid-row-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Card Type
                  </label>
                  <div className="grid grid-cols-4 gap-4">
                    <select
                      name="cardType"
                      value={paymentDetails.cardType}
                      onChange={handleInputChange}
                      className="w-full mt-1 border border-gray-300 text-gray-700 rounded-md p-2"
                    >
                      <option value="" disabled>
                        Select type
                      </option>
                      <option value="master-card">Master Card</option>
                      <option value="visa">Visa</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Card Name
                    </label>
                    <input
                      type="text"
                      name="cardName"
                      value={paymentDetails.cardName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      placeholder="Enter name"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Card Number
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={paymentDetails.cardNumber}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      placeholder="XXXX-XXXX-XXXX"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      name="expiry"
                      value={paymentDetails.expiry}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700">
                      CVC
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={paymentDetails.cvv}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      placeholder="XXX"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <div className="max-w-sm w-full mx-auto mb-10">
          <div className="flex justify-between space-x-6">
            <button
              className="w-full px-2 h-8 rounded-full shadow shadow-gray-400"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
            <button
              className="w-full px-2 h-8 bg-nextstep text-white rounded-full shadow shadow-gray-400"
              onClick={handleBooking}
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
