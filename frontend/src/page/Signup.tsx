import React, { useState } from 'react';
import InputBox from '../components/LoginSignup/InputBox';
import InputBox2 from '../components/LoginSignup/InputBox2';
import Button from '../components/LoginSignup/Button';
import { useNavigate } from 'react-router-dom';
import UploadImage from "@/components/CreateProfile/UploadImage";
import { UploadRes } from '@/types/response';

function Signup() {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        dateOfBirth: '',
        email: '',
        password: '',
        confirmPassword: '',
        citizenId: '',
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const [images, setImages] = useState<UploadRes[]>([]);

    const handleImageUpload = (uploadedFiles: UploadRes[]) => {
        // setImages(res.profile.image_array ? res.profile.image_array.map((url) => ({ fileUrl: url, filePath: '', accountId: '0' })) : []);
        setImages(prev => [...prev, ...uploadedFiles].slice(0, 10));
        
    };

    const handleRemoveImage = (index: number) => {
        const updatedImages = images.filter((_, imgIndex) => imgIndex !== index);
        setImages(updatedImages);
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSignup = async () => {
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        const payload = {
            age: new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear(),
            citizen_id: formData.citizenId,
            email: formData.email,
            expiry: "2025-12-31", // Example value
            first_name: formData.name,
            // id: 1, // Replace or remove as necessary
            name: formData.name, // Duplicate to match API
            number: "123456789", // Example value
            password: formData.password,
            paypal_email: '', // Example value
            security_code: '', // Example value
            surename: formData.surname,
            
        };

        try {
            const response = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setSuccessMessage('Signup successful! Redirecting...');
                setTimeout(() => navigate('/login'), 2000); // Redirect after success
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Signup failed');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            // console.error(error);
        }

        
    };

    const LoginClick = () => {
        navigate('/Login');
    };

    return (
        <div className="h-screen flex">
            {/* container left */}
            <div
                className="flex justify-center w-1/4 items-baseline bg-cover bg-center"
                style={{ backgroundImage: "url('/images/loginbg.png')" }}
            >
                <div className="flex flex-col items-center w-4/5 pt-64 gap-y-5 text-white">
                    <h1 className="text-3xl">Already have an account?</h1>
                    <p>Log in and explore Pet Place</p>
                    <Button label="Log in" onClick={LoginClick} />
                </div>
            </div>
            {/* container right */}
            <div className="flex justify-center bg-bgLogin w-3/4 items-baseline">
                <div className="flex flex-col items-center w-1/2 gap-y-5 pt-36">
                    <h1 className="text-3xl">Sign Up</h1>
                    <p>Fill the form to sign up to Pet Place</p>
                    <div className="flex justify-center mt-10">
                        {images.map((image, index) => (
                            <div
                                key={index}
                                className="relative w-36 h-36 bg-gray-200 rounded-full overflow-hidden flex justify-center items-center mr-2"
                            >
                                <img
                                    src={image.fileUrl}
                                    alt={`Uploaded ${index}`}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-1"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                        {/* Show Upload button if the limit is not reached */}
                        {images.length < 1 && (
                            <div className="relative w-20 h-20 bg-gray-200 rounded-full flex justify-center items-center cursor-pointer">
                                <UploadImage
                                    limit={10 - images.length}
                                    onComplete={handleImageUpload}
                                />
                            </div>
                        )}
                        </div>
                    <div className="flex flex-wrap flex-row gap-x-5 gap-y-5 pl-5 pt-5 w-full">
                        <div className="flex flex-col gap-y-2">
                            <p>Name</p>
                            <InputBox2 placeholder="Name" name="name" value={formData.name} onChange={handleChange} />
                        </div>
                        <div className="flex flex-col gap-y-2">
                            <p>Surname</p>
                            <InputBox2 placeholder="Surname" name="surname" value={formData.surname} onChange={handleChange} />
                        </div>
                        <div className="flex flex-col gap-y-2">
                            <p>Date of Birth</p>
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                className="w-52 h-12 p-4 text-sm text-yellow rounded-lg bg-white 
                                           placeholder:text-yellow border border-2 border-bg hover:border-yellow
                                           focus:outline-none focus:border-yellow focus:ring-1 focus:ring-yellow"
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-y-5 gap-x-5 pl-5 mb-5">
                        <div className="flex flex-col gap-y-2">
                            <p>Email</p>
                            <InputBox placeholder="Email" name="email" value={formData.email} onChange={handleChange} />
                        </div>
                        <div className="flex flex-col gap-y-2">
                            <p>Password</p>
                            <InputBox placeholder="Password" name="password" type="password" value={formData.password} onChange={handleChange} />
                        </div>
                        <div className="flex flex-col gap-y-2">
                            <p>Citizen ID</p>
                            <InputBox placeholder="Citizen ID" name="citizenId" value={formData.citizenId} onChange={handleChange} />
                        </div>
                        <div className="flex flex-col gap-y-2">
                            <p>Confirm Password</p>
                            <InputBox placeholder="Confirm Password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} />
                        </div>
                    </div>
                    {error && <p className="text-red-500">{error}</p>}
                    {successMessage && <p className="text-green-500">{successMessage}</p>}
                    <Button label="Sign up" onClick={handleSignup} />
                </div>
            </div>
        </div>
    );
}

export default Signup;
