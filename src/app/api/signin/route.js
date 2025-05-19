import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; // Added missing import
import User from "../../../models/User";
import connectDB from "../../../config/db";

// Email regex for validation
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

// Format data to send
const formatDataToSend = (user) => {
  const access_token = jwt.sign(
    { id: user._id },
    process.env.SECRET_ACCESS_KEY
  );
  return {
    access_token,
    profile_img: user.personal_info.profile_img,
    username: user.personal_info.username,
    fullname: user.personal_info.fullname,
    state: user.personal_info.state,
  };
};

export async function POST(request) {
  try {
    // Ensure database is connected
    const isConnected = await connectDB();
    if (!isConnected) {
      return NextResponse.json(
        { error: "Database connection failed." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    // Validate presence and type
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required and must be a string." },
        { status: 400 }
      );
    }
    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Password is required and must be a string." },
        { status: 400 }
      );
    }

    // Validate email format
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Email is invalid." }, { status: 400 });
    }

    // Find user by email
    const user = await User.findOne({ "personal_info.email": email });
    if (!user) {
      return NextResponse.json({ error: "Email not found." }, { status: 403 });
    }

    // Check for Google auth
    if (user.google_auth) {
      return NextResponse.json(
        {
          error: "Account was created with Google. Please sign in with Google.",
        },
        { status: 403 }
      );
    }

    // Compare password
    const isMatch = await bcrypt.compare(
      password,
      user.personal_info.password
    );
    if (!isMatch) {
      return NextResponse.json(
        { error: "Incorrect password." },
        { status: 403 }
      );
    }

    // Return formatted response
    return NextResponse.json(
      {
        success: true,
        message: "User signed in successfully.",
        data: formatDataToSend(user),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /signin error:", error);
    return NextResponse.json(
      { error: "Server error, please try again." },
      { status: 500 }
    );
  }
}