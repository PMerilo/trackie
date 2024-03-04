'use client'

import { Bar } from 'react-chartjs-2';
import { Chart, ChartOptions, registerables } from 'chart.js';
import Viewer from './components/viewer'
import { useEffect, useRef, useState } from 'react';
import { Speechbubble } from './components/Speechbubble';
import BarChart from "./components/BarChart"
import LineChart from "./components/LineChart"

import Head from 'next/head';
import { useRouter } from 'next/router'; // Move the import inside the component
// import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import 'chartjs-adapter-date-fns';
import { parse, parseISO } from 'date-fns';

Chart.register(...registerables);

type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';

async function getTranscripts() {
  const res = await fetch(`/api/user/transcripts`)
  if (!res.ok) {
      throw new Error('Failed to fetch data')
  }
  return await res.json()
}

interface EmotionData {
  [key: string]: number;
}

interface EmotionHistoryEntry {
  timestamp: string;
  emotions: EmotionData;
}

type EmotionColors = {
  [key in keyof EmotionData]?: string;
};


const App = () => {
  const [transcripts, setTranscripts] = useState<{transcript: string, timestamp: Date, predict:boolean}[]>([])

  const [actionData, setActionData] = useState<EmotionData | null>(null);
  const [isDetectingAction, setIsDetectingAction] = useState(false);
  const [intervalIdAction, setIntervalIdAction] = useState<NodeJS.Timeout | null>(null);
  const actionbuttonText = isDetectingAction ? 'Stop Real-Time Detection' : 'Start Real-Time Detection';


  const [showDetections, setShowDetections] = useState(true);
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [showExpressions, setShowExpressions] = useState(true);

  
  const chartRef = useRef<any>(null);
  const [accessToken, setAccessToken] = useState('');
  const [emotionCounters, setEmotionCounters] = useState({
    happy: 0,
    sad: 0,
    angry: 0,
    fear: 0,
    surprise: 0,
    disgust: 0,
    neutral: 0,
  });



  const [emotionData, setEmotionData] = useState<EmotionData | null>(null);
  const [emotionHistory, setEmotionHistory] = useState<EmotionHistoryEntry[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const buttonText = isDetecting ? 'Stop Real-Time Detection' : 'Start Real-Time Detection';

  useEffect(() => {
    getTranscripts()
    .then((data) => [
      
      setTranscripts(data.map((msg: {transcript: string, timestamp: string, predict:string}) => {
        return {
            ...msg,
            predict: msg.predict=="Positive",
            timestamp: new Date('2024-02-13 00:11:14.185802')
        }
      }))
    ])
  }, [])

  const getEmotions = async () => {
    setLoading(true)
    fetch(`/api/emotions`, {
      method: "GET",
      headers:{
        "Content-Type": "application/json"
      },
  
    })
    .then((res) => res.json())
    .then(data => {
      setEmotionData(data);
      const timestamp = new Date().toLocaleTimeString('en-SG', { timeZone: 'Asia/Singapore' });
      setEmotionHistory((prevHistory) => {
        const updatedHistory = [
          ...prevHistory,
          { timestamp, emotions: data }
        ];
        return updatedHistory;
      });
    })
    .catch((error) => {
      setError('Failed to send image to API.');
      console.error('There was an error sending the image to the API', error);
    })
    .finally(() => {
      setLoading(false);
    })
  };

  const getActions = async () => {
    setLoading(true)
    fetch(`/api/actions`, {
      method: "GET",
    })
    .then((res) => res.json())
    .then(data => {
      setActionData(data);
    })
    .catch((error) => {
      setError('Failed to send image to API.');
      console.error('There was an error sending the image to the API', error);
    })
    .finally(() => {
      setLoading(false);
    })
  };

  // Styles
  const appContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '120vh',
    padding: '20px',
    color: '#EAEAEA',
    fontFamily: 'Roboto, sans-serif', // Modern font
  };

  const mainContentStyle: React.CSSProperties = {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px', // Spacing between elements
  };

  const webcamContainerStyle: React.CSSProperties = {
    flex: 1,
    padding: '20px',
    borderRadius: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', // Subtle shadow for depth
  };

  const actionChartContainerStyle: React.CSSProperties = {
    padding: '20px',
    borderRadius: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', // Subtle shadow for depth
    border: '2px solid #4A4A4A', // Apply the border only to the action chart container
    marginBottom: '20px'
  };

  const actionChartData = {
    labels: ['Sitting', 'Using Laptop', 'Hugging', 'Sleeping', 'Drinking', 'Clapping', 'Dancing', 'Cycling', 'Calling', 'Laughing', 'Eating', 'Fighting', 'Listening to Music', 'Running', 'Texting'],
    datasets: [{
      label: 'Action Probability',
      data: [65, 59, 80, 81, 56, 70, 45, 72, 68, 85, 75, 60, 88, 53, 78],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(201, 203, 207, 0.2)',
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(201, 203, 207, 0.2)',
        'rgba(255, 99, 132, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(201, 203, 207, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(201, 203, 207, 1)',
        'rgba(255, 99, 132, 1)',
      ],
      borderWidth: 1
    }]
  };

  // Chart options
  const chartOptions: ChartOptions<'bar'> = {
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        type: 'category',
      },
    },
    plugins: {
      legend: {
        labels: {
          color: 'white', // legend font color
        },
      },
    },
  };

  const audioTranscriptionContainerStyle: React.CSSProperties = {
    padding: '20px',
    borderRadius: '20px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflowY: 'auto', // Only the message section is scrollable
    maxHeight: '70vh', // Adjust as needed
    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
    border: '2px solid #4A4A4A', // Adding a border here
  };

  const speechBubbleStyle: React.CSSProperties = {
    backgroundColor: '#333333', // Dark bubble background for contrast
    color: 'white',
    padding: '10px',
    borderRadius: '15px',
    marginBottom: '10px',
    maxWidth: '80%',
    alignSelf: 'flex-start',
    wordWrap: 'break-word',
  };

  // function emotionAPI() {
  //   const imageSrc = webcamRef.current.getScreenshot();
  //   if (imageSrc) {
  //     const img = new Image();
  //     img.onload = async () => {
  //       const detections = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
  //         .withFaceLandmarks()
  //         .withFaceExpressions();
  //         console.log('Face detection results:', detections);

  //       if (detections.length > 0) {
  //         console.log('Faces detected:', detections.length);
  //         detections.forEach((detection, index) => {
  //           console.log(`Detection ${index + 1}:`, detection.expressions);
  //           console.log(`Emotions detected for face ${index + 1}:`, detection.expressions);
  //         });
  //         const emotions: Emotions = detections.reduce((acc, detection) => {
  //           const expressions = detection.expressions as Emotions;
  //           for (const [emotion, value] of Object.entries(expressions)) {
  //             const emotionKey = emotion as keyof Emotions;
  //             acc[emotionKey] = (acc[emotionKey] || 0) + (value as number);
  //           }
  //           return acc;
  //         }, {} as { [key: string]: number });

  //         let maxEmotionName = '';
  //         let maxEmotionValue = 0;
  //         Object.entries(emotions).forEach(([key, value]) => {
  //           if (value > maxEmotionValue) {
  //             maxEmotionValue = value;
  //             maxEmotionName = key;
  //           }
  //         });
  //         setHighestEmotion({
  //           name: maxEmotionName,
  //           percentage: maxEmotionValue / detections.length,
  //         });

  //         // Update emotion counters based on detections
  //         const updateCounters: EmotionCounters = { ...emotionCounters };
  //         Object.entries(emotions).forEach(([emotion, value]) => {
  //           if (emotion in updateCounters) { // This check ensures emotion is a valid key
  //             updateCounters[emotion as Emotion] += value as number; // Cast is safe due to the check above
  //             console.log(`Updated counter for ${emotion}:`, updateCounters[emotion as Emotion]);
  //           }
  //         });
  //         setEmotionCounters(updateCounters);

  //         // Check if any "bad" emotion exceeds the threshold and send an alert
  //         checkAndSendAlert(updateCounters);

  //         const labels = Object.keys(emotions) as Array<keyof typeof faceapi.FaceExpressions>;
  //         const data = labels.map(label => (emotions[label] || 0) / detections.length);

  //         setEmotionChartData({ labels, data });
  //         setEmotionHistory((prevHistory) => [
  //           ...prevHistory,
  //           { timestamp: new Date().toISOString(), emotions: emotions },
  //         ]);
  //       } else {
  //         console.log('No faces detected.');
  //       }

  //       const resizedDetections = faceapi.resizeResults(detections, displaySize);
  //       const ctx = canvas.getContext('2d');
  //       if (ctx) {
  //         ctx.clearRect(0, 0, videoWidth, videoHeight);

  //         if (showDetections) {
  //           faceapi.draw.drawDetections(canvas, resizedDetections);
  //         }
  //         if (showLandmarks) {
  //           faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
  //         }
  //         if (showExpressions) {
  //           faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
  //         }
  //       }
  //     };
  //     img.src = imageSrc;
  //   }
  // }

  const startRealTimeDetection = (type: string) => {
    const id = setInterval(async () => {
      if (type == "NAVEEN") {
        getEmotions()
      } else {
        getActions()
      }
    }, 2000);
    if (type == "NAVEEN") {
      setIntervalId(id)
    }
    else {
      setIntervalIdAction(id)
    };
  };

  const stopRealTimeDetection = (type: string) => {
    if (intervalId) {
      clearInterval(intervalId) ;
      setIntervalId(null);
      setIsDetecting(false);
      setTimeout(() => {
        setShowModal(true);
        console.log('Showing emotion over time modal');
      }, 2000);
    } else if (intervalIdAction) {
      clearInterval(intervalIdAction) ;
      setIntervalIdAction(null);
      setIsDetectingAction(false);
    }
  };

  const toggleRealTimeDetection = (type: string) => {
    if (isDetecting) {
      stopRealTimeDetection(type);
    } else {
      startRealTimeDetection(type)
    }
    if (isDetectingAction) {
      stopRealTimeDetection(type);
    } else {
      startRealTimeDetection(type)
    }
    setIsDetecting((prev) => !prev);
    if (type == "NAVEEN") {
      setIsDetecting((prev) => !prev);
    } else {
      setIsDetectingAction((prev) => !prev);
    }  

  };

  let highestEmotionName = '';
  let highestEmotionPercentage = 0;

  if (emotionData) {
    Object.entries(emotionData).forEach(([emotion, percentage]) => {
      if (percentage > highestEmotionPercentage) {
        highestEmotionName = emotion;
        highestEmotionPercentage = percentage;
      }
    });
  }

  useEffect(() => {
    console.log('Component updated with emotionHistory:', emotionHistory);
  }, [emotionHistory]);

  const handleAction = async () => {
    toggleRealTimeDetection("NAVEEN");
  };
  const handleActionActions = async () => {
    toggleRealTimeDetection("");
  };

  return (
    <div className="app-container" style={appContainerStyle}>
      {/* Main Content Section */}
      <main className='flex-col px-48'> 
        {/* Webcam Feed Section */}
        <div className="webcam-container place-content-center" style={actionChartContainerStyle}>
          <Viewer></Viewer>
        </div>

        {/* Other sections remain the same, just apply the styles */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          {/* Action Detection Chart Section */}
          <div className="action-chart-container" style={actionChartContainerStyle}>
            {emotionData ? (
              <BarChart data={emotionData} />
              ) : (
              <span className="flex justify-center">No emotion detected yet.</span>
            )}
            <button 
              className={`mt-4 text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800 w-full transition duration-200 ${isDetecting ? 'from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700' : ''}`}
              onClick={() => handleAction()}
            >
              {buttonText}
            </button>
          </div>
          <div className="action-chart-container" style={actionChartContainerStyle}>
            {actionData ? (
              <BarChart data={actionData} />
              ) : (
              <span className="flex justify-center">No emotion detected yet.</span>
            )}
            <button 
              className={`mt-4 text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800 w-full transition duration-200 ${isDetectingAction ? 'from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700' : ''}`}
              onClick={() => handleActionActions()}
            >
              {actionbuttonText}
            </button>
          </div>

          {/* Audio Transcription Section */}
          <div className="audio-transcription-container" style={audioTranscriptionContainerStyle}>
            {transcripts.map((t, index) => (
              // <div key={index} style={speechBubbleStyle}>
              //   <span>{bubble.transcript}</span>
              //   <br />
              //   <span style={{ fontSize: '0.4em' }}>{bubble.timestamp.toLocaleString()}</span>
              // </div>
              <Speechbubble content={t.transcript} timestamp={t.timestamp.toLocaleString()} prediction={t.predict} key={index}/>
            ))}
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
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <h2 style={{ marginBottom: '20px', fontSize: '24px', color: '#333' }}>Emotion Over Time</h2>
              <LineChart emotionHistory={emotionHistory} />              
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
    </div>
  );
};

export default App;
