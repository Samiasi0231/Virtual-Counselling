import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

// Dummy weekly mood data (1–5 scale)
const moodData = [
  { day: 'Mon', mood: 3 },
  { day: 'Tue', mood: 4 },
  { day: 'Wed', mood: 2 },
  { day: 'Thu', mood: 5 },
  { day: 'Fri', mood: 4 },
  { day: 'Sat', mood: 3 },
  { day: 'Sun', mood: 4 },
];

const data = {
  labels: moodData.map((d) => d.day),
  datasets: [
    {
      label: 'Mood Level (1–5)',
      data: moodData.map((d) => d.mood),
      borderColor: '#6B21A8',
      backgroundColor: 'rgba(107, 33, 168, 0.1)',
      tension: 0.3,
      fill: true,
      pointRadius: 5,
      pointHoverRadius: 7,
    },
  ],
};

const options = {
  responsive: true,
  scales: {
    y: {
      min: 1,
      max: 5,
      ticks: {
        stepSize: 1,
        callback: (value) => {
          const faces = ['😢', '😕', '😐', '🙂', '😄'];
          return `${faces[value - 1]} ${value}`;
        },
      },
      title: {
        display: true,
        text: 'Mood Level',
      },
    },
  },
};

const MoodTrend= () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-5 w-full max-w-md">
      <h2 className="text-lg font-semibold text-purple-800 mb-3">
        📈 Mood Trend (This Week)
      </h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default MoodTrend;
