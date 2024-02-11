'use client'

// Import necessary React and Next.js components
import React, { useState } from 'react';
import Image from 'next/image';
import { links } from '../links';


// CameraConfig component
export default function CameraConfig() {
  // Set the active link to "Camera Configuration" on page load
  const [activeLink, setActiveLink] = useState('Camera Configuration');

  return (
    <main className="bg-black p-10 min-h-screen text-gray-300 flex">
      {/* Sidebar */}
      <aside className="w-64 p-6 shadow-lg transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105">
        <nav>
          {links.map((link, index) => (
            <a
              href={link.href}
              key={index}
              onClick={() => setActiveLink(link.name)}
              className={`block mb-5 px-4 py-2 rounded-md ${
                activeLink === link.name
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              } transition duration-300 ease-in-out`}
            >
              {link.name}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-grow container mx-auto rounded-lg p-8 ml-6">
        <h2 className="text-4xl font-semibold mb-8 text-white">Camera Configuration</h2>
        {/* Form for RTSP URL */}
        <form className="bg-gray-800 p-5 rounded-lg shadow-xl">
          <div className="mb-6">
            <label className="block text-sm font-bold mb-2" htmlFor="rtspUrl">
              RTSP URL
            </label>
            <input
              type="text"
              id="rtspUrl"
              name="rtspUrl"
              placeholder="Enter RTSP URL"
              className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex justify-end">
            <button className="bg-blue-600 text-white px-8 py-2 rounded hover:bg-blue-700 transition duration-300 ease-in-out">
              Add
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
