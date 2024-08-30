"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "./Modal";
import ContributionForm from "./ContributionForm";

export default function EventList({ events, onFetchUpdatedEvents }) {
  const router = useRouter();

  const handleEventClick = (eventId) => {
    router.push(`/events/${eventId}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
      {events.map((event) => (
        <div
          key={event._id}
          onClick={() => handleEventClick(event._id)}
          className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer"
        >
          <h3 className="text-2xl font-bold mb-4 text-white">
            {event.name}
          </h3>
          <p className="text-white">
            <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
          </p>
          <p className="text-white">
            <strong>Venue:</strong> {event.venue}
          </p>
        </div>
      ))}
    </div>
  );
}
