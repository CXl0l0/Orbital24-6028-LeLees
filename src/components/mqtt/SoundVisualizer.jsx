/*
Implemented from ChatGPT with prompt:

"How do I build a real time sound data visualizer in react,
I only have decibels as my data,
so I just want to make a simple sound visualizer using 
the decibel data I have."

*/

import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale);

const SoundVisualizer = ({ decibel }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Decibels",
        data: [],
        backgroundColor: "aqua",
        borderWidth: 1,
      },
    ],
  });

  const options = {
    scales: {
      y: {
        min: 0,
        max: 4096,
      },
      x: {},
    },
  };

  useEffect(() => {
    const updateChart = () => {
      setChartData((prevData) => {
        const labels = [...prevData.labels, new Date().toLocaleTimeString()];
        const data = [...prevData.datasets[0].data, decibel];

        if (labels.length > 60) {
          labels.shift();
          data.shift();
        }

        return {
          labels,
          datasets: [
            {
              ...prevData.datasets[0],
              data,
            },
          ],
        };
      });
    };

    const interval = setInterval(updateChart, 40); // Update every second

    return () => clearInterval(interval);
  }, [decibel]);

  return (
    <>
      <Bar data={chartData} options={options} />
    </>
  );
};

export default SoundVisualizer;
