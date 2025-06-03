import { GetProfileByID, UpdateProfile } from "@/helper/profile";
import { ProfileRes } from "@/types/response";
import { useEffect, useState } from "react";


function TestProfile() {

    const [profile, setProfile] = useState<ProfileRes>();
    const payload = {
        address: "555/55 Main Street",
        check_in: "15:00",
        check_out: "15:00",
        latitude: 100.77,
        longitude: 14.53,
        name: "hotel2 test",
        paypal_email: "sb-rllk333875244@personal.example.com",
        role: "hotel",
        tel: "334224",
        id: 2,
        user_id: 4,
    }

    async function HandleUpdate() {
        try {
            const res = await UpdateProfile(payload);
            console.log(res);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const apiProfile = async () => {
            try {
                const res = await GetProfileByID(4, "hotel");
                console.log(res);
                setProfile(res);
                localStorage.setItem("token", res.token);
            } catch (err) {
                console.log(err);
            }
        }
        apiProfile()

    }, []);

    return (

        <div className="h-screen flex">
            <h3>TestProfile</h3>
            <button type="button" onClick={() => HandleUpdate()} className="bg-slate-500 absolute left-1/2">{profile?.profile.name}</button>
        </div>
    )
}
export default TestProfile;