import { LoginUser } from "@/helper/auth";
import { useEffect } from "react";

function TestLogin() {

    useEffect(() => {
        const payload = {
            email: "aaa@gmail.com",
            password: "1234"
        };

        const apiLogin = async () => {
            try {
                const res = await LoginUser(payload);
                localStorage.setItem("token", res.token);
                console.log(res);
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
