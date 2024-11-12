import InputBox from '../components/InputBox';
import Button from '../components/Button'
import { useNavigate } from 'react-router-dom';
import React from 'react';

export default function Login () {
    
    const navigate = useNavigate();
    const SignupClick = () => {
        navigate('/Signup'); // นำทางไปยังหน้า /signin
      };

    return (
        <div className="h-screen flex">
            {/* container left */}
            <div className="flex justify-center bg-bgLogin w-3/4 items-baseline" > 
                <div className="flex flex-col  items-center w-1/2 gap-y-5 pt-64">
                    <h1 className="text-3xl"> Log in to your account </h1>
                    <InputBox placeholder="Username" />
                    <InputBox placeholder="Password" />
                    <div className="flex flex-row gap-x-3">
                        <p>Are you forget Password ? </p>
                        <a href="#" className="underline decoration-1"> Reset password </a>
                    </div>
                    <Button label="Log in"/>
                </div>
            </div>
            {/* container right */}
            <div  className=" flex justify-center w-1/4 items-baseline bg-cover bg-center " style={{backgroundImage: "url('/images/loginbg.png')"}}> 
            <div className="flex flex-col items-center w-1/2 pt-80 gap-y-5 text-white">
                    <h1 className="text-3xl"> New Here ? </h1>
                    <p>Sign up and explore a petplace </p>
                    <Button label='Sign up' onClick={SignupClick}/>
                </div>
            </div>
        </div>
    )
}

