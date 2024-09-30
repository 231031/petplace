import { useState } from 'react';

const Nav: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav>
      <div className="bg-white-900 p-4">
        <div className="flex items-center justify-between">
          
          {/*Logo & Name*/}
          <div className="flex items-center">
            <div className="text-black text-2xl font-bold">Pet Place</div>
          </div>
          
          {/*Navigation Links*/}
          <div className="hidden md:flex justify-center flex-grow space-x-4">
            <ul className="flex space-x-4">
              <li>
                <a href="/" className="text-black">Home</a>
              </li>
              <li>
                <a href="/hostel" className="text-black">Hostel</a>
              </li>
              <li>
                <a href="/care" className="text-black">Care</a>
              </li>
              <li>
                <a href="/delivery" className="text-black">Delivery</a>
              </li>
              <li>
                <a href="/shop" className="text-black">Shop</a>
              </li>
              <li>
                <a href="/social" className="text-black">Social</a>
              </li>
            </ul>
          </div>
          
          {/*Profile Icon*/}
          <div className="flex items-center space-x-4">
            <h1 className="text-black">Profile</h1>
            <div className="hidden md:block">
              <a href="/profile" className="text-black">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.28 0 4-1.72 4-4s-1.72-4-4-4-4 1.72-4 4 1.72 4 4 4z"></path>
                  <path d="M18 20h-12v-1c0-2 4-3 6-3s6 1 6 3v1z"></path>
                </svg>
              </a>
            </div>
            
            {/* Toggle Menu for mobile */}
            <div className="md:hidden">
              <button id="menu-toggle" className="text-black" onClick={toggleMenu}>
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  className="w-6 h-6"
                >
                  <path d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen ? (
        <ul className="flex-col md:hidden">
          <li className="px-3 py-3">
            <a href="/" className="text-black">Home</a>
          </li>
          <li className="px-3 py-3">
            <a href="/hostel" className="text-black">Hostel</a>
          </li>
          <li className="px-3 py-3">
            <a href="/care" className="text-black">Care</a>
          </li>
          <li className="px-3 py-3">
            <a href="/delivery" className="text-black">Delivery</a>
          </li>
          <li className="px-3 py-3">
            <a href="/shop" className="text-black">Shop</a>
          </li>
          <li className="px-3 py-3">
            <a href="/social" className="text-black">Social</a>
          </li>
        </ul>
      ) : null}
    </nav>

  );
};

export default Nav;
