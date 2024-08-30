"use client";

import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import Loader from "./Loader";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export default function Dashboard({ dashboardData, error }) {
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!dashboardData) return <Loader />;

  const {
    receivedGifts = [],
    contributedGifts = [],
    topContributors = [],
  } = dashboardData;

  const receivedGiftsData = {
    labels: receivedGifts.map((gift) => gift.eventName || "Unknown Event"),
    datasets: [
      {
        data: receivedGifts.map((gift) => gift.totalAmount || 0),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  const topContributorsData = {
    labels: topContributors.map(
      (contributor) => contributor.name || "Unknown Contributor"
    ),
    datasets: [
      {
        label: "Contribution Amount",
        data: topContributors.map(
          (contributor) => contributor.totalAmount || 0
        ),
        backgroundColor: "#36A2EB",
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Received Gifts
          </h2>
          <Pie data={receivedGiftsData} />
        </div>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Top Contributors
          </h2>
          <Bar
            data={topContributorsData}
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: { color: "#333" },
                },
                x: {
                  ticks: { color: "#333" },
                },
              },
              plugins: {
                legend: { position: "top", labels: { color: "#333" } },
              },
            }}
          />
        </div>
      </div>
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Received Gifts
          </h2>
          <ul className="space-y-4">
            {receivedGifts.map((gift) => (
              <li
                key={gift.eventId || gift.eventName}
                className="flex justify-between items-center border-b pb-2"
              >
                <span className="text-gray-700">{gift.eventName}</span>
                <span className="font-semibold text-lg text-green-600">
                  Rs. {gift.totalAmount}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Contributed Gifts
          </h2>
          <ul className="space-y-4">
            {contributedGifts.map((gift) => (
              <li
                key={gift.eventId || gift.eventName}
                className="flex justify-between items-center border-b pb-2"
              >
                <span className="text-gray-700">{gift.eventName}</span>
                <span className="font-semibold text-lg text-blue-600">
                  Rs. {gift.totalAmount}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
