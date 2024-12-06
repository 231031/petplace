import InputBox from '../../components/LoginSignup/InputBox';
import Button from '../../components/LoginSignup/Button';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [image, setImage] = useState('');

    // Handle login action
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

            const data = await response.json();
            if (response.ok) {
                // Handle successful login (e.g., save token, navigate to another page)
                localStorage.setItem("token", data.token);
                localStorage.setItem("role", "client");
                localStorage.setItem("userId", data.user.id);
                localStorage.setItem("username", data.user.firstname);
                setImage(data.user.image_profile);
                navigate('/SelectProfile', { state: { image_profile: data.user.image_profile } });
            } else {
                toast.error(data);
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error(error);
        }
    };

    // Handle signup button click
    const SignupClick = () => {
        navigate('/Signup'); // Navigate to the signup page
    };

    return (
        <div className="h-screen flex">
            <Toaster position="top-center" reverseOrder={false} />
            {/* container left */}
            <div className="flex justify-center bg-bgLogin w-3/4 items-baseline">
                <div className="flex flex-col items-center w-1/2 gap-y-5 pt-64">
                    <h1 className="text-5xl mb-10"> Log in to your account </h1>
                    <div className='flex flex-col w-96 gap-y-2 items-center'>
                        <div className='flex justify-start w-80'>
                            <p>Username</p>
                        </div>
                        <InputBox placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
                        <div className='flex justify-start w-80'>
                            <p>Password</p>
                        </div>
                        <InputBox placeholder="Password" value={password} type="password" onChange={e => setPassword(e.target.value)} />
                    </div>
                    {error && <p className="text-red-500">{error}</p>}
                    {/* <div className="flex flex-row gap-x-3">
                        <p>Are you forget Password ? </p>
                        <a href="#" className="underline decoration-1"> Reset password </a>
                    </div> */}
                    <Button label="Log in" onClick={handleLogin} />
                </div>
            </div>
            {/* container right */}
            <div className="flex justify-center w-1/4 items-baseline bg-cover bg-center" style={{ backgroundImage: "url('/images/loginbg.png')" }}>
                <div className="flex flex-col items-center w-1/2 pt-80 gap-y-5 text-white">
                    <h1 className="text-3xl"> New Here ? </h1>
                    <p>Sign up and explore a petplace </p>
                    <Button label='Sign up' onClick={SignupClick} />
                </div>
            </div>
        </div>
    );
}