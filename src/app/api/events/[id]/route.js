import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoDB";
import Event from "@/models/Event";

export async function GET(req, { params }) {
  console.log("GET function initiated with ID:", params.id);
  try {
    await dbConnect();

    const { id } = params;
    //const userId = req.userId;  

    const event = await Event.findById(id);
    // const event = await Event.findById(id)
    //   .populate('hostId')
    //   .populate('guests')
    //   .populate({
    //     path: 'contributions',
    //     populate: {
    //       path: 'contributor',
    //       select: 'name',
    //     },
    //   })
    //   .exec();

    console.log("Guests in the event:", event);

    if (!event) {
      console.log("Event not found in database");
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    // const isHost = event.hostId.equals(userId);
    // const isGuest = event.guests.some(guest => guest.email === req.userEmail); // Assuming user's email is stored in session

    // if (!isHost && !isGuest) {
    //   return NextResponse.json({ error: "Access denied" }, { status: 403 });
    // } s

    console.log("Populated event data:", event);

    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.error("Error during GET request:", error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}
