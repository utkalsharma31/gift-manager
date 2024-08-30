"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ContributionForm from "@/components/ContributionForm";
import GuestList from "@/components/GuestList";
import Loader from "@/components/Loader";

export default function EventPage({ params }) {
  // console.log("Component is rendering");
  const { data: session, status } = useSession();
  const [event, setEvent] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  // console.log("status:", status);
  // console.log("session:", session);
  // console.log("params.id:", params.id);

  useEffect(() => {
    // console.log("useEffect triggered");

    async function fetchEvent() {
      if (status === "authenticated") {
        console.log("User is authenticated");

        try {
          const res = await fetch(`/api/events/${params.id}`, {
            headers: { Authorization: `Bearer ${session.user.id}` },
          });
          console.log("Response received:", res);

          // if (res.status === 403) {
          //   setAccessDenied(true);
          //   return;
          // }

          const data = await res.json();
          console.log("Fetched event data:", data);
          setEvent(data);

          setIsHost(data.hostId === session.user.id);
        } catch (error) {
          console.error("Error fetching event:", error);
        }
      }
    }
    fetchEvent();
  }, [status, session, params.id]);

  const handleCloseEvent = async () => {
    if (
      confirm(
        "Are you sure you want to close this event? No more contributions will be allowed."
      )
    ) {
      try {
        const res = await fetch(`/api/events/close`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.id}`,
          },
          body: JSON.stringify({ eventId: event._id }),
        });

        if (res.ok) {
          const updatedEvent = await res.json();
          setEvent(updatedEvent);
        } else {
          alert("Failed to close the event. Please try again.");
        }
      } catch (error) {
        console.error("Error closing event:", error);
        alert("An error occurred while closing the event. Please try again.");
      }
    }
  };

  if (status === "loading" || !event) return <Loader />;
  if (status === "unauthenticated")
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Access denied
      </div>
    );

  console.log("Event data:", event);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-blue-700 mb-6">{event.name}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Event Details
            </h2>
            <p className="text-lg text-gray-600">
              <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
            </p>
            <p className="text-lg text-gray-600">
              <strong>Venue:</strong> {event.venue}
            </p>
            <p className="text-lg text-gray-600">
              <strong>Status:</strong>{" "}
              {event.closed ? "Closed" : "Open for Contributions"}
            </p>

            {isHost && !event.closed && (
              <button
                onClick={handleCloseEvent}
                className="mt-6 bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 transition-colors duration-300"
              >
                Close Event
              </button>
            )}
          </div>
          {!event.closed && <ContributionForm eventId={event._id} />}
        </div>
        <div className="mt-10">
          <GuestList guests={event.guests || []} />
        </div>
      </div>
    </div>
  );
}
