import React from "react"

export default function FormSignupHotel () {
    return (
        <div className=" h-lvh items-baseline">
            <div className="flex justify-center pt-40">
                <div className="flex bg-orange-200 w-1/2 h-1/2 items-center justify-center flex-col gap-y-5 py-5">
                    <h1 className="text-4xl">Create your hotel’s profile</h1>
                    <p>Fill the form to crate your hotel’s profile</p>
                    <div className="w-3/4  flex flex-wrap justify-center gap-y-10 gap-x-5"> 
                        <input type="text" className=" w-2/5 h-12" placeholder="Hotel's Name"/>
                        <input type="text" className=" w-2/5 h-12" placeholder="Promtpay"/>
                        <input type="text" className=" w-2/5 h-12" placeholder="Tel Phone"/>
                        <input type="text" className=" w-2/5 h-12" placeholder="Email"/>
                        <input type="text" className=" w-2/5 h-12" placeholder="Date"/>
                        <input type="text" className=" w-2/5 h-12" placeholder="Month"/> 
                        <input type="text" className=" w-2/5 h-12" placeholder="Years"/> 
                        <input type="text" className=" w-2/5 h-12" placeholder="Years"/> 
                    </div>
                    <button className="bg-white w-1/5 h-10 mt-5">Sign up</button>
                </div>
            </div>
        </div>
    )
}