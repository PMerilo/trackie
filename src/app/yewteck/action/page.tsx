"use client";

import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Webcam from "react-webcam";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "chartjs-adapter-date-fns";
import { parse } from "date-fns";
import { VideoCameraIcon } from "@heroicons/react/24/outline";
import { Bar, Line } from "react-chartjs-2";
import { Chart, ChartOptions, registerables } from "chart.js";

Chart.register(...registerables);
Chart.register(ChartDataLabels);

interface ActionData {
  [key: string]: number;
}

interface ActionHistoryEntry {
  timestamp: string;
  actions: ActionData;
}

type ActionColors = {
  [key in keyof ActionData]?: string;
};

export default function Home() {
  const FLASK_API_URL =
    process.env.REACT_APP_FLASK_API_URL || "http://127.0.0.1:5000";
  const [isCameraEnabled, setCameraEnabled] = useState(false);
  const [actionData, setActionData] = useState<ActionData | null>(null);
  const [actionHistory, setActionHistory] = useState<ActionHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const webcamRef = useRef<Webcam>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const buttonText = isDetecting
    ? "Stop Real-Time Detection"
    : "Start Real-Time Detection";
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  const sendImageToAPI = async (imageSrc: string | Blob) => {
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      if (typeof imageSrc === "string") {
        const base64Response = await fetch(imageSrc);
        const blob = await base64Response.blob();
        formData.append("file", blob, "upload.jpg");
      } else {
        formData.append("file", imageSrc, "upload.jpg");
      }

      const response = await fetch(`${FLASK_API_URL}/detect-actions`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = (await response.json()) as ActionData;
      setActionData(data);
      const timestamp = new Date().toLocaleTimeString("en-SG", {
        timeZone: "Asia/Singapore",
      });
      setActionHistory((prevHistory) => {
        const updatedHistory = [...prevHistory, { timestamp, actions: data }];
        return updatedHistory;
      });
    } catch (error: any) {
      setError("Failed to send image to API.");
      console.error("There was an error sending the image to the API", error);
    } finally {
      setLoading(false);
    }
  };

  const processImageAndSendToAPI = async (imageSrc: string) => {
    try {
      const base64Response = await fetch(imageSrc);
      const blob = await base64Response.blob();
      await sendImageToAPI(blob);
    } catch (error) {
      console.error("Error in processImageAndSendToAPI:", error);
    }
  };

  const startRealTimeDetection = () => {
    if (webcamRef.current) {
      const id = setInterval(async () => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
          await processImageAndSendToAPI(imageSrc);
        }
      }, 2000);
      setIntervalId(id);
    } else {
      console.error("Webcam not available for real-time detection.");
    }
  };

  const stopRealTimeDetection = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
      setIsDetecting(false);

      setTimeout(() => {
        console.log("Showing emotion over time modal");
      }, 2000);
    }
  };

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

  let highestActionName = "";
  let highestActionPercentage = 0;

  if (actionData) {
    Object.entries(actionData).forEach(([action, percentage]) => {
      if (percentage > highestActionPercentage) {
        highestActionName = action;
        highestActionPercentage = percentage;
      }
    });
  }

  useEffect(() => {
    console.log("Component updated with actionHistory:", actionHistory);
  }, [actionHistory]);

  const chartDataStyle = (action: keyof ActionData): string => {
    const actionColors: ActionColors = {
      sitting: "rgba(255, 99, 132, 0.2)",
      using_laptop: "rgba(54, 162, 235, 0.2)",
      hugging: "rgba(255, 206, 86, 0.2)",
      sleeping: "rgba(75, 192, 192, 0.2)",
      drinking: "rgba(153, 102, 255, 0.2)",
      clapping: "rgba(255, 159, 64, 0.2)",
      dancing: "rgba(201, 203, 207, 0.2)",
      cycling: "rgba(255, 99, 132, 0.2)",
      calling: "rgba(54, 162, 235, 0.2)",
      laughing: "rgba(255, 206, 86, 0.2)",
      eating: "rgba(75, 192, 192, 0.2)",
      fighting: "rgba(153, 102, 255, 0.2)",
      listening_to_music: "rgba(255, 159, 64, 0.2)",
      running: "rgba(201, 203, 207, 0.2)",
      texting: "rgba(255, 99, 132, 0.2)",
    };
    return actionColors[action] || "rgba(75, 192, 192, 0.2)";
  };

  const getChartData = (actionData: ActionData) => {
    if (!actionData) {
      return { labels: [], datasets: [] };
    }
    const labels = Object.keys(actionData);
    const dataValues = labels.map((label) => actionData[label]);
    const chartData = {
      labels,
      datasets: [
        {
          label: "Action Probabilities",
          data: dataValues,
          backgroundColor: labels.map((label) =>
            chartDataStyle(label as keyof ActionData)
          ),
          borderColor: labels.map((label) =>
            chartDataStyle(label as keyof ActionData)
          ),
        },
      ],
    };
    return chartData;
  };

  const chartData2 =
    actionHistory.length > 0
      ? {
          labels: actionHistory.map((entry) => {
            const parsedDate = parse(entry.timestamp, "hh:mm:ss a", new Date());
            return parsedDate;
          }),
          datasets: Object.keys(actionHistory[0].actions).map((key) => {
            return {
              label: key,
              data: actionHistory.map((entry) => entry.actions[key] * 100),
              fill: "origin",
              backgroundColor: chartDataStyle(key as keyof ActionData),
              borderColor: chartDataStyle(key as keyof ActionData),
              pointBackgroundColor: chartDataStyle(key as keyof ActionData),
              tension: 0.3,
            };
          }),
        }
      : { labels: [], datasets: [] };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: number | string) {
            // Ensure value is a number before formatting
            const numericValue =
              typeof value === "string" ? parseFloat(value) : value;
            return `${(numericValue * 100).toFixed(0)}%`;
          },
        },
        title: {
          display: true,
          text: "Probability",
          color: "#ffffff",
        },
      },
      x: {
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: "Actions",
          color: "#ffffff",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        color: "#fff",
        anchor: "end",
        align: "top",
        formatter: (value, context) => {
          // Only display labels for values above 5%
          return value > 0.05 ? `${(value * 100).toFixed(2)}%` : "";
        },
        font: {
          weight: "bold",
        },
      },
    },
  };

  const options2: ChartOptions<"line"> = {
    scales: {
      x: {
        type: "time",
        time: {
          displayFormats: {
            minute: "hh:mm a",
          },
        },
        title: {
          display: true,
          text: "Time",
        },
        ticks: {
          maxTicksLimit: 10,
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Action Probability (%)",
        },
        ticks: {
          maxTicksLimit: 10,
          callback: (value) => {
            if (typeof value === "number") {
              return value.toFixed(2) + "%";
            }
            return value;
          },
        },
      },
    },
    plugins: {
      datalabels: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
      legend: {
        display: true,
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
    elements: {
      line: {
        fill: "origin",
      },
      point: {
        radius: 0,
      },
    },
  };

  const handleAction = async () => {
    if (isCameraEnabled) {
      toggleRealTimeDetection();
    }
  };

  useEffect(() => {
    const fetchImageUrl = async () => {
      try {
        const response = await fetch(`${FLASK_API_URL}/api/get-image-url`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setImageUrl(data.imageUrl); // Assuming the backend sends the image URL in a field named `imageUrl`
      } catch (error) {
        console.error("Error fetching image URL:", error);
      }
    };

    fetchImageUrl();
  }, []);

  return (
    <>
      <Head>
        <title>Action Recognition</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-black text-white">
        <div className="container mx-auto p-4">
          <h1
            className="text-5xl font-bold text-center mb-6"
            style={{ marginTop: "40px" }}
          >
            Action Recognition
          </h1>

          <div className="flex flex-col lg:flex-row justify-center items-start gap-8 mt-6 lg:mt-24">
            <div className="webcam-container lg:w-1/2 space-y-4">
              <div className="flex flex-row justify-between items-center w-full mb-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={isCameraEnabled}
                    onChange={() => setCameraEnabled(!isCameraEnabled)}
                  />
                  <span>Camera</span>
                  <VideoCameraIcon className="h-6 w-6 text-blue-500" />
                </label>
              </div>

              <div
                className="webcam-style w-full rounded overflow-hidden relative"
                style={{ height: "420px" }}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                ) : isCameraEnabled ? (
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    width="100%"
                    height="100%"
                  />
                ) : (
                  <div className="bg-gray-700 flex justify-center items-center w-full h-full">
                    <span>Click on Camera to enable Webcam</span>
                  </div>
                )}
              </div>

              <div className="flex justify-center mt-4 space-x-2">
                <button
                  className={`text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800 w-full transition duration-200 ${
                    isDetecting
                      ? "from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                      : ""
                  }`}
                  onClick={handleAction}
                  disabled={!isCameraEnabled}
                >
                  {isDetecting
                    ? "Stop Real-Time Detection"
                    : "Start Real-Time Detection"}
                </button>
              </div>
            </div>

            {/* Display the image fetched from backend */}
            {imageUrl && (
              <div className="image-container mx-auto">
                <img
                  src={imageUrl}
                  alt="Fetched from backend"
                  className="rounded-lg shadow-lg" // Add any additional styling you want here
                />
              </div>
            )}

            {/* Action Data Container */}
            <div
              className="prediction-container lg:w-1/2"
              style={{
                marginTop: "40px",
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
              }}
            >
              <div
                className="graphical-visualization rounded-lg border border-white shadow-2xl overflow-hidden"
                style={{
                  height: "420px",
                  width: "100%",
                  maxWidth: "720px",
                  marginBottom: "1rem",
                }}
              >
                <h2 className="text-xl font-semibold text-center mt-2 mb-4">
                  Predicted Action:{" "}
                  {highestActionName
                    ? `${highestActionName} (${(
                        highestActionPercentage * 100
                      ).toFixed(2)}%)`
                    : "Calculating..."}
                </h2>
                {actionData ? (
                  <Bar data={getChartData(actionData)} options={options} />
                ) : (
                  <span className="flex justify-center">
                    No action detected yet.
                  </span>
                )}
              </div>
              <div className="flex space-x-2 mt-auto"></div>
            </div>
          </div>
        </div>
      </main>
      <style jsx>{`
        .webcam-style {
          position: relative;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .checkbox-primary:checked + svg {
          color: #3abff8;
        }

        .checkbox-primary:checked + span {
          color: #3abff8;
        }

        .graphical-visualization {
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        @media (max-width: 768px) {
          .webcam-style,
          .graphical-visualization {
            width: 100%;
            margin-bottom: 1rem;
          }
        }
      `}</style>
    </>
  );
}