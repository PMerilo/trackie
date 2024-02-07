"use client";

import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";

// Defines the shape of the action data expected from the API.
interface ActionData {
  [key: string]: number;
}

export default function Home() {
  // Flask API URL, either from the environment variable or a default value.
  const FLASK_API_URL =
    process.env.REACT_APP_FLASK_API_URL || "http://localhost:80";

  // State variables to manage the application state.
  const [isCameraEnabled, setCameraEnabled] = useState(false);
  const [actionData, setActionData] = useState<ActionData | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  // Ref to access the webcam component directly.
  const webcamRef = useRef<Webcam>(null);

  // Function to capture the webcam image, convert it to a blob, and send it to the API.
  const processImageAndSendToAPI = async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        const base64Response = await fetch(imageSrc);
        const blob = await base64Response.blob();

        try {
          const formData = new FormData();
          formData.append("file", blob, "upload.jpg");

          const response = await fetch(`${FLASK_API_URL}/detect-actions`, {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = (await response.json()) as ActionData;
          setActionData(data);
        } catch (error: any) {
          console.error(
            "There was an error sending the image to the API",
            error
          );
        }
      }
    }
  };

  // Function to start real-time action detection.
  const startRealTimeDetection = () => {
    if (webcamRef.current) {
      const id = setInterval(async () => {
        await processImageAndSendToAPI();
      }, 2000);
      setIntervalId(id);
    } else {
      console.error("Webcam not available for real-time detection.");
    }
  };

  // Function to stop real-time action detection.
  const stopRealTimeDetection = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  // Function to toggle real-time action detection on or off.
  const toggleRealTimeDetection = () => {
    if (isDetecting) {
      stopRealTimeDetection();
    } else {
      if (webcamRef.current) {
        startRealTimeDetection();
      }
    }
    setIsDetecting((prev) => !prev);
  };

  // useEffect to clean up the interval when the component unmounts or intervalId changes.
  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

  // Handler for changes in the camera enable/disable checkbox.
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "Camera") {
      setCameraEnabled(e.target.checked);
    }
  };

  // Render the component UI.
  return (
    <>
      <main className="min-h-screen bg-black">
        <div className="container mx-auto p-4">
          <div className="text-center mb-6">
            <button
              className={`px-4 py-2 rounded-md text-white font-bold ${
                isDetecting ? "bg-red-600" : "bg-green-600"
              }`}
              onClick={toggleRealTimeDetection}
            >
              {isDetecting
                ? "Stop Real-Time Detection"
                : "Start Real-Time Detection"}
            </button>
          </div>

          <div className="flex justify-center gap-4 items-start">
            <div className="flex flex-col items-center md:items-start w-1/4">
              <label
                key="Camera"
                className="flex items-center space-x-2 mb-4 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  name="Camera"
                  onChange={handleCheckboxChange}
                />
                <span className="label-text text-white">Camera</span>
              </label>
            </div>

            <div
              className="webcam-style rounded-lg shadow-2xl overflow-hidden w-1/2 ml-12 mr-12"
              style={{ height: "360px" }}
            >
              {isCameraEnabled ? (
                <Webcam ref={webcamRef} />
              ) : (
                <div className="w-full flex justify-center items-center bg-gray-200">
                  <span className="text-gray-500">Please click on Camera</span>
                </div>
              )}
            </div>
            <div className="action-display w-1/4">
              <h2 className="text-white font-bold">Predicted Action:</h2>
              {actionData ? (
                <div className="text-white">
                  {Object.entries(actionData).map(([action, value]) => (
                    <p key={action}>{`${action}: ${(value * 100).toFixed(
                      2
                    )}%`}</p>
                  ))}
                </div>
              ) : (
                <p className="text-white">No action detected yet.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
