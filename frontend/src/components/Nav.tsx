import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Nav: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>("None");
  const navigate = useNavigate();

  // ดึงชื่อผู้ใช้จาก localStorage เมื่อ component โหลด
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedRole = localStorage.getItem('role');
    if (storedUsername) {
      setUsername(storedUsername);
      setRole(storedRole);
      console.log("username",username)
    }
  }, [navigate]);

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    // ลบข้อมูลจาก localStorage และนำทางไปหน้า Login
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    setUsername("")
    navigate('/login');
  };

  

  return (
    <nav>
      <div className="bg-navbar p-4">
        <div className="flex items-center justify-between h-6">
          {/* Logo & Name */}
          <div className="flex items-center">
            <img src="/images/logo.png" alt="Pet Place Logo" className="w-20 h-auto p-2" />
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex justify-center flex-grow space-x-4">
            <ul className="flex space-x-4">
              <li><a href="/" className="text-white">Home</a></li>
              <li><a href="/hotel" className="text-white">Hotel</a></li>
              <li><a href="/care" className="text-white">Care</a></li>
              <li><a href="/delivery" className="text-white">Delivery</a></li>
              <li><a href="/shop" className="text-white">Shop</a></li>
              <li><a href="/social" className="text-white">Social</a></li>
            </ul>
          </div>

          {/* Profile Icon */}
          <div className="flex items-center space-x-4">
            {username ? (
              
              <button  className="text-white text-sm bg-navname w-fit p-2 rounded-lg  ">{role} | {username}</button> // ปุ่ม Logout แทน Log in
            ) : (
              <a href="/login" className="text-white">Log in</a> // ถ้ายังไม่ได้ล็อกอิน
            )}

            <div className="hidden md:block">
              <button onClick={toggleMenu} aria-label="Toggle menu" className="text-white">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 12c2.28 0 4-1.72 4-4s-1.72-4-4-4-4 1.72-4 4 1.72 4 4 4z"></path>
                  <path d="M18 20h-12v-1c0-2 4-3 6-3s6 1 6 3v1z"></path>
                </svg>
              </button>
            </div>

            {isMenuOpen && (
              <aside id="default-sidebar" className="fixed top-14 right-0 z-40 w-64 h-screen transition-transform translate-x-0">
                <div className="overflow-y-auto py-5 px-3 h-full bg-navbar border-r border-gray-200">
                  <ul className="space-y-2">
                    <li><a href="/CreateProfile" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100"><span className="ml-3">Create Profile</span></a></li>
                    <li><a href="/profile" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100"><span className="ml-3">Profile</span></a></li>
                    <li><a href="/hotel" className="flex items-center p-2 text-base font-normal text-black-900 rounded-lg hover:bg-gray-100"><span className="ml-3">Hotel</span></a></li>
                    <li><a href="/care" className="flex items-center p-2 text-base font-normal text-black-900 rounded-lg hover:bg-gray-100"><span className="ml-3">Care</span></a></li>
                    <li><a href="/delivery" className="flex items-center p-2 text-base font-normal text-black-900 rounded-lg hover:bg-gray-100"><span className="ml-3">Delivery</span></a></li>
                    <li><a href="/shop" className="flex items-center p-2 text-base font-normal text-black-900 rounded-lg hover:bg-gray-100"><span className="ml-3">Shop</span></a></li>
                    <li><a href="/social" className="flex items-center p-2 text-base font-normal text-black-900 rounded-lg hover:bg-gray-100"><span className="ml-3">Social</span></a></li>
                    <li><button type="button" onClick={handleLogout} className="flex items-center p-2 text-base font-normal text-black-900 rounded-lg hover:bg-gray-100"><span className="ml-3">Log out</span></button></li>
                  </ul>
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
