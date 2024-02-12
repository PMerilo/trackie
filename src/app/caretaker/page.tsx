'use client'

import { Bar } from 'react-chartjs-2';
import { Chart, ChartOptions, registerables } from 'chart.js';
import Viewer from './components/viewer'
import { useEffect, useState } from 'react';
import { Speechbubble } from './components/Speechbubble';

Chart.register(...registerables);

type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';

async function getTranscripts() {
  const res = await fetch(`/api/user/transcripts`)
  if (!res.ok) {
      throw new Error('Failed to fetch data')
  }
  return await res.json()
}

const App = () => {
  const [transcripts, setTranscripts] = useState<{transcript: string, timestamp: Date, predict:boolean}[]>([])

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

  // Fake speech bubbles (you would replace this with your actual transcription data)
  // const transcripts = [
  //   { text: "Hello, how are you doing today?", time: "00:10" },
  //   { text: "I'm doing great, thanks for asking!", time: "00:15" },
  //   { text: "What's the weather like over there?", time: "00:20" },
  //   { text: "It's raining cats and dogs here!", time: "00:25" },
  //   { text: "Do you want to grab lunch later?", time: "00:30" },
  //   { text: "Sure, let's meet at 1 PM.", time: "00:35" },
  //   { text: "Sounds good! See you then.", time: "00:40" },
  //   { text: "Can you please send me the report?", time: "00:45" },
  //   { text: "Sure, I'll send it right away.", time: "00:50" },
  //   { text: "Thanks a lot!", time: "00:55" },
  // ];

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

  return (
    <div className="app-container" style={appContainerStyle}>
      {/* Main Content Section */}
      <main style={mainContentStyle}>
        {/* Webcam Feed Section */}
        <div className="webcam-container place-content-center" style={actionChartContainerStyle}>
          <Viewer></Viewer>
        </div>

        {/* Other sections remain the same, just apply the styles */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          {/* Action Detection Chart Section */}
          <div className="action-chart-container" style={actionChartContainerStyle}>
            <Bar data={actionChartData} options={chartOptions} />
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
      </main>
    </div>
  );
};

export default App;
