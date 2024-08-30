import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoDB';
import Event from '@/models/Event';

export async function POST(req) {
  try {
    const { eventId } = await req.json();
    
    if (!eventId) {
      return NextResponse.json({ message: "Event ID is required" }, { status: 400 });
    }

    await dbConnect();

    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    // Check if the event is already closed
    if (event.closed) {
      return NextResponse.json({ message: "Event is already closed" }, { status: 400 });
    }

    // Close the event
    event.closed = true;
    await event.save();

    return NextResponse.json({ success: true, event }, { status: 200 });
  } catch (error) {
    console.error("Error closing event:", error.message);
    return NextResponse.json({ error: "Failed to close event" }, { status: 500 });
  }
}
