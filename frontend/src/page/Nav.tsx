import React from 'react';
import { useState } from 'react';

const Nav: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav>
      <div className="bg-navbar p-4">
        <div className="flex items-center justify-between h-6">
          
          {/*Logo & Name*/}
          <div className="flex items-center">
            <div className="text-white text-2xl font-bold">Pet Place</div>
          </div>
          
          {/*Navigation Links*/}
          <div className="hidden md:flex justify-center flex-grow space-x-4">
            <ul className="flex space-x-4">
              <li>
                <a href="/" className="text-white"></a>
              </li>
              <li>
                <a href="/hotel" className="text-white">Hotel</a>
              </li>
              <li>
                <a href="/care" className="text-white">Care</a>
              </li>
              <li>
                <a href="/delivery" className="text-white">Delivery</a>
              </li>
              <li>
                <a href="/shop" className="text-white">Shop</a>
              </li>
              <li>
                <a href="/social" className="text-white">Social</a>
              </li>
            </ul>
          </div>
          
          {/*Profile Icon*/}
          <div className="flex items-center space-x-4">
            <a href="/Login" className="text-white">Log in</a>
            <div className="hidden md:block">
              <button onClick={toggleMenu} className="text-white">
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
              </button>
            </div>

            {isMenuOpen && (
                  <aside id="default-sidebar" className="fixed top-16 right-0 z-40 w-64 h-screen transition-transform translate-x-0">
                    <div className="overflow-y-auto py-5 px-3 h-auto bg-gray-100 border border-gray-900">
                      <ul className="space-y-2">
                        <li>
                          <a href="/profile" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100">
                            <span className="ml-3">Profile</span>
                          </a>
                        </li>
                        <li>
                          <a href="/hotel" className="flex items-center p-2 text-base font-normal text-black-900 rounded-lg hover:bg-gray-100">
                            <span className="ml-3">Hotel</span>
                          </a>
                        </li>
                        {/* Care button */}
                        <li>
                            <button type="button" className="flex items-center p-2 w-full text-base font-normal text-black-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-black dark:hover:bg-gray-100">
                                  <span className="flex-1 ml-3 text-left">Care</span>
                                <svg aria-hidden="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                            </button>
                        </li>
                        {/* Delivery button */}
                        <li>
                            <a href="/delivery" className="flex items-center p-2 w-full text-base font-normal text-black-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-black dark:hover:bg-gray-100">
                                <span className="flex-1 ml-3 whitespace-nowrap">Delivery</span>
                            </a>
                        </li>
                        {/* Shop button */}
                        <li>
                            <button type="button" className="flex items-center p-2 w-full text-base font-normal text-black-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-black dark:hover:bg-grey-700">
                                <span className="flex-1 ml-3 text-left whitespace-nowrap">Shop</span>
                                <svg aria-hidden="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                            </button>
                        </li>
                        {/* Social button */}
                        <li>
                            <a href="/social" className="flex items-center p-2 w-full text-base font-normal text-black-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-black dark:hover:bg-grey-700">
                                <span className="ml-3">Social</span>
                            </a>
                        </li>
                        <li>
                            <button type="button" className="flex items-center p-2 w-full text-base font-normal text-black-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-black dark:hover:bg-grey-700" >
                                <span className="flex-1 ml-3 text-left whitespace-nowrap">Logout</span>
                            </button>
                        </li>
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
