'use client'

import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import EventList from '@/components/EventList'
import { useState, useEffect } from 'react';
import { fetchEvents } from '@/lib/fetchEvents';
import Loader from '@/components/Loader';


export default function HomePage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [events, setEvents] = useState([]);
  
  // Redirect to login if the user is not authenticated
  useEffect(() => {
    // Redirect to login if the user is not authenticated
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  useEffect(() => {
    async function loadEvents() {
      const eventData = await fetchEvents();
      setEvents(eventData);
    }
    loadEvents();
  }, []);

  // const handleFetchUpdatedEvents = async () => {
  //   const updatedEvents = await fetchEvents();
  //   setEvents(updatedEvents);
  // };

  const fetchUpdatedEvents = async () => {
    const eventData = await fetchEvents();
    setEvents(eventData);
  };


  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">Welcome, {session?.user?.name || 'User'}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Dashboard */}
        <div 
          onClick={() => router.push('/dashboard')} 
          className="bg-blue-500 text-white p-8 rounded-lg shadow-lg hover:bg-blue-600 transition-colors duration-300 cursor-pointer transform hover:-translate-y-1"
        >
          <h2 className="text-2xl font-semibold mb-4 text-center">Dashboard</h2>
          <p className="text-center">View your dashboard to manage your gifts and contributions.</p>
        </div>

        {/* Create Event */}
        <div 
          onClick={() => router.push('/events/create')} 
          className="bg-green-500 text-white p-8 rounded-lg shadow-lg hover:bg-green-600 transition-colors duration-300 cursor-pointer transform hover:-translate-y-1"
        >
          <h2 className="text-2xl font-semibold mb-4 text-center">Create Event</h2>
          <p className="text-center">Create a new event for your money gift manager application.</p>
        </div>

        {/* Events */}
        <div 
          onClick={() => router.push('/events')} 
          className="bg-purple-500 text-white p-8 rounded-lg shadow-lg hover:bg-purple-600 transition-colors duration-300 cursor-pointer transform hover:-translate-y-1"
        >
          <h2 className="text-2xl font-semibold mb-4 text-center">Events</h2>
          <p className="text-center">View all events you have created or contributed to.</p>
        </div>
      </div>

      {/* <EventList events={events} onFetchUpdatedEvents={fetchUpdatedEvents} /> */}

      {/* {events.length > 0 ? (
        <EventList events={events} onFetchUpdatedEvents={fetchUpdatedEvents} />
      ) : (
        <Loader />
      )} */}
    </div>
  )
}
