'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import 'chartjs-adapter-date-fns';
import { parse, parseISO } from 'date-fns';
import { Bar, Line } from 'react-chartjs-2';
import { Chart, ChartOptions, registerables } from 'chart.js';
import Twilio from 'twilio';


const Home: React.FC = () => {
  const [isCameraEnabled, setCameraEnabled] = useState<boolean>(false);
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [showDetections, setShowDetections] = useState(true);
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [showExpressions, setShowExpressions] = useState(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [emotionHistory, setEmotionHistory] = useState<EmotionHistoryEntry[]>([]);
  const [emotionChartData, setEmotionChartData] = useState<{labels: string[], data: number[]}>({
    labels: [],
    data: []
  });
  const [highestEmotion, setHighestEmotion] = useState<{ name: string; percentage: number } | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const buttonText = isDetecting ? 'Stop Real-Time Detection' : 'Start Real-Time Detection';
  const [chartInstance, setChartInstance] = useState(null);
  const chartRef = useRef<any>(null);
  const [emotionCounters, setEmotionCounters] = useState({
    happy: 0,
    sad: 0,
    angry: 0,
    fear: 0,
    surprise: 0,
    disgust: 0,
    neutral: 0,
  });


  Chart.register(...registerables);
  Chart.register(ChartDataLabels);

  type EmotionColors = {
    [key in keyof typeof faceapi.FaceExpressions as string]?: string;
  };

  type EmotionData = {
    [K in keyof typeof faceapi.FaceExpressions]?: number;
  };

  type EmotionHistoryEntry = {
    timestamp: string;
    emotions: EmotionData;
  };

  type Emotion = 'happy' | 'sad' | 'angry' | 'fear' | 'surprise' | 'disgust' | 'neutral';
  type EmotionCounters = {
    [key in Emotion]: number;
  };

  const emotionColors: EmotionColors = {
    happy: 'rgba(255, 206, 86, 0.2)',
    sad: 'rgba(54, 162, 235, 0.2)',
    angry: 'rgba(255, 99, 132, 0.2)',
    fear: 'rgba(153, 102, 255, 0.2)',
    surprise: 'rgba(255, 159, 64, 0.2)',
    disgust: 'rgba(201, 203, 207, 0.2)',
    neutral: 'rgba(75, 192, 192, 0.2)'
  };

  const loadModels = async () => {
    const MODEL_URL = '/EmoRecogModels';
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
    ]);
  };

  useEffect(() => {
    loadModels();
  }, []);

  useEffect(() => {
    setShowDetections(isCameraEnabled);
    setShowLandmarks(isCameraEnabled);
    setShowExpressions(isCameraEnabled);
  }, [isCameraEnabled]);

  const getDominantEmotion = (expressions: faceapi.FaceExpressions): { emotion: string, probability: number } => {
    let maxEmotion: string = '';
    let maxValue = 0;

    for (const [emotion, value] of Object.entries(expressions)) {
      if (value > maxValue) {
        maxValue = value;
        maxEmotion = emotion;
      }
    }

    return { emotion: maxEmotion, probability: maxValue };
  };

  type Emotions = {
    [K in keyof typeof faceapi.FaceExpressions]?: number;
  };

  const captureEmotion = useCallback(async () => {
    if (webcamRef.current && canvasRef.current) {
      const video = webcamRef.current.video;
      const canvas = canvasRef.current;
      if (video && video.readyState === 4) {
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;
        canvas.width = videoWidth;
        canvas.height = videoHeight;

        const displaySize = { width: videoWidth, height: videoHeight };
        faceapi.matchDimensions(canvas, displaySize);

        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
          const img = new Image();
          img.onload = async () => {
            const detections = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
              .withFaceLandmarks()
              .withFaceExpressions();

            if (detections.length > 0) {
              detections.forEach((detection, index) => {
                console.log(`Detection ${index + 1}:`, detection.expressions);
              });
              const emotions: Emotions = detections.reduce((acc, detection) => {
                const expressions = detection.expressions as Emotions;
                for (const [emotion, value] of Object.entries(expressions)) {
                  const emotionKey = emotion as keyof Emotions;
                  acc[emotionKey] = (acc[emotionKey] || 0) + (value as number);
                }
                return acc;
              }, {} as { [key: string]: number });

              let maxEmotionName = '';
              let maxEmotionValue = 0;
              Object.entries(emotions).forEach(([key, value]) => {
                if (value > maxEmotionValue) {
                  maxEmotionValue = value;
                  maxEmotionName = key;
                }
              });
              setHighestEmotion({
                name: maxEmotionName,
                percentage: maxEmotionValue / detections.length,
              });

              // Update emotion counters based on detections
              const updateCounters: EmotionCounters = { ...emotionCounters };
              Object.entries(emotions).forEach(([emotion, value]) => {
                if (emotion in updateCounters) { // This check ensures emotion is a valid key
                  updateCounters[emotion as Emotion] += value as number; // Cast is safe due to the check above
                  console.log(`Updated counter for ${emotion}:`, updateCounters[emotion as Emotion]);
                }
              });
              setEmotionCounters(updateCounters);
  
              // Check if any "bad" emotion exceeds the threshold and send an alert
              checkAndSendAlert(updateCounters);

              const labels = Object.keys(emotions) as Array<keyof typeof faceapi.FaceExpressions>;
              const data = labels.map(label => (emotions[label] || 0) / detections.length);

              setEmotionChartData({ labels, data });
              setEmotionHistory((prevHistory) => [
                ...prevHistory,
                { timestamp: new Date().toISOString(), emotions: emotions },
              ]);
            }

            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.clearRect(0, 0, videoWidth, videoHeight);

              if (showDetections) {
                faceapi.draw.drawDetections(canvas, resizedDetections);
              }
              if (showLandmarks) {
                faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
              }
              if (showExpressions) {
                faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
              }
            }
          };
          img.src = imageSrc;
        }
      }
    }
  }, [webcamRef, canvasRef, emotionCounters, setEmotionCounters, setEmotionChartData]);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;

    if (isCameraEnabled && isDetecting) {
      intervalId = setInterval(captureEmotion, 2000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isCameraEnabled, isDetecting, showDetections, showLandmarks, showExpressions, captureEmotion]);

  const handleAction = () => {
    setIsDetecting((prevIsDetecting) => {
      if (prevIsDetecting) {
        clearCanvas();
        setTimeout(() => setShowModal(true), 500);
      }
      return !prevIsDetecting;
    });
  };

  useEffect(() => {
    setShowDetections(isCameraEnabled);
    setShowLandmarks(isCameraEnabled);
    setShowExpressions(isCameraEnabled);
  }, [isCameraEnabled]);

  const getEmotionChartData = () => {
    const backgroundColors = emotionChartData.labels.map(label => {
      const key = label.toLowerCase() as keyof EmotionColors;
      return emotionColors[key] || 'rgba(75, 192, 192, 0.7)';
    });
    const borderColors = backgroundColors.map(color => color.replace('0.7', '1'));
    return {
      labels: emotionChartData.labels,
      datasets: [
        {
          label: 'Emotion Probabilities',
          data: emotionChartData.data,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1,
        },
      ],
    };
  };

  const getEmotionHistoryChartData = () => {
    const datasets = Object.keys(emotionColors).map((emotion) => {
      return {
        label: emotion,
        data: emotionHistory.map((entry) => ({
          x: parseISO(entry.timestamp),
          y: entry.emotions[emotion as keyof EmotionData] || 0,
        })),
        backgroundColor: emotionColors[emotion as keyof EmotionColors],
        borderColor: emotionColors[emotion as keyof EmotionColors],
        pointBackgroundColor: emotionColors[emotion as keyof EmotionColors],
        tension: 0.3,
        fill: true,
      };
    });

    return {
      datasets,
      labels: emotionHistory.map((entry) => parseISO(entry.timestamp)),
    };
  };

  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
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
          text: 'Probability',
          color: '#ffffff',
        }
      },
      x: {
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: 'Emotions',
          color: '#ffffff',
        }
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        color: '#fff',
        anchor: 'end',
        align: 'end',
        formatter: (value, context) => {
          return `${(value * 100).toFixed(2)}%`;
      },
      font: {
        weight: 'bold',
      },
      padding: 0,
      display: (context) => {
        const value = context?.dataset?.data[context.dataIndex];
        return typeof value === 'number' && value > 0.05;
      },
        },
    },
  };

  const lineChartOptions: ChartOptions<"line"> = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'second',
          tooltipFormat: 'HH:mm a',
          displayFormats: {
            minute: 'HH:mm a',
          },
        },
        title: {
          display: true,
          text: 'Time'
        },
        ticks: {
          autoSkip: true,
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
          callback: function (value) {
            if (typeof value === 'number') {
              return (value * 100).toFixed(0) + '%';
            }
            return value;
          },
        },
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
        position: 'bottom',
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    elements: {
      line: {
        fill: 'origin',
        tension: 0.3
      },
      point: {
        radius: 0
      }
    },
    maintainAspectRatio: false
  };

  const downloadChart = useCallback(() => {
    if (chartRef.current) {
      // Access the canvas from the chart instance
      const chartCanvas = chartRef.current.canvas;
      if (chartCanvas) { // Make sure the canvas exists
        const chartURL = chartCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = chartURL;
        link.download = 'emotion-chart.png'; // Name the file as you like
        link.click();
      }
    }
  }, []);

  const clearCanvas = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const checkAndSendAlert = (counters: EmotionCounters) => {
    const badEmotions: (keyof EmotionCounters)[] = ['fear', 'angry', 'sad'];
    let shouldSendAlert = badEmotions.some(emotion => {
      let isThresholdExceeded = counters[emotion] > 20;
      if (isThresholdExceeded) {
        console.log(`Threshold exceeded for ${emotion}:`, counters[emotion]);
      }
      return isThresholdExceeded;
    });
  
    if (shouldSendAlert) {
      console.log('Sending SMS alert...');
      sendSmsAlert();
    } else {
      console.log('No alert sent. Current counters:', counters);
    }
  };
  
  
  const sendSmsAlert = async () => {
    // Define the message you want to send
    const messageData = {
      message: "Alert: A dementia patient has been experiencing distressing emotions for more than 10 seconds. Please check in and provide support as needed."
    };

    try {
        // Make a POST request to the Flask backend
        const response = await fetch('http://localhost:5000/send_sms', { // Adjust the domain as necessary
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messageData),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('SMS sent successfully:', data);
        } else {
            console.error('Failed to send SMS');
        }
    } catch (error) {
        console.error('Error sending SMS:', error);
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
          <h1 className="text-5xl font-bold text-center mb-6" style={{ marginTop: '40px', marginBottom: '60px' }}>Emotion Recognition</h1>
          <div className="flex flex-col lg:flex-row justify-center items-start gap-8">
            <div className="webcam-container lg:w-1/2 space-y-4">
              <div className="flex flex-row justify-start items-center w-full gap-10 mb-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="checkbox checkbox-primary" checked={isCameraEnabled} onChange={() => setCameraEnabled(!isCameraEnabled)} />
                  <span>Camera</span>
                </label>
                {isCameraEnabled && (
                  <div className="detection-options flex justify-start items-center">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary"
                        checked={showDetections}
                        onChange={(e) => setShowDetections(e.target.checked)}
                      />
                      <span>Detection</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary"
                        checked={showLandmarks}
                        onChange={(e) => setShowLandmarks(e.target.checked)}
                      />
                      <span>Landmarks</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary"
                        checked={showExpressions}
                        onChange={(e) => setShowExpressions(e.target.checked)}
                      />
                      <span>Emotion</span>
                    </label>
                  </div>
                )}
              </div>

              <div className="webcam-style w-full rounded overflow-hidden">
                {isCameraEnabled ? (
                  <Webcam ref={webcamRef} audio={false} screenshotFormat="image/jpeg" width="100%" />
                ) : (
                  <div className="bg-gray-700 flex justify-center items-center w-full h-full"  style={{ height: '555px' }}>
                    <span>Click on Camera to enable Webcam</span>
                  </div>
                )}
                <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
              </div>
              <div className="file-upload w-full">
                <button 
                  className={`text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800 w-full transition duration-200 ${isDetecting ? 'from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700' : ''}`}
                  onClick={handleAction}
                  disabled={!isCameraEnabled}
                >
                  {buttonText}
                </button>
              </div>
            </div>

            <div className="prediction-container lg:w-1/2" style={{ marginTop: '20px' }}>
            <div className="graphical-visualization rounded-lg border border-white shadow-2xl overflow-hidden" style={{ height: '555px', width: '100%', maxWidth: '720px'}}>
              {highestEmotion ? (
                <h2 className="text-xl font-semibold text-center mt-2 mb-4" style={{ marginBottom: '40px' }}>Predicted Emotion: {highestEmotion.name} ({(highestEmotion.percentage * 100).toFixed(2)}%)</h2>
              ) : (
                <h2 className="text-xl font-semibold text-center mt-2 mb-4" style={{ marginBottom: '40px' }}>Predicted Emotion: Calculating...</h2>
              )}
              <div className="chart-container"  style={{ paddingTop: '20px' }}>
              {emotionChartData.data.length > 0 ? (
                <Bar data={getEmotionChartData()} options={chartOptions}/>
              ) : (
                <span className="flex justify-center">No emotion detected yet.</span>
              )}
              </div>
              <span className="flex justify-center" style={{ marginTop: '40px' }}>(Bar chart updates every 2 seconds)</span>
            </div>
            </div>
          </div>
        </div>
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
      maxHeight: '80vh',
      overflowY: 'auto',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <h2 style={{ marginBottom: '20px', fontSize: '24px', color: '#333' }}>Emotion Over Time</h2>
      <div style={{ height: '400px', marginBottom: '20px' }}>
        <Line ref={chartRef} data={getEmotionHistoryChartData()} options={lineChartOptions} />
      </div>
      <div className="button-container">
        <button className="button button-download" onClick={downloadChart}>
          Download Chart
        </button>
        <button className="button button-close" onClick={() => setShowModal(false)}>
          Close
        </button>
      </div>
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
        .aspect-video {
          padding-top: 56.25%;
          position: relative;
        }
        .webcam-style {
          position: relative;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .checkbox-primary {
          appearance: none;
          margin: 0;
          font: inherit;
          color: #2563EB;
          transform: translateY(-0.075em);
          display: grid;
          place-content: center;
        }
        
        .checkbox-primary:checked::before {
          content: url('path-to-your-checked-icon.svg');
        }
        
        .checkbox-primary:checked {
          background-color: #2563EB;
        }
        
        .checkbox-label {
          margin-left: 0.5em;
          color: white;
        }
        
        .checkbox-container {
          display: flex;
          align-items: center;
        }

        .checkbox-primary:checked + svg {
          color: #2563EB;
        }

        .checkbox-primary:checked + span {
          color: white;
        }

        .detection-options {
          display: flex;
          justify-content: space-around; 
          align-items: right;
          width: 100%;
        }

        .graphical-visualization {
          margin-top: 20px;
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .button {
          padding: 10px 25px;
          border: none;
          border-radius: 25px;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-size: 0.85em;
          color: white; /* Ensuring text is white for better readability on the gradient */
        }
        
        .button:hover {
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
          transform: translateY(-2px);
        }
        
        .button-download {
          background: linear-gradient(45deg, #646EE4, #5a67d8); /* Gradient from your theme color to a slightly darker shade */
        }
        
        .button-download:hover {
          background: linear-gradient(45deg, #5a67d8, #4c51bf); /* Slightly different shades for hover effect */
        }
        
        .button-close {
          background: linear-gradient(45deg, #FF8C8C, #FFA6A6); /* Lighter red gradient on hover */
        }
        
        .button-close:hover {
          background: linear-gradient(45deg, #FF6B6B, #FF8C8C); /* Red gradient for the Close button */
        }
        

        .button-container {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 30px;
          margin-top: 20px;
        }

        @media (max-width: 768px) {
          .aspect-video {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
};

export default Home;
