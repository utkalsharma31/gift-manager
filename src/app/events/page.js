'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import EventForm from '@/components/EventForm'
import { fetchEvents } from '@/lib/fetchEvents';
import EventList from '@/components/EventList'

export default function EventsPage() {
  const { data: session, status } = useSession()
  const [events, setEvents] = useState([])
  
  useEffect(() => {
    // async function fetchEvents() {
    //   if (status === 'authenticated') {
    //     const res = await fetch('/api/events', {
    //       headers: { Authorization: `Bearer ${session.user.id}` },
    //     })
    //     const data = await res.json()
    //     setEvents(data)
    //   }
    // }
    // fetchEvents()

    if (status === 'authenticated') {
      async function loadEvents() {
        const eventData = await fetchEvents();
        setEvents(eventData);
      }
      loadEvents();
    }
  }, [status])

  if (status === 'loading') return <div className="flex justify-center items-center h-screen">Loading...</div>
  if (status === 'unauthenticated') return <div className="flex justify-center items-center h-screen">Access denied</div>
  // if (events.length === 0) return <div className="flex justify-center items-center h-screen">No events available</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl text-center font-bold mb-8">Your Events</h1>
      {/* <EventForm /> */}
      {events.length > 0 ? <EventList events={events} /> : <div>No events available</div>}
    </div>
  )
}