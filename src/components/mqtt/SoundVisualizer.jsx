/*
Implemented from ChatGPT with prompt:

"How do I build a real time sound data visualizer in react,
I only have decibels as my data,
so I just want to make a simple sound visualizer using 
the decibel data I have."

*/

import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";

ChartJS.register(
  Filler,
  LineElement,
  PointElement,
  BarElement,
  CategoryScale,
  LinearScale
);

const SoundVisualizer = ({ decibel }) => {
  const [barData, setBarData] = useState({
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

  const [lineData, setLineData] = useState({
    labels: [],
    datasets: [
      {
        label: "Decibels",
        data: [],
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 4,
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
    const updateBar = () => {
      setBarData((prevData) => {
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

    const updateLine = () => {
      setLineData((prevData) => {
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

    //Update
    const barInterval = setInterval(updateBar, 30);
    const lineInterval = setInterval(updateLine, 30);

    return () => {
      clearInterval(barInterval);
      clearInterval(lineInterval);
    };
  }, [decibel]);

  return (
    <>
      <Bar data={barData} options={options} />
      <Line data={lineData} options={options} />
    </>
  );
};

export default SoundVisualizer;
