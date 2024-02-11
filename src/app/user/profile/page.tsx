'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { links } from '../links';


export default function Profile() {
  const [activeLink, setActiveLink] = useState(links[0].name);
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      console.log(file.name); // For demonstration purposes
    }
  };

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
        <h2 className="text-4xl font-semibold mb-8 text-white">Profile Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Top Big Box with larger profile picture */}
          <div className="md:col-span-1 bg-gray-800 p-5 rounded-lg shadow-xl">
            <div className="flex items-center">
              <Image
                src=''  // Replace with your image path
                width={160}
                height={160}
                className="rounded-full"
                alt="Avatar"
              />
              <div className="ml-4 text-white">
                <h3 className="text-2xl font-semibold">Howdy, John Doe!</h3>
              </div>
            </div>
            <div className="mt-8">
              <label className="block text-sm font-bold mb-2">Avatar</label>
              <input type="file" id="fileUpload" className="hidden" onChange={handleFileUpload} />
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 ease-in-out"
                onClick={() => {
                  const fileInput = document.getElementById('fileUpload');
                  if (fileInput) fileInput.click();
                }}
              >
                Upload
              </button>
              <p className="text-gray-400 text-xs mt-2">Max 500kb</p>
            </div>
          </div>

          {/* Name and Email Section */}
          <div className="md:col-span-2 bg-gray-800 p-5 rounded-lg shadow-xl">
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Name</label>
              <input type="text" defaultValue="John Doe" className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none" />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-bold mb-2">E-mail</label>
              <input type="email" defaultValue="doe.doe.doe@example.com" className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none" />
            </div>
            <div className="flex justify-end"  style={{ marginTop: '50px' }}>
              <button className="bg-blue-600 text-white px-8 py-2 rounded hover:bg-blue-700 transition duration-300 ease-in-out">
                Submit
              </button>
            </div>
          </div>

          {/* Password Section */}
          <div className="md:col-span-3 bg-gray-800 p-5 rounded-lg shadow-xl">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-bold mb-2">Current password</label>
                <input type="password" placeholder="Required" className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">New password</label>
                <input type="password" placeholder="Required" className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none" />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Confirm password</label>
              <input type="password" placeholder="Required" className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none" />
            </div>
            <div className="flex justify-end">
              <button className="bg-blue-600 text-white px-8 py-2 rounded hover:bg-blue-700 transition duration-300 ease-in-out">
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
