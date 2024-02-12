'use client'

// Import necessary React and Next.js components
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { links } from '../links';

// CameraConfig component
export default function CameraConfig() {
  // Set the active link to "Camera Configuration" on page load
  const [activeLink, setActiveLink] = useState('Camera Configuration');
  const [RTSP, setRTSP] = useState('')
  const [loading, setLoading] = useState(true)
  const [exists, setExist] = useState(false)

  
  async function getUserRTSPConfig() {
    const res = await fetch(`/api/rtsp`)
    if (!res.ok) {
        throw new Error(await res.text())
    }
    setLoading(false)
    return await res.json()
  }
  async function setUserRTSPConfig(src: string) {
    const res = await fetch(`/api/rtsp`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      
      body: JSON.stringify({ src })
    })
    if (!res.ok) {
      throw new Error(await res.text())
    }
    setLoading(false)
    setExist(true)
    return await res.json()
  }
  async function updateUserRTSPConfig(src: string) {
    const res = await fetch(`/api/rtsp`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ src })
    })
    console.log(res);
    
    if (!res.ok) {
      throw new Error(await res.text())
    }
    setLoading(false)
    return await res.json()
  }
  async function deleteUserRTSPConfig() {
    setLoading(true)
    const res = await fetch(`/api/rtsp`,{
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (!res.ok) {
        throw new Error(await res.text())
    }
    setLoading(false)
    setExist(false)
    setRTSP('')
    return await res.json()
  }

  useEffect(()=> {
    getUserRTSPConfig()
    .then((str) => {
      if (str != '') {
        setExist(true)
      }
      setRTSP(str)
    })
  }, [])
  
  function rtspHandler() {
    setUserRTSPConfig(RTSP)
    setLoading(true)
  }

  function SubmitButton() {
    const text = exists ? "Update" : "Add"
    const apiCall = exists ? updateUserRTSPConfig : setUserRTSPConfig
    return (
      <button className="bg-blue-600 text-white px-8 py-2 rounded hover:bg-blue-700 transition duration-300 ease-in-out" role='button' onClick={() => {if (RTSP) apiCall(RTSP)}}>
        {loading ? <span className="loading loading-spinner"></span> : text}
      </button>
    )
  }
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
        <form className="bg-gray-800 p-5 rounded-lg shadow-xl" onSubmit={(e) => e.preventDefault()}>
          <div className="mb-6">
            <label className="block text-sm font-bold mb-2" htmlFor="rtspUrl">
              RTSP URL
            </label>
            <input
              required
              disabled={loading}
              type="text"
              id="rtspUrl"
              name="rtspUrl"
              placeholder="rtsp://username:password@ip:port"
              className={`w-full p-3 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none ${loading && "disabled"}`}
              value={RTSP}
              onChange={(e) => setRTSP(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-x-4">
            {exists && <button className="bg-red-600 text-white px-8 py-2 rounded hover:bg-red-700 transition duration-300 ease-in-out" role='button' onClick={() => {if (exists) deleteUserRTSPConfig()}}>
              {loading ? <span className="loading loading-spinner"></span> : "Clear"}
            </button>}
            <SubmitButton/>
          </div>
        </form>
      </div>
    </main>
  );
}
