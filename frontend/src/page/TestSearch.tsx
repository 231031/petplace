import { GetSearchCage, GetSearchCageByHotel } from "@/helper/cage";
import { useEffect, useState } from "react";



function TestSearch() {

    const [cages, setCages] = useState();

    useEffect(() => {
        const filterAnimal = [
            {
                animal_type: "dog",
                cage_size: "m",
            },
            {
                animal_type: "cat",
                cage_size: "s",
            },
        ]

        const filterSearchCage = {
            longitude: "100.4913737",
            latitude: "13.6526372",
            start_time: "2024-11-11",
            end_time: "2024-11-12",
            sort: "",
        }

        const profile_id = 1;
        const user_id = 2;

        const apiSearch = async () => {
            try {
                // const res = await GetSearchCage(filterAnimal, filterSearchCage);
                const res = await GetSearchCageByHotel(filterAnimal, filterSearchCage, profile_id, user_id);
                setCages(res.cages);
                console.log(res);
            } catch (err) {
                console.log(err);
            }
        }
        apiSearch()

    }, []);

    return (

        <div className="h-screen flex">
            <h3>TestSearch</h3>
        </div>
    )
}
export default TestSearch;