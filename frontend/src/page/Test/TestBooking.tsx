import { BookHotelService } from "@/helper/hotel";
import { useEffect } from "react";



function TestBooking() {

    useEffect(() => {
        const payload = {
            animals: [1, 3],
            cage_id: 14,
            client_id: 2,
            client_name: "client first",
            end_time: "2024-11-19",
            profile_id: 1,
            profile_name: "hotel1",
            start_time: "2024-11-17",
            card_detail: { // if user already has a card get from api and to show detail and allow update
                expiry: "2029-11",
                name: "Client First",
                number: "4032032300864326",
                security_code: "111",
            },
        }

        const apiBookHotel = async () => {
            try {
                // const res = await GetSearchCage(filterAnimal, filterSearchCage);
                const res = await BookHotelService(payload);
                console.log(res);
            } catch (err) {
                console.log(err);
            }
        }
        apiBookHotel()

    }, []);

    return (
        <div className="h-screen flex">
            <h3>TestBooking</h3>
        </div>
    )
}
export default TestBooking;