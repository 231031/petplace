import InputBox from '../components/InputBox';
import Button from '../components/Button'
import { useNavigate } from 'react-router-dom';
import React from 'react';

function Signup () {
    const navigate = useNavigate();
    const LoginClick = () => {
        navigate('/Login'); // นำทางไปยังหน้า /signin
      };

    return (

        <div className="h-screen flex">
            {/* container left */}
            <div className=" flex justify-center  w-1/4 items-baseline bg-cover bg-center " style={{backgroundImage: "url('/images/loginbg.png')"}}> 
            <div className="flex flex-col items-center w-4/5 pt-80 gap-y-5 text-white">
                    <h1 className="text-3xl"> Already have account? </h1>
                    <p>Log in and explore a Pet Place </p>
                    <Button label="Log in"  onClick={LoginClick}/>
                </div>
            </div>
            {/* container left */}

            {/* container right */}
            <div className="flex justify-center bg-bgLogin w-3/4 items-baseline" > 
                <div className="flex flex-col  items-center w-1/2 gap-y-5 pt-64">
                    <h1 className="text-3xl"> Sign Up </h1>
                    <p>Fill the form to sign up to Pet Place</p>
                    <div className='flex flex-wrap  gap-x-5 gap-y-5 pl-5 pt-5 '> 
                        <InputBox placeholder='Name'/>
                        <InputBox placeholder='Surname'/>
                        <input type="date" className='w-80 h-12 p-4 text-sm text-yellow rounded-lg bg-white 
                        placeholder:text-yellow border border-2 hover:border-yellow
                        focus:outline-none focus:border-yellow"'/>
                    </div>
                    <div className='flex flex-wrap gap-y-5 gap-x-5 pl-5'>
                        <InputBox placeholder='Email'/>
                        <InputBox placeholder='Citizen ID'/>
                        <InputBox placeholder='Password'/>
                        <InputBox placeholder='Confirm Password'/>
                    </div>
                    <Button label="Sign up"/>
                </div>
            </div>
            {/* container right */}
        </div>
    )
} 
export default Signup;