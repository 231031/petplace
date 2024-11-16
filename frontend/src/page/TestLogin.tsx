import { LoginUser } from "@/helper/auth";
import { useEffect, useState } from "react";

function TestLogin() {
    const [user, setUser] = useState();

    useEffect(() => {
        const payload = {
            email: "test2@gmail.com",
            password: "12345",
        };

        const apiLogin = async () => {
            try {
                const res = await LoginUser(payload);
                setUser(res.user);
                localStorage.setItem("token", res.token);
            } catch (err) {
                console.log(err);
            }
        };
        apiLogin();
    }, []);

    return (
        <div className="h-screen flex">
            <h3>TestLogin</h3>
        </div>
    );
}
export default TestLogin;
