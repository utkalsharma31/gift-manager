import { NextResponse } from "next/server";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongoDB";

export async function POST(request) {
  try {
    console.log("Signup route hit"); 
    const body = await request.json(); 
    console.log("Request body:", body); 
    const { name, phone, email, password, city } = body;

    if (!phone || phone.trim() === '') {
      console.log("Mobile number is missing in the request body");
      return NextResponse.json(
        { message: "Mobile number is required" },
        { status: 400 }
      );
    }

    if (!email || email.trim() === '') {
      return NextResponse.json(
        { message: "Email is required and cannot be empty" },
        { status: 400 }
      );
    }
 
    await dbConnect();
    console.log("Connected to database");


    // const existingUser = await User.findOne({ phone });
    const existingUser = await User.findOne({ $or: [{ phone }, { email }] });
    console.log("Checked for existing user");


    if (existingUser) {
      console.log("User already exists with phone or email:", phone, email);
      return NextResponse.json(
        { message: "User already exists with this phone number or email" },
        { status: 400 }
      );
    }

    // const hashedPassword = await bcrypt.hash(password, 10);
    // console.log("Password hashed");

    console.log("Making new user" )
    const newUser = new User({
      name,
      phone,
      email,
      password, // Save hashed password
      city,
    });

    console.log("Made new user with data", newUser );


    await newUser.save();

    

    console.log("User created successfully");
    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
    
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { message: "Error creating user", error: error.message },
      { status: 500 }
    );
  }
}
