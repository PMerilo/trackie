'use client'
import React, { useState } from 'react';

// Updated navigation links, assuming the same structure
const links = [
  { name: 'Profile Details', href: '/profileDetails' },
  { name: 'Camera Configuration', href: '/cameraConfig' },
  { name: 'Toggle Prediction', href: '/togglePrediction' },
];

export default function TogglePrediction() {
  const [predictionState, setPredictionState] = useState(false); // false for stopped, true for started
  const [activeLink, setActiveLink] = useState('Toggle Prediction');

  const togglePrediction = () => {
    setPredictionState(!predictionState);
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
        <h2 className="text-4xl font-semibold mb-8 text-white">Toggle Prediction</h2>

        {/* Enhanced System Status Indicator */}
        <div className="mb-8 flex items-center">
          <div
            className={`w-4 h-4 rounded-full mr-3 ${
              predictionState ? 'bg-green-400' : 'bg-red-400'
            }`}
          ></div>
          <h3 className="text-xl text-blue-400">System Status:</h3>
          <p className={`text-lg font-semibold ml-2 ${predictionState ? 'text-green-400' : 'text-red-400'}`}>
            {predictionState ? 'Detection Active' : 'Detection Stopped'}
          </p>
        </div>

        {/* Toggle Button */}
        <button
          onClick={togglePrediction}
          className={`px-8 py-2 rounded font-bold transition-all ease-in-out duration-300 outline-none focus:outline-none shadow-lg ${
            predictionState ? 'bg-red-600 hover:bg-red-700 hover:shadow-red-600/50' : 'bg-green-600 hover:bg-green-700 hover:shadow-green-600/50'
          } text-white transform hover:-translate-y-1`}
        >
          {predictionState ? 'Stop Detection' : 'Start Detection'}
        </button>

        {/* Additional Information */}
        <div className="mt-8">
          <h4 className="text-2xl text-white mb-4">About the Detection System</h4>
          <p className="text-gray-400">
            This system uses advanced camera surveillance to monitor dementia patients, ensuring their safety and well-being. By leveraging real-time detection, caregivers can be alerted to potential issues immediately, providing peace of mind and enhancing patient care.
          </p>
        </div>
      </div>
    </main>
  );
}
