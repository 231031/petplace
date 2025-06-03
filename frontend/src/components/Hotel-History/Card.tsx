import { ManageRefundBookHotel } from "@/helper/hotel";
import { useState } from "react";

// function Card({hotel}:{hotel:Hotel}) {
//     return (
//         <div>
//         <div>{hotel.hotel_name}</div>
//         {hotel.hotel_id == 1 ? <div>hi</div> : <div>ha</div>}
//         </div>
//     );
//   }

function Card({ hotel }: { hotel: any }) {

  const [isCanceled, setIsCanceled] = useState(false);
  const [paypalEmail, setPaypalEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCancelClick = () => {
    setIsCanceled(true); // Switch to canceled view
    setError(null)  // reset error
  };

  const handleBackClick = () => {
    setIsCanceled(false); // Switch back to default view
    setPaypalEmail(""); // reset email 
    setError(null);
  };


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '-');
  };

  const handleConfirmRefund = async () => {
    // ตรวจสอบ email
    if (!paypalEmail) {
      setError("กรุณากรอก PayPal email");
      return;
    }
    if (!paypalEmail.includes('@')) {
      setError("กรุณากรอก email ที่ถูกต้อง");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('ไม่พบข้อมูลผู้ใช้');
      }

      const refundPayload = {
        client_id: parseInt(userId),
        hotel_service_id: hotel.id,
        paypal_email: paypalEmail
      };

      await ManageRefundBookHotel(refundPayload);

      // เมื่อสำเร็จ
      alert('ส่งคำขอคืนเงินสำเร็จ');
      window.location.reload(); // รีโหลดหน้าเพื่ออัพเดทสถานะ

    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการขอคืนเงิน');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isCanceled
        ? (hotel.status === "pending" || hotel.status === "accepted") && (
          <div className="rounded-2xl shadow-lg shadow-egg border border-gray-300 p-4">
            <div className="grid grid-cols-10 gap-4 mb-10 mt-10 ">
              {
                <div className="col-span-2">
                  {
                    (hotel.cage_room.image_array.lenght > 0) ? (
                      <p>no image</p>
                    ) : (
                      <img
                        // src="https://images.unsplash.com/photo-1612838320302-4b3b3b3b3b3b"
                        src={hotel.cage_room.image_array[0]}
                        className="w-full h-full object-cover object-center rounded-lg ml-5 "
                      />
                    )
                  }
                </div>
              }

              <div className="col-span-3 ml-5 mt-5">
                <h2 className="text-xl font-medium">
                  {hotel.cage_room.cage_type}
                </h2>
                <h1 className="space-x-2 text-lg">
                  <span className="bg-size pl-2 pr-1 ">
                    {hotel.cage_room.size}{" "}
                  </span>
                  <span className="">Size</span>
                  <span>{hotel.cage_room.width} x</span>
                  <span>{hotel.cage_room.lenth} x</span>
                  <span>{hotel.cage_room.height}</span>
                </h1>

                <h2 className="text-lg">
                  Accommodates: {hotel.cage_room.max_capacity}{" "}
                </h2>
                <h2 className="text-lg">
                  Facility: {hotel.cage_room.facility}
                </h2>
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
                  <span>
                    {hotel.animal_hotel_services[0].animal_user.age}
                  </span>
                </h2>
                <h2>
                  <span className="text-lg">Pet breed:</span>
                  <span>
                    {hotel.animal_hotel_services[0].animal_user.breed}
                  </span>
                </h2>
                <h2>
                  <span className="text-lg">Weight:</span>
                  <span>
                    {hotel.animal_hotel_services[0].animal_user.weight}
                  </span>
                </h2>
              </div>
              <div className="col-span-3 ml-5 mt-5 space-y-1">
                <h1 className="ml-auto text-lg px-4 text-right">
                  Check in : {formatDate(hotel.start_time)}
                </h1>
                <h1 className="ml-auto text-lg px-4 text-right">
                  Check out : {formatDate(hotel.end_time)}
                </h1>
                <h2 className="ml-auto text-right px-4 font-bold text-2xl ">
                  {hotel.price} ฿
                </h2>
              </div>
            </div>

            {hotel.status === "pending" && (
              <div className="grid grid-cols-10 ">
                <div className="col-span-2"></div>
                <div className="col-span-8 ml-5 border-t border-gray-500 pt-2">
                  <h1 className="text-medium text-lg">Cancelation</h1>
                  <h1 className="text-medium text-lg">
                    Refund status: Acceptable
                  </h1>
                  <h1 className="text-medium text-lg flex items-center justify-between ">
                    <div className="flex items-center">
                      <span>Paypal email:</span>
                      <input
                        type="email"
                        value={paypalEmail}
                        onChange={(e) => setPaypalEmail(e.target.value)}
                        className="ml-2 px-3 py-1 border rounded focus:outline-none focus:ring focus:border-blue-300"
                        placeholder="Enter PayPal email"
                      />
                    </div>
                    <div className="space-x-2">
                      {hotel.status === "pending" && (
                        <button
                          onClick={handleBackClick}
                          className="bg-bgLogin px-10 py-2 border rounded-2xl shadow-lg shadow-egg"
                          disabled={isLoading}
                        >
                          Back
                        </button>
                      )}
                      {hotel.status === "pending" && (
                        <button
                          onClick={handleConfirmRefund}
                          className="bg-button px-10 py-2 border rounded-2xl shadow-lg shadow-egg"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Processing...' : 'Confirm'}
                        </button>
                      )}
                    </div>
                  </h1>
                  {error && (
                    <p className="text-red-500 text-sm mt-2">{error}</p>
                  )}
                </div>
              </div>
            )}
            {hotel.status === "accepted" && (
              <div className="grid grid-cols-10 ">
                <div className="col-span-2"></div>
                <div className="col-span-8 ml-5 border-t border-gray-500 pt-2">
                  <h1 className="text-medium text-lg">Cancelation</h1>
                  <h1 className="text-medium pl-7">
                    Refund status: Rejected
                  </h1>
                  {/* <h1 className="text-medium text-lg flex items-center justify-between "> */}
                  <h1 className="text-medium pl-7 flex">
                    <div className="flex items-center ">
                      <label>
                        Please note that you may cancel your booking at this time without any issues, however, the payment is non-refundable. We appreciate your understanding.
                      </label>
                    </div>
                    <div className="space-x-2 ml-auto mr-0 flex">
                      {hotel.status === "accepted" && (
                        <button
                          onClick={handleBackClick}
                          className="bg-bgLogin px-10 py-2 border rounded-2xl shadow-lg shadow-egg h-3/4"

                        >
                          Back
                        </button>
                      )}
                      {hotel.status === "accepted" && (
                        <button
                          // onClick={handleBackClick}
                          className="bg-button px-10 py-2 border rounded-2xl shadow-lg shadow-egg h-3/4"
                        >
                          Confirm
                        </button>
                      )}
                    </div>
                  </h1>
                </div>
              </div>
            )}
          </div>
        )
        : (hotel.status === "pending" || hotel.status === "accepted") && (
          <div className="grid grid-cols-10 gap-4 mb-10 mt-10 rounded-2xl shadow-lg shadow-egg border border-gray-300 p-4">
            {
              <div className="col-span-2">
                {
                  (hotel.cage_room.image_array.lenght > 0) ? (
                    <p>no image</p>
                  ) : (
                    <img
                      // src="https://images.unsplash.com/photo-1612838320302-4b3b3b3b3b3b"
                      src={hotel.cage_room.image_array[0]}
                      className="w-full h-full object-cover object-center rounded-lg ml-5 "
                    />
                  )
                }
              </div>
            }
            <div className="col-span-3 ml-5 mt-5">
              <h2 className="text-xl font-medium">
                {hotel.cage_room.cage_type}
              </h2>
              <h1 className="space-x-2 text-lg">
                <span className="bg-size pl-2 pr-1 ">
                  {hotel.cage_room.size}{" "}
                </span>
                <span className="">Size</span>
                <span>{hotel.cage_room.width} x</span>
                <span>{hotel.cage_room.lenth} x</span>
                <span>{hotel.cage_room.height}</span>
              </h1>

              <h2 className="text-lg">
                Accommodates: {hotel.cage_room.max_capacity}{" "}
              </h2>
              <h2 className="text-lg">
                Facility: {hotel.cage_room.facility}
              </h2>
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
                <span>
                  {hotel.animal_hotel_services[0].animal_user.breed}
                </span>
              </h2>
              <h2>
                <span className="text-lg">Weight:</span>
                <span>
                  {hotel.animal_hotel_services[0].animal_user.weight}
                </span>
              </h2>
            </div>
            <div className="col-span-3 ml-5 mt-5 space-y-1">
              <h1 className="ml-auto text-lg px-4 text-right">
                Check in : {formatDate(hotel.start_time)}
              </h1>
              <h1 className="ml-auto text-lg px-4 text-right">
                Check out : {formatDate(hotel.end_time)}
              </h1>
              <h2 className="ml-auto text-right px-4 font-medium text-2xl ">
                {hotel.price} ฿
              </h2>

              <div className="flex justify-end mt-auto mb-0 space-x-4 pt-2">
                <button
                  onClick={handleCancelClick}
                  className="bg-button px-10 py-2 border rounded-2xl shadow-lg shadow-egg"
                >
                  Cancel
                </button>
              </div>

            </div>
            <div className="flex flex-row gap-4 ml-5 mt-5 w-full bg-red-600"></div>
          </div>
        )}
    </div>
  );
}

export default Card;