
function Signup () {
    return (
        <div className="h-screen flex">
            {/* container left */}
            <div className=" flex justify-center bg-orange-300 w-1/4 items-baseline"> 
            <div className="flex flex-col items-center w-4/5 pt-64 gap-y-5">
                    <h1 className="text-3xl"> Already have account? </h1>
                    <p>Log in and explore a Pet Place </p>
                    <a href="/Login" className="bg-white w-1/4 h-10 flex justify-center items-center">Log in</a>
                </div>
            </div>
            {/* container left */}

            {/* container right */}
            <div className="flex justify-center bg-gray-300 w-3/4 items-baseline" > 
                <div className="flex flex-col  items-center w-1/2 gap-y-5 pt-64">
                    <h1 className="text-3xl"> Sign Up </h1>
                    <p>Fill the form to sign up to Pet Place</p>
                    <input type="text" className="w-2/4 h-12" placeholder="Email"/>
                    <input type="text" className="w-2/4 h-12" placeholder="Password"/>
                    <input type="text" className="w-2/4 h-12" placeholder="Confirm Password"/>
                    <button className="bg-white w-1/5 h-10">Sign up</button>
                </div>
            </div>
            {/* container right */}
        </div>
    )
} 
export default Signup;