import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NavHotel: React.FC = () => {
  // State to manage menu open/close status
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // State to manage username
  const [username, setUsername] = useState<string | null>(null);
  // State to manage user ID
  // const [userId, setUserId] = useState<string | null>(null);
  // State to manage user role
  // const [role, setRole] = useState<string | null>("None");
  const navigate = useNavigate();

  // Fetch user data from localStorage when component loads
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    // const storedRole = localStorage.getItem('role');
    // const storedUserId = localStorage.getItem('userId');
    if (storedUsername) {
      setUsername(storedUsername);
      // setRole(storedRole);
      // setUserId(storedUserId);
    }
  }, [navigate]);

  // Toggle menu open/close status
  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle logout action
  const handleLogout = () => {
    // Remove user data from localStorage and navigate to login page
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('profile_id');
    localStorage.removeItem('profileID');
    localStorage.removeItem('name');
    setUsername("");
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
            <ul className="flex space-x-3 gap-x-20 text-lg">
              <li><a href="/hotelhome" className="text-white">Home</a></li>
              <li><a href="/HotelRating" className="text-white">Rating</a></li>
              <li><a href="/hotel/reservation/upcoming" className="text-white">Reservation</a></li>
            </ul>
          </div>

          {/* Profile Icon */}
          <div className="flex items-center space-x-4">
            {username ? (
              <button className="text-white text-sm bg-navname w-fit p-2 rounded-lg">{username}</button> // Display username if logged in
            ) : (
              <a href="/login" className="text-white">Log in</a> // Display login link if not logged in
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
                    <li><a href="/SelectProfile" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100"><span className="ml-3">Select Profile</span></a></li>
                    <li><a href="/" className="flex items-center p-2 text-base font-normal text-black-900 rounded-lg hover:bg-gray-100"><span className="ml-3">Hotel</span></a></li>
                    <li><button type="button" onClick={handleLogout} className="flex items-center p-2 text-base font-normal w-full text-black-900 rounded-lg hover:bg-gray-100"><span className="ml-3">Log out</span></button></li>
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

export default NavHotel;