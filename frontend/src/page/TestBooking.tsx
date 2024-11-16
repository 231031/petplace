
import { BookHotelService } from "@/helper/hotel";
import { useEffect, useState } from "react";



function TestBooking() {

    useEffect(() => {
        const payload = {
            animals: [],
            cage_id: 5,
            client_id: 2,
            client_name: "client first",
            end_time: "",
            profile_id: 1,
            profile_name: "",
            start_time: "",
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