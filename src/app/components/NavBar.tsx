'use client'

import { useState } from 'react';
import Link from 'next/link';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-black px-2 sm:px-4 py-2.5 rounded-md absolute inset-x-0 top-0">
      <div className="container flex flex-wrap gap-x-40 justify-evenly items-center mx-auto px-64">
        <Link href="/" className='p-2.5'>
          <span className="flex items-center cursor-pointer">
            <img src="https://flowbite.com/docs/images/logo.svg" className="w-16 h-16" alt="Flowbite Logo" />
          </span>
        </Link>
        <div className="flex items-center md:order-2 relative">
          <button type="button" onClick={toggleDropdown} className="text-white focus:ring-4 focus:outline-none rounded-lg text-sm p-2.5">
            <span className="sr-only">Open user menu</span>
            <img className="w-16 h-16 rounded-full" src="https://img.icons8.com/?size=80&id=0lg0kb05hrOz&format=png" alt="user photo" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 text-base list-none divide-y divide-gray-600 rounded-md shadow-lg w-48 bg-black">
              <div className="py-3 px-4">
                <span className="block text-sm text-gray-200">Naveen Bharathi</span>
                <span className="block text-sm font-medium text-gray-400 truncate">name@test.com</span>
              </div>
              <ul className="py-1" aria-labelledby="user-menu-button">
                <li>
                  <a href="/user/profile" className="block py-2 px-4 text-sm text-gray-200 hover:bg-gray-600">Profile</a>
                </li>
                <li>
                  <a href="/user/settings" className="block py-2 px-4 text-sm text-gray-200 hover:bg-gray-600">Settings</a>
                </li>
                <li>
                  <a href="/user/model" className="block py-2 px-4 text-sm text-gray-200 hover:bg-gray-600">Model</a>
                </li>
                <li>
                  <a href="#" className="block py-2 px-4 text-sm text-gray-200 hover:bg-gray-600">Login</a>
                </li>
                <li>
                  <a href="#" className="block py-2 px-4 text-sm text-gray-200 hover:bg-gray-600">Sign Up</a>
                </li>
                <li>
                  <a href="#" className="block py-2 px-4 text-sm text-gray-200 hover:bg-gray-600">Sign out</a>
                </li>
              </ul>
            </div>
          )}
          <button data-collapse-toggle="navbar-user" type="button" className="inline-flex items-center p-2 text-sm text-gray-200 rounded-lg md:hidden hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600" aria-controls="navbar-user" aria-expanded="false">
            <span className="sr-only">Open main menu</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
        <div className="hidden justify-between items-center w-full md:flex md:w-auto md:order-1" id="navbar-user">
          <ul className="flex flex-col p-2.5 mt-4 bg-gray-800 rounded-lg border border-gray-700 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-transparent">
            <li>
              <Link href="/caretaker" className='btn h-16'>
                <span className="block py-2 pr-4 pl-3 text-white rounded md:bg-transparent md:p-0" aria-current="page">Caretaker Home</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
