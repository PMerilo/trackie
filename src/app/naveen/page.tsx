'use client'

// Import necessary React and other libraries
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';  // For setting the document head tags
import Webcam from 'react-webcam';  // React component for webcam functionality
import ChartDataLabels from 'chartjs-plugin-datalabels';  // Plugin for Chart.js
import Link from 'next/link';
import 'chartjs-adapter-date-fns';
import { parse } from 'date-fns';
import { VideoCameraIcon, ViewfinderCircleIcon, ViewColumnsIcon, EyeIcon, FaceSmileIcon } from '@heroicons/react/24/outline';  // Icons for UI
import { Bar, Line } from 'react-chartjs-2';  // Bar chart component from Chart.js
import { Chart, ChartOptions, Scale, registerables } from 'chart.js';  // Chart.js library

// Registering components and plugins for Chart.js
Chart.register(...registerables);
Chart.register(ChartDataLabels);

// TypeScript interfaces for typing the emotion data and colors
interface EmotionData {
  [key: string]: number;
}

interface EmotionHistoryEntry {
  timestamp: string;
  emotions: EmotionData; // Assuming EmotionData is already defined as shown in your initial code
}

type EmotionColors = {
  [key in keyof EmotionData]?: string;
};

// Main component function
export default function Home() {
  // State variables and constants
  const FLASK_API_URL = process.env.REACT_APP_FLASK_API_URL || 'http://127.0.0.1:5000/';
  // States for camera, emotions, loading, errors, and intervals
  const [isCameraEnabled, setCameraEnabled] = useState(false);
  const [emotionData, setEmotionData] = useState<EmotionData | null>(null);
  const [emotionHistory, setEmotionHistory] = useState<EmotionHistoryEntry[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const webcamRef = useRef<Webcam>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedImageURL, setUploadedImageURL] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [highestEmotion, setHighestEmotion] = useState({emotion: '', value: 0});
  const buttonText = isDetecting ? 'Stop Real-Time Detection' : selectedFile ? 'Upload and Detect Emotions' : 'Start Real-Time Detection';
  


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      const imageURL = URL.createObjectURL(file);
      setUploadedImageURL(imageURL); // Set the uploaded image URL
    }
  };

  const uploadFile = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      setLoading(true);
      setError(''); // Clear any previous errors
  
      try {
        const response = await fetch(`${FLASK_API_URL}/detect-emotions`, {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Emotion data received:', data); // Debugging line
        setEmotionData(data);
        const timestamp = new Date().toLocaleTimeString('en-SG', { timeZone: 'Asia/Singapore' });
        setEmotionHistory((prevHistory) => {
          const updatedHistory = [
            ...prevHistory,
            { timestamp, emotions: data }
          ];
          console.log('Previous emotionHistory:', prevHistory);
          console.log('New emotionHistory entry:', { timestamp, emotions: data });
          console.log('Updated emotionHistory:', updatedHistory);
          return updatedHistory;
        })
      } catch (error) {
        let errorMessage = 'Error uploading file: ';
        if (error instanceof Error) {
          // If it's an Error object, we can access the message property
          errorMessage += error.message;
        } else {
          // If it's not an Error object, we'll simply add that we encountered an unknown error
          errorMessage += 'An unknown error occurred.';
        }
        setError(errorMessage); // Update the error state with the appropriate message
        console.error(errorMessage, error);
      } finally {
        setLoading(false)
      }
    }
  };

  // Function to send the image to the Flask API for emotion detection
  const sendImageToAPI = async (imageSrc: string | Blob) => {
    setLoading(true);
    setError('');

    // Create a FormData object and append the image as a blob
    try {
      const formData = new FormData();
      if (typeof imageSrc === 'string') {
          const base64Response = await fetch(imageSrc);
          const blob = await base64Response.blob();
          formData.append('file', blob, 'upload.jpg');
      } else {
          // If the image source is a blob, append it directly
          formData.append('file', imageSrc, 'upload.jpg');
      }

      // Send a POST request to the API endpoint with the image
      const response = await fetch(`${FLASK_API_URL}/detect-emotions`, {
          method: 'POST',
          body: formData,
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse the JSON response and update state
      const data = await response.json() as EmotionData;
      console.log('Received data:', data); // Log the received data
      setEmotionData(data);
      const timestamp = new Date().toLocaleTimeString('en-SG', { timeZone: 'Asia/Singapore' });
      setEmotionHistory((prevHistory) => {
        const updatedHistory = [
          ...prevHistory,
          { timestamp, emotions: data }
        ];
        console.log('Previous emotionHistory:', prevHistory);
        console.log('New emotionHistory entry:', { timestamp, emotions: data });
        console.log('Updated emotionHistory:', updatedHistory);
        return updatedHistory;
      })
      console.log('Updated emotionData state:', emotionData); // Log the updated state
    } catch (error: any) {
        setError('Failed to send image to API.');
        console.error('There was an error sending the image to the API', error);
    } finally {
        setLoading(false);
    }
  };

  // Helper function to process an image URL and send it to the API
  const processImageAndSendToAPI = async (imageSrc: string) => {
    try {
      // Convert image URL to a blob and then send it to the API
      const base64Response = await fetch(imageSrc);
      const blob = await base64Response.blob();
      await sendImageToAPI(blob);
    } catch (error) {
      console.error('Error in processImageAndSendToAPI:', error);
    }
  };

  

  // Function to start real-time emotion detection
  const startRealTimeDetection = () => {
    if (webcamRef.current) {
      // Create an interval to capture and send images at regular intervals
      const id = setInterval(async () => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
          await processImageAndSendToAPI(imageSrc);
        }
      }, 2000); // Adjust the interval as needed
      setIntervalId(id);
    } else {
      console.error('Webcam not available for real-time detection.');
    }
  };

  // Function to stop real-time emotion detection
  const stopRealTimeDetection = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
      setIsDetecting(false);
  
      // Wait for the last set of emotions to be processed before showing the modal
      setTimeout(() => {
        setShowModal(true);
        console.log('Showing emotion over time modal');
      }, 2000); // Adjust timeout as needed
    }
  };
  
  // Function to toggle real-time emotion detection on or off
  const toggleRealTimeDetection = () => {
    console.log(`Toggling real-time detection. Currently detecting: ${isDetecting}`);
    if (isDetecting) {
      stopRealTimeDetection();
    } else {
      if (webcamRef.current) {
        startRealTimeDetection();
      }
    }
    setIsDetecting((prev) => !prev);
  };
  

  // This effect updates the highest emotion when emotionData changes
  useEffect(() => {
    console.log('Component updated with emotionHistory:', emotionHistory);
    console.log('Chart data for rendering:', chartData2);
  }, [emotionHistory]);

    // Combined function to handle both real-time detection and file upload
    const handleAction = async () => {
      if (isCameraEnabled) {
        toggleRealTimeDetection();
      } else if (selectedFile) {
        await uploadFile();
      }
    };

  // Function to determine the color of each emotion in the chart
  const chartDataStyle = (emotion: keyof EmotionData): string => {
    const emotionColors: EmotionColors = {
      Happy: 'rgba(255, 206, 86, 0.2)',  // Yellow
      Sad: 'rgba(54, 162, 235, 0.2)',    // Blue
      Angry: 'rgba(255, 99, 132, 0.2)',  // Red
      Fear: 'rgba(153, 102, 255, 0.2)',  // Purple
      Surprise: 'rgba(255, 159, 64, 0.2)', // Orange
      Disgust: 'rgba(75, 192, 192, 0.2)', // Teal
      Neutral: 'rgba(201, 203, 207, 0.2)'  // Grey
    };
    return emotionColors[emotion] || 'rgba(75, 192, 192, 0.2)';
  };

  // Function to convert emotion data to chart format
  const getChartData = (emotionData: EmotionData) => {
    if (!emotionData) {
      return { labels: [], datasets: [] };
    }
    const labels = Object.keys(emotionData);
    const dataValues = labels.map(label => emotionData[label]);
    const chartData = {
      labels,
      datasets: [
        {
          label: 'Emotion Probabilities',
          data: dataValues,
          backgroundColor: labels.map(label => chartDataStyle(label as keyof EmotionData)),
          borderColor: labels.map(label => chartDataStyle(label as keyof EmotionData)),
        },
      ],
    };
    return chartData;
  };

  const chartData2 = emotionHistory.length > 0 ? {
    labels: emotionHistory.map(entry => {
      const parsedDate = parse(entry.timestamp, 'hh:mm:ss a', new Date());
      console.log('Parsed date:', parsedDate);
      return parsedDate;
    }),
    datasets: Object.keys(emotionHistory[0].emotions).map(key => {
      return {
        label: key,
        // Make sure to multiply by 100 to convert to percentages
        data: emotionHistory.map(entry => entry.emotions[key] * 100),
        fill: 'origin',
        backgroundColor: chartDataStyle(key as keyof EmotionData),
        borderColor: chartDataStyle(key as keyof EmotionData),
        pointBackgroundColor: chartDataStyle(key as keyof EmotionData),
        tension: 0.3
      };
    })
  } : { labels: [], datasets: [] };
  

  // Options for the bar chart
  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        color: '#fff',
        anchor: 'end',
        align: 'top',
        formatter: (value, context) => {
          return `${(value * 100).toFixed(2)}%`;
        }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            if (typeof value === 'number') {
              return `${label}: ${(value * 100).toFixed(2)}%`;
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: number | string) {
            if (typeof value === 'number') {
              return `${(value * 100).toFixed(0)}%`;
            }
            return value;
          },
        },
        title: {
          display: true,
          text: 'Probability', // make sure the label is shown
          color: '#ffffff',
        }
      },
      x: {
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: 'Emotions', // x-axis label
          color: '#ffffff',
        }
      }
    }
  };

  const options2: ChartOptions<"line"> = {
    scales: {
      x: {
        type: 'time',
        time: {
          // Specify the display format for the ticks on the X-axis
          displayFormats: {
            minute: 'hh:mm a', // Use a format that spreads out the labels appropriately
          },
        },
        title: {
          display: true,
          text: 'Time'
        },
        ticks: {
          // Prevent overlapping by limiting the maximum number of ticks
          maxTicksLimit: 10
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Emotion Probability (%)'
        },
        ticks: {
          maxTicksLimit: 10,
          // Format the ticks to reduce decimal places
          callback: (value) => {
            // Check if the value is a number before calling toFixed
            if (typeof value === 'number') {
              return value.toFixed(2) + '%';
            }
            return value; // Or handle the string case as needed
          }
        }
      }
    },
    plugins: {
      datalabels: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
      legend: {
        display: true
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    elements: {
      line: {
        fill: 'origin', // This will color the area under the line
      },
      point: {
        radius: 0 // This will remove the points on the line
      }
    }
  };
  
return (
  <>
    <Head>
      <title>Emotion Recognition</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main className="min-h-screen bg-black text-white">
      <div className="container mx-auto p-4">
        <h1 className="text-5xl font-bold text-center mb-6" style={{ marginTop: '40px' }}>Emotion Recognition</h1>

        <div className="flex flex-col lg:flex-row justify-center items-start gap-8 mt-6 lg:mt-24">
          {/* Webcam and File Upload Column */}
          <div className="webcam-container lg:w-1/2 space-y-4">
            {/* Camera Option and Start Button */}
            <div className="flex flex-row justify-between items-center w-full mb-4">
              {/* Camera Checkbox */}
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="checkbox checkbox-primary" checked={isCameraEnabled} onChange={() => setCameraEnabled(!isCameraEnabled)} />
                <span>Camera</span>
                <VideoCameraIcon className="h-6 w-6 text-blue-500" />
              </label>

              {/* Start Real-Time Detection Button */}
              {/* <button
                className={`px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg shadow-lg transition duration-200 ${isDetecting ? 'from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700' : ''}`}
                onClick={toggleRealTimeDetection}
              >
                {isDetecting ? 'Stop' : 'Start'} Real-Time Detection
              </button> */}
            </div>


            {/* Webcam Section */}
            <div className="webcam-style w-full rounded overflow-hidden" style={{ height: '420px' }}>
              {isCameraEnabled ? (
                <Webcam ref={webcamRef} audio={false} screenshotFormat="image/jpeg" width="100%" />
              ) : uploadedImageURL ? (
                <img src={uploadedImageURL} alt="Uploaded Emotion" style={{ width: '100%', height: '420px', objectFit: 'cover' }} />
              ) : (
                <div className="bg-gray-700 flex justify-center items-center w-full h-full">
                  <span>Please upload an Image or click on Camera to enable Webcam</span>
                </div>
              )}
            </div>

            {/* File Upload Section */}
            <div className="file-upload w-full">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Upload file</label>
              <input 
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 mb-2"
                id="file_input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <button 
                className={`text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800 w-full transition duration-200 ${isDetecting ? 'from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700' : ''}`}
                onClick={handleAction}
                disabled={!selectedFile && !isCameraEnabled}
              >
                {buttonText}
              </button>
            </div>
          </div>

          {/* Prediction Column */}
          <div className="prediction-container lg:w-1/2" style={{ marginTop: '40px' }}>
            {/* Predicted Emotion Chart */}
            <div className="graphical-visualization rounded-lg border border-white shadow-2xl overflow-hidden" style={{ height: '420px', width: '100%', maxWidth: '720px' }}>
              <h2 className="text-xl font-semibold text-center mt-2 mb-4">Predicted Emotion: {highestEmotion.emotion ? `${highestEmotion.emotion} (${(highestEmotion.value * 100).toFixed(2)}%)` : 'Calculating...'}</h2>
              {emotionData ? (
                <Bar data={getChartData(emotionData)} options={options} />
              ) : (
                <span className="flex justify-center">No emotion detected yet.</span>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Modal */}
      {showModal && (
        <>
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '40px',
            zIndex: 1050,
            width: '80%',
            maxWidth: '900px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h2 style={{ marginBottom: '20px', fontSize: '24px', color: '#333' }}>Emotion Over Time</h2>
            <Line key={emotionHistory.length} data={chartData2} options={options2} />
            <button onClick={() => setShowModal(false)} style={{ color: 'red', fontSize: '16px', padding: '10px 20px', cursor: 'pointer', marginTop: '20px' }}>
              Close
            </button>
          </div>
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000
          }} onClick={() => setShowModal(false)}></div>
        </>
      )}

    </main>



    <style jsx>{`
      .webcam-style {
        position: relative;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      .checkbox-primary:checked + svg {
        color: #3ABFF8;
      }

      .checkbox-primary:checked + span {
        color: #3ABFF8;
      }

      .graphical-visualization {
        position: relative;
        overflow: hidden;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      @media (max-width: 768px) {
        .webcam-style, .graphical-visualization {
          width: 100%;
          margin-bottom: 1rem;
        }
      }
    `}</style>
  </>
);  
}
