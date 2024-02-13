'use client'

import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement, 
  PointElement, 
  Title, 
  Tooltip, 
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

interface EmotionData {
  [key: string]: number;
}

type EmotionColors = {
  [K in keyof EmotionData]?: string;
};
const emotionColors: EmotionColors = {
    Happy: 'rgba(255, 206, 86, 0.2)',
    Sad: 'rgba(54, 162, 235, 0.2)',
    Angry: 'rgba(255, 99, 132, 0.2)',
    Fear: 'rgba(153, 102, 255, 0.2)',
    Surprise: 'rgba(255, 159, 64, 0.2)',
    Disgust: 'rgba(75, 192, 192, 0.2)',
    Neutral: 'rgba(201, 203, 207, 0.2)',
};

const chartDataStyle = (emotion: keyof EmotionData): string => {
  return emotionColors[emotion] || 'rgba(75, 192, 192, 0.2)';
};

const getChartData = (emotionData: EmotionData): ChartData<'bar', number[], string> => {
  const labels = Object.keys(emotionData);
  const dataValues = labels.map(label => emotionData[label]);
  return {
    labels: labels.map(label => String(label)), // Convert labels to strings
    datasets: [
      {
        label: 'Emotion Probabilities',
        data: dataValues,
        backgroundColor: labels.map(label => chartDataStyle(label as keyof EmotionData)),
        borderColor: labels.map(label => chartDataStyle(label as keyof EmotionData)),
      },
    ],
  };
};

  
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
  }
};
  
interface ChartProps {
  data: EmotionData;
}
  
const BarChart: React.FC<ChartProps> = ({ data }) => {
  const chartData = getChartData(data);
  return <Bar data={chartData} options={options} />;
}; 
export default BarChart