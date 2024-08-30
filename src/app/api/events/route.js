import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoDB";
import Event from "@/models/Event";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/User";
import emailjs from 'emailjs-com';
import nodemailer from 'nodemailer';
import { sendInvitation } from '@/lib/sendInvitation';




export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect(); 

    // Fetch the logged-in user
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Find events where the logged-in user is either the host or an invited guest
    const events = await Event.find({
      $or: [
        { hostId: user._id }, // User is the host
        { "guests.email": user.email, "guests.phone": user.phone } // User is an invited guest
      ]
    }).populate("hostId");

    //const events = await Event.find().populate("hostId")
    return NextResponse.json(events, { status: 200 });
    
  } catch (error) {
    console.error("Error stack trace:", error.stack);
    console.error("Error message:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { name, date, venue, hostId, guests } = await req.json();
    console.log("Parsed request data:", { name, date, venue, hostId, guests });

    if (!name || !date || !venue || !hostId || !guests || guests.length === 0) {
      console.log("Missing required fields:", { name, date, venue, hostId, guests });
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    await dbConnect();
    console.log("MongoDB connected successfully.");

    const hostUser = await User.findById(hostId);
    if (!hostUser) {
      return NextResponse.json(
        { message: "Host user not found" },
        { status: 400 }
      );
    }

    console.log("host:", hostUser);

    // Map the guests to the expected format
    const guestDetails = guests.map((guest, index) => {
      console.log(`Processing guest ${index + 1}:`, guest);
      return {
        name: guest.name,
        email: guest.email,
        phone: guest.phone,
      };
    });
    console.log("Guest details", guestDetails);

    const newEvent = new Event({
      name,
      date,
      venue,
      hostId,
      guests: guestDetails,
      closed: false,
    });

    console.log("New Event to be saved:", newEvent);


    // Save the event in the database
    await newEvent.save();
    console.log("Event created successfully:", newEvent);


    // Send invitations to guests
    // guests.forEach((guest) => {
    //   sendInvitation(guest.email, guest.name, name);
    // });

    // console.log("Invitation sent");

    // Return a success response with the newly created event
    return NextResponse.json(
      { success: true, event: newEvent },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error stack trace:", error.stack);
    console.error("Error message:", error.message);

    console.log("Failed data:", {
      name,
      date,
      venue,
      hostId,
      guests
    });

    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
