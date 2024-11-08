

export default function Login () {
    return (
        <div className="h-screen flex">
            {/* container left */}
            <div className="flex justify-center bg-gray-300 w-3/4 items-baseline" > 
                <div className="flex flex-col  items-center w-1/2 gap-y-5 pt-64">
                    <h1 className="text-3xl"> Log in to your account </h1>
                    <input type="text" className="w-2/4 h-12" placeholder="Username"/>
                    <input type="text" className="w-2/4 h-12" placeholder="Password"/>
                    <div className="flex flex-row gap-x-3">
                        <p>Are you forget Password ? </p>
                        <a href="#" className="underline decoration-1"> Reset password </a>
                    </div>
                    <button className="bg-white w-1/5 h-10">Log in</button>
                </div>
            </div>
            {/* container right */}
            <div className=" flex justify-center bg-orange-300 w-1/4 items-baseline"> 
            <div className="flex flex-col items-center w-1/2 pt-64 gap-y-5">
                    <h1 className="text-3xl"> New Here ? </h1>
                    <p>Sign up and explore a petplace </p>
                    <a href="/Signup" className="bg-white flex justify-center items-center w-1/2 h-10">Sign up</a>
                </div>
            </div>
        </div>
    )
}

