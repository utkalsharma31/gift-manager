"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import emailjs from "emailjs-com";

export default function EventForm() {
  const { data: session } = useSession();
  const [eventData, setEventData] = useState({
    name: "",
    date: "",
    venue: "",
    hostId: "",
    guests: [],
  });

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleAddGuest = () => {
    setEventData({
      ...eventData,
      guests: [...eventData.guests, { name: "", email: "", phone: "" }],
    });
  };

  const handleGuestChange = (index, field, value) => {
    const updatedGuests = [...eventData.guests];
    updatedGuests[index][field] = value;
    setEventData({ ...eventData, guests: updatedGuests });
  };

  const sendInvitation = async (guestEmail, guestName) => {
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const userId = process.env.NEXT_PUBLIC_EMAILJS_USER_ID;

    console.log("Sending email with the following details:");
    console.log("Service ID:", serviceId);
    console.log("Template ID:", templateId);
    console.log("User ID (Public Key):", userId);

    const templateParams = {
      to_name: guestName,
      to_email: guestEmail,
      event_name: eventData.name,
      event_date: eventData.date,
      event_venue: eventData.venue,
      host_name: session.user.name,
    };

    try {
      const response = await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        userId
      );
      console.log("Email sent successfully:", response);
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting event data:", eventData);
    console.log("Session User ID:", session.user.id);

    const dataToSend = {
      ...eventData,
      hostId: session.user.id, // Ensure the host ID is included
    };

    console.log("Submitting event data:", dataToSend);

    const response = await fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.user.id}`,
      },
      body: JSON.stringify(dataToSend),
    });

    if (response.ok) {
      // Send invitations to guests
      eventData.guests.forEach((guest) => {
        sendInvitation(guest.email, guest.name);
      });
      
      // Handle success (e.g., clear form, show success message)
      setEventData({ name: "", date: "", venue: "", guests: [] });
    } else {
      console.error("Error creating event:", await response.text());
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gradient-to-r from-blue-50 to-blue-100 p-8 rounded-lg shadow-lg"
    >
      {/* <h2 className="text-2xl font-semibold mb-4">Create New Event</h2> */}
      <div className="space-y-5">
        <input
          name="name"
          onChange={handleChange}
          placeholder="Event Name"
          required
          className="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="date"
          onChange={handleChange}
          type="date"
          required
          className="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="venue"
          onChange={handleChange}
          placeholder="Venue"
          required
          className="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {eventData.guests.map((guest, index) => (
          <div key={index} className="space-y-2 bg-blue-50 p-4 rounded-lg">
            <input
              placeholder="Guest Name"
              value={guest.name}
              onChange={(e) => handleGuestChange(index, "name", e.target.value)}
              className="w-full p-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              placeholder="Guest Email"
              value={guest.email}
              onChange={(e) =>
                handleGuestChange(index, "email", e.target.value)
              }
              className="w-full p-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              placeholder="Guest Phone Number"
              value={guest.phone}
              onChange={(e) =>
                handleGuestChange(index, "phone", e.target.value)
              }
              className="w-full p-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddGuest}
          className="bg-blue-200 text-blue-800 px-4 py-2 rounded-lg hover:bg-blue-300 transition-colors duration-300"
        >
          Add Guest
        </button>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          Create Event
        </button>
      </div>
    </form>
  );
}
