import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoDB";
import Event from "@/models/Event";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  const phone = searchParams.get('phone');

  if (!email || !phone) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  try {
    await dbConnect();

    // Find events where the guest email and phone match
    const events = await Event.find({
      "guests.email": email,
      "guests.phone": phone
    });

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
