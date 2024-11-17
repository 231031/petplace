import InputBox from '../components/LoginSignup/InputBox';
import Button from '../components/LoginSignup/Button';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

export default function Login () {
    
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email: username, // Assuming the "username" state holds the email
                    password 
                }),
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log('Userid', data.user.id);
                localStorage.setItem("token", data.token);
                localStorage.setItem("userId", data.user.id)
                // console.log("localstorge", userId)
                console.log('Login successful:', data);
                navigate('/dashboard'); // Redirect to dashboard or desired page
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Login failed');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error(error);
        }
    };

    const SignupClick = () => {
        navigate('/Signup'); // นำทางไปยังหน้า /signin
      };

    return (
        <div className="h-screen flex">
            {/* container left */}
            <div className="flex justify-center bg-bgLogin w-3/4 items-baseline" > 
                <div className="flex flex-col  items-center w-1/2 gap-y-5 pt-64">
                    <h1 className="text-5xl mb-10"> Log in to your account </h1>
                    <div className='flex flex-col w-1/2 gap-y-2'>
                        <p className=''>Username</p>
                        <InputBox placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
                        <p className=''>Password</p>
                        <InputBox placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    {error && <p className="text-red-500">{error}</p>}
                    <div className="flex flex-row gap-x-3">
                        <p>Are you forget Password ? </p>
                        <a href="#" className="underline decoration-1"> Reset password </a>
                    </div>
                    <Button label="Log in" onClick={handleLogin}/>
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

