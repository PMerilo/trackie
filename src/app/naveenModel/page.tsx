// 'use client'

// import React, { useState, useEffect, useRef } from 'react';
// import Head from 'next/head';
// // import Webcam from 'react-webcam';
// import ChartDataLabels from 'chartjs-plugin-datalabels';
// import 'chartjs-adapter-date-fns';
// import { parse } from 'date-fns';
// // import { VideoCameraIcon } from '@heroicons/react/24/outline';
// import { Bar, Line } from 'react-chartjs-2';
// import { Chart, ChartOptions, registerables } from 'chart.js';

// Chart.register(...registerables);
// Chart.register(ChartDataLabels);

// interface EmotionData {
//   [key: string]: number;
// }

// interface EmotionHistoryEntry {
//   timestamp: string;
//   emotions: EmotionData;
// }

// type EmotionColors = {
//   [key in keyof EmotionData]?: string;
// };

// export default function Home() {
//   const FLASK_API_URL = process.env.REACT_APP_FLASK_API_URL || 'http://127.0.0.1:5000/';
//   const [isCameraEnabled, setCameraEnabled] = useState(false);
//   const [emotionData, setEmotionData] = useState<EmotionData | null>(null);
//   const [emotionHistory, setEmotionHistory] = useState<EmotionHistoryEntry[]>([]);
//   const [showModal, setShowModal] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   // const webcamRef = useRef<Webcam>(null);
//   const [isDetecting, setIsDetecting] = useState(false);
//   const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
//   const buttonText = isDetecting ? 'Stop Real-Time Detection' : 'Start Real-Time Detection';

//   const sendImageToAPI = async (imageSrc: string | Blob) => {
//     setLoading(true);
//     setError('');

//     try {
//       const formData = new FormData();
//       if (typeof imageSrc === 'string') {
//         const base64Response = await fetch(imageSrc);
//         const blob = await base64Response.blob();
//         formData.append('file', blob, 'upload.jpg');
//       } else {
//         formData.append('file', imageSrc, 'upload.jpg');
//       }

//       const response = await fetch(`${FLASK_API_URL}/detect-emotions`, {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json() as EmotionData;
//       setEmotionData(data);
//       const timestamp = new Date().toLocaleTimeString('en-SG', { timeZone: 'Asia/Singapore' });
//       setEmotionHistory((prevHistory) => {
//         const updatedHistory = [
//           ...prevHistory,
//           { timestamp, emotions: data }
//         ];
//         return updatedHistory;
//       });
//     } catch (error: any) {
//       setError('Failed to send image to API.');
//       console.error('There was an error sending the image to the API', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const processImageAndSendToAPI = async (imageSrc: string) => {
//     try {
//       const base64Response = await fetch(imageSrc);
//       const blob = await base64Response.blob();
//       await sendImageToAPI(blob);
//     } catch (error) {
//       console.error('Error in processImageAndSendToAPI:', error);
//     }
//   };

//   const startRealTimeDetection = () => {
//     if (webcamRef.current) {
//       const id = setInterval(async () => {
//         const imageSrc = webcamRef.current?.getScreenshot();
//         if (imageSrc) {
//           await processImageAndSendToAPI(imageSrc);
//         }
//       }, 2000);
//       setIntervalId(id);
//     } else {
//       console.error('Webcam not available for real-time detection.');
//     }
//   };

//   const stopRealTimeDetection = () => {
//     if (intervalId) {
//       clearInterval(intervalId);
//       setIntervalId(null);
//       setIsDetecting(false);

//       setTimeout(() => {
//         setShowModal(true);
//         console.log('Showing emotion over time modal');
//       }, 2000);
//     }
//   };

//   const toggleRealTimeDetection = () => {
//     if (isDetecting) {
//       stopRealTimeDetection();
//     } else {
//       if (webcamRef.current) {
//         startRealTimeDetection();
//       }
//     }
//     setIsDetecting((prev) => !prev);
//   };

//   let highestEmotionName = '';
//   let highestEmotionPercentage = 0;

//   if (emotionData) {
//     Object.entries(emotionData).forEach(([emotion, percentage]) => {
//       if (percentage > highestEmotionPercentage) {
//         highestEmotionName = emotion;
//         highestEmotionPercentage = percentage;
//       }
//     });
//   }

//   useEffect(() => {
//     console.log('Component updated with emotionHistory:', emotionHistory);
//   }, [emotionHistory]);

//   const chartDataStyle = (emotion: keyof EmotionData): string => {
//     const emotionColors: EmotionColors = {
//       Happy: 'rgba(255, 206, 86, 0.2)',
//       Sad: 'rgba(54, 162, 235, 0.2)',
//       Angry: 'rgba(255, 99, 132, 0.2)',
//       Fear: 'rgba(153, 102, 255, 0.2)',
//       Surprise: 'rgba(255, 159, 64, 0.2)',
//       Disgust: 'rgba(75, 192, 192, 0.2)',
//       Neutral: 'rgba(201, 203, 207, 0.2)'
//     };
//     return emotionColors[emotion] || 'rgba(75, 192, 192, 0.2)';
//   };

//   const getChartData = (emotionData: EmotionData) => {
//     if (!emotionData) {
//       return { labels: [], datasets: [] };
//     }
//     const labels = Object.keys(emotionData);
//     const dataValues = labels.map(label => emotionData[label]);
//     const chartData = {
//       labels,
//       datasets: [
//         {
//           label: 'Emotion Probabilities',
//           data: dataValues,
//           backgroundColor: labels.map(label => chartDataStyle(label as keyof EmotionData)),
//           borderColor: labels.map(label => chartDataStyle(label as keyof EmotionData)),
//         },
//       ],
//     };
//     return chartData;
//   };

//   const chartData2 = emotionHistory.length > 0 ? {
//     labels: emotionHistory.map(entry => {
//       const parsedDate = parse(entry.timestamp, 'hh:mm:ss a', new Date());
//       return parsedDate;
//     }),
//     datasets: Object.keys(emotionHistory[0].emotions).map(key => {
//       return {
//         label: key,
//         data: emotionHistory.map(entry => entry.emotions[key] * 100),
//         fill: 'origin',
//         backgroundColor: chartDataStyle(key as keyof EmotionData),
//         borderColor: chartDataStyle(key as keyof EmotionData),
//         pointBackgroundColor: chartDataStyle(key as keyof EmotionData),
//         tension: 0.3
//       };
//     })
//   } : { labels: [], datasets: [] };

//   const options: ChartOptions<"bar"> = {
//     responsive: true,
//     plugins: {
//       legend: {
//         display: false,
//       },
//       datalabels: {
//         color: '#fff',
//         anchor: 'end',
//         align: 'top',
//         formatter: (value, context) => {
//           return `${(value * 100).toFixed(2)}%`;
//         }
//       },
//       tooltip: {
//         callbacks: {
//           label: function (context) {
//             const label = context.dataset.label || '';
//             const value = context.parsed.y;
//             if (typeof value === 'number') {
//               return `${label}: ${(value * 100).toFixed(2)}%`;
//             }
//             return label;
//           }
//         }
//       }
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         ticks: {
//           callback: function (value: number | string) {
//             if (typeof value === 'number') {
//               return `${(value * 100).toFixed(0)}%`;
//             }
//             return value;
//           },
//         },
//         title: {
//           display: true,
//           text: 'Probability',
//           color: '#ffffff',
//         }
//       },
//       x: {
//         grid: {
//           display: false,
//         },
//         title: {
//           display: true,
//           text: 'Emotions',
//           color: '#ffffff',
//         }
//       }
//     }
//   };

//   const options2: ChartOptions<"line"> = {
//     scales: {
//       x: {
//         type: 'time',
//         time: {
//           displayFormats: {
//             minute: 'hh:mm a',
//           },
//         },
//         title: {
//           display: true,
//           text: 'Time'
//         },
//         ticks: {
//           maxTicksLimit: 10
//         }
//       },
//       y: {
//         beginAtZero: true,
//         title: {
//           display: true,
//           text: 'Emotion Probability (%)'
//         },
//         ticks: {
//           maxTicksLimit: 10,
//           callback: (value) => {
//             if (typeof value === 'number') {
//               return value.toFixed(2) + '%';
//             }
//             return value;
//           }
//         }
//       }
//     },
//     plugins: {
//       datalabels: {
//         display: false
//       },
//       tooltip: {
//         mode: 'index',
//         intersect: false,
//       },
//       legend: {
//         display: true
//       }
//     },
//     interaction: {
//       mode: 'nearest',
//       axis: 'x',
//       intersect: false
//     },
//     elements: {
//       line: {
//         fill: 'origin',
//       },
//       point: {
//         radius: 0
//       }
//     }
//   };

//   const handleAction = async () => {
//     if (isCameraEnabled) {
//       toggleRealTimeDetection();
//     }
//   };

//   return (
//     <>
//       <Head>
//         <title>Emotion Recognition</title>
//         <link rel="icon" href="/favicon.ico" />
//       </Head>

//       <main className="min-h-screen bg-black text-white">
//         <div className="container mx-auto p-4">
//           <h1 className="text-5xl font-bold text-center mb-6" style={{ marginTop: '40px' }}>Emotion Recognition (Pretrained Model)</h1>

//           <div className="flex flex-col lg:flex-row justify-center items-start gap-8 mt-6 lg:mt-24">
//             <div className="webcam-container lg:w-1/2 space-y-4">
//               <div className="flex flex-row justify-between items-center w-full mb-4">
//                 <label className="flex items-center space-x-2 cursor-pointer">
//                   <input type="checkbox" className="checkbox checkbox-primary" checked={isCameraEnabled} onChange={() => setCameraEnabled(!isCameraEnabled)} />
//                   <span>Camera</span>
//                   {/* <VideoCameraIcon className="h-6 w-6 text-blue-500" /> */}
//                 </label>
//               </div>

//               <div className="webcam-style w-full rounded overflow-hidden" style={{ height: '420px' }}>
//                 {isCameraEnabled ? (
//                   <></>
//                   // <Webcam ref={webcamRef} audio={false} screenshotFormat="image/jpeg" width="100%" />
//                 ) : (
//                   <div className="bg-gray-700 flex justify-center items-center w-full h-full">
//                     <span>Click on Camera to enable Webcam</span>
//                   </div>
//                 )}
//               </div>

//               <div className="file-upload w-full">
//                 <button 
//                   className={`text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800 w-full transition duration-200 ${isDetecting ? 'from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700' : ''}`}
//                   onClick={handleAction}
//                   disabled={!isCameraEnabled}
//                 >
//                   {buttonText}
//                 </button>
//               </div>
//             </div>

//             <div className="prediction-container lg:w-1/2" style={{ marginTop: '40px' }}>
//               <div className="graphical-visualization rounded-lg border border-white shadow-2xl overflow-hidden" style={{ height: '420px', width: '100%', maxWidth: '720px' }}>
//                 <h2 className="text-xl font-semibold text-center mt-2 mb-4">Predicted Emotion: {highestEmotionName ? `${highestEmotionName} (${(highestEmotionPercentage * 100).toFixed(2)}%)` : 'Calculating...'}</h2>
//                 {emotionData ? (
//                   <Bar data={getChartData(emotionData)} options={options} />
//                 ) : (
//                   <span className="flex justify-center">No emotion detected yet.</span>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//         {showModal && (
//           <>
//             <div style={{
//               position: 'fixed',
//               top: '50%',
//               left: '50%',
//               transform: 'translate(-50%, -50%)',
//               backgroundColor: 'white',
//               padding: '40px',
//               zIndex: 1050,
//               width: '80%',
//               maxWidth: '900px',
//               boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//               borderRadius: '8px',
//               textAlign: 'center'
//             }}>
//               <h2 style={{ marginBottom: '20px', fontSize: '24px', color: '#333' }}>Emotion Over Time</h2>
//               <Line key={emotionHistory.length} data={chartData2} options={options2} />
//               <button onClick={() => setShowModal(false)} style={{ color: 'red', fontSize: '16px', padding: '10px 20px', cursor: 'pointer', marginTop: '20px' }}>
//                 Close
//               </button>
//             </div>
//             <div style={{
//               position: 'fixed',
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//               backgroundColor: 'rgba(0, 0, 0, 0.5)',
//               zIndex: 1000
//             }} onClick={() => setShowModal(false)}></div>
//           </>
//         )}
//       </main>
//       <style jsx>{`
//         .webcam-style {
//           position: relative;
//           box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//         }

//         .checkbox-primary:checked + svg {
//           color: #3ABFF8;
//         }

//         .checkbox-primary:checked + span {
//           color: #3ABFF8;
//         }

//         .graphical-visualization {
//           position: relative;
//           overflow: hidden;
//           border-radius: 12px;
//           box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//         }

//         @media (max-width: 768px) {
//           .webcam-style, .graphical-visualization {
//             width: 100%;
//             margin-bottom: 1rem;
//           }
//         }
//       `}</style>
//     </>
//   );  
// }