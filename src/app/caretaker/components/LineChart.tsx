'use client'

import React from 'react';
import 'chartjs-adapter-date-fns';
import { format, isValid, parse } from 'date-fns';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

interface EmotionData {
  [key: string]: number;
}

type EmotionColors = {
  [K in keyof EmotionData]?: string;
};

interface EmotionHistoryEntry {
  timestamp: string;
  emotions: EmotionData;
}

interface ChartComponentProps {
  emotionHistory: EmotionHistoryEntry[];
}

export const LineChart: React.FC<ChartComponentProps> = ({ emotionHistory }) => {
  const chartDataStyle = (emotion: keyof EmotionData): string => {
    const emotionColors: EmotionColors = {
      Happy: 'rgba(255, 206, 86, 0.2)',
      Sad: 'rgba(54, 162, 235, 0.2)',
      Angry: 'rgba(255, 99, 132, 0.2)',
      Fear: 'rgba(153, 102, 255, 0.2)',
      Surprise: 'rgba(255, 159, 64, 0.2)',
      Disgust: 'rgba(75, 192, 192, 0.2)',
      Neutral: 'rgba(201, 203, 207, 0.2)',
    };
    return emotionColors[emotion] || 'rgba(75, 192, 192, 0.2)';
  };

  const getChartData = (): ChartData<'line', number[], string> => {
    if (emotionHistory.length === 0) {
      return { labels: [], datasets: [] };
    }

    const datasets = Object.keys(emotionHistory[0].emotions).map(key => {
      const emotionKey = key as keyof EmotionData;
      const data = emotionHistory.map(entry => entry.emotions[emotionKey] * 100);

      const invalidDataPoints = data.filter(value => typeof value !== 'number' || isNaN(value));
      if (invalidDataPoints.length > 0) {
        console.error(`Data for ${key} contains invalid data points:`, invalidDataPoints);
      }

      const backgroundColor = chartDataStyle(emotionKey);
      const borderColor = chartDataStyle(emotionKey);

      return {
        label: key,
        data: data,
        fill: 'origin',
        backgroundColor: Array(data.length).fill(backgroundColor),
        borderColor: borderColor,
        pointBackgroundColor: borderColor,
        tension: 0.3
      };
    });

    return { labels: emotionHistory.map(entry => entry.timestamp), datasets: datasets };
  };

  const options: ChartOptions<"line"> = {
    scales: {
      x: {
        type: 'time',
        time: {
          parser: 'h:mm:ss a',
          tooltipFormat: 'h:mm:ss a',
          displayFormats: {
            second: 'h:mm:ss a',
            minute: 'h:mm a',
            hour: 'h a',
          },
        },
        title: {
          display: true,
          text: 'Time'
        },
        ticks: {
          autoSkip: true,
          maxRotation: 0,
          major: {
            enabled: true
          },
          maxTicksLimit: 20
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
          callback: (value) => {
            if (typeof value === 'number') {
              return value.toFixed(2) + '%';
            }
            return value;
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
        fill: 'origin',
      },
      point: {
        radius: 0
      }
    }
  };

  const chartData = getChartData();

  const keyProp = `${emotionHistory.length}-${Date.now()}`;

  return (
    <div style={{width: '100%'}}>
      <Line data={chartData} options={options} key={keyProp} />
    </div>
  );
};

export default LineChart