import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoDB";
import Event from "@/models/Event";
import User from "@/models/User";
import Contribution from "@/models/Contribution";



export async function POST(req) {
  try {
    const { eventId, phoneNumber, amount } = await req.json();

    console.log("Received data:", { eventId, phoneNumber, amount });


    if (!eventId || !phoneNumber || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find the event by ID
    const event = await Event.findById(eventId);

    console.log("Event found:", event);

    if (event.closed) {
      return NextResponse.json({ error: "This event is closed for contributions" }, { status: 400 });
    }


    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const guest = event.guests.find(guest => guest.phone === phoneNumber);

    console.log("Guest found:", guest);


    if (!guest) {
      return NextResponse.json(
        { error: "Guest not found in event" },
        { status: 404 }
      );
    }

    const contributionAmount = parseFloat(amount);
    if (isNaN(contributionAmount)) {
      return NextResponse.json(
        { error: "Invalid contribution amount" },
        { status: 400 }
      );
    }
    

    const contribution = new Contribution({
      event: eventId,
      contributor: {
        name: guest.name,
        phone: guest.phone,
        email: guest.email || "", 
      },
      amount,
    });

    console.log("Contribution to save:", contribution);


    await contribution.save();


    event.contributions = event.contributions || []; 
    event.contributions.push(contribution._id); 
    await event.save();

    return NextResponse.json({ success: true, event }, { status: 201 });
  } catch (error) {
    console.error("Error stack trace:", error.stack);
    console.error("Error message:", error.message);
    return NextResponse.json(
      { error: "Failed to add contribution" },
      { status: 500 }
    );
  }
}
