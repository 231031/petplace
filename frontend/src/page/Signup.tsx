import InputBox from '../components/ui/petch/InputBox';
import Button from '../components/ui/petch/Button';
import { useNavigate } from 'react-router-dom';


function Signup () {
    const navigate = useNavigate();
    const LoginClick = () => {
        navigate('/Login'); // นำทางไปยังหน้า /signin
      };

    return (

        <div className="h-screen flex">
            {/* container left */}
            <div className=" flex justify-center  w-1/4 items-baseline bg-cover bg-center" style={{backgroundImage: "url('/images/loginbg.png')"}}> 
            <div className="flex flex-col items-center w-4/5 pt-64 gap-y-5 text-white">
                    <h1 className="text-3xl"> Already have account? </h1>
                    <p>Log in and explore a Pet Place </p>
                    <Button label="Log in"  onClick={LoginClick}/>
                </div>
            </div>
            {/* container left */}

            {/* container right */}
            <div className="flex justify-center bg-bgLogin w-3/4 items-baseline" > 
                <div className="flex flex-col  items-center w-1/2 gap-y-5 pt-36">
                    <h1 className="text-3xl"> Sign Up </h1>
                    <p>Fill the form to sign up to Pet Place</p>
                    <div className='flex flex-wrap flex-row gap-x-5 gap-y-5 pl-5 pt-5 '> 
                        <div className='flex flex-col gap-y-2'>
                            <p>Name</p>
                            <InputBox placeholder='Name'/>
                        </div>
                        <div className='flex flex-col gap-y-2'>
                            <p>Surname</p>
                            <InputBox placeholder='Surname'/>
                        </div>
                        <div className='flex flex-col  gap-y-2'>
                            <p>Date of Birth</p>
                            <input type="date" className='w-80 h-12 p-4 text-sm text-yellow rounded-lg bg-white 
                            placeholder:text-yellow border border-2 border-bg hover:border-yellow
                            focus:outline-none focus:border-yellow focus:ring-1 focus:ring-yellow'/>
                        </div>
                    </div>
                    <div className='flex flex-wrap gap-y-5 gap-x-5 pl-5 mb-5'>
                        <div className='flex flex-col  gap-y-2'>
                            <p>Email</p>
                            <InputBox placeholder='Email'/>
                        </div>
                        <div className='flex flex-col  gap-y-2'>
                            <p>Password</p>
                            <InputBox placeholder='Password'/>
                        </div>
                        <div className='flex flex-col  gap-y-2'>
                            <p>Citizen ID</p>
                            <InputBox placeholder='Citizen ID'/>
                        </div>
                        <div className='flex flex-col  gap-y-2'>
                            <p>Confirm Password</p>
                            <InputBox placeholder='Confirm Password'/>
                        </div>
                        
                    </div>
                    <Button label="Sign up"/>
                </div>
            </div>
            {/* container right */}
        </div>
    )
} 
export default Signup;