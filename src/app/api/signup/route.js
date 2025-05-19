import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import User from "../../../models/User";
import connectDB from "../../../config/db"; 

// Email and password regex
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

// Format data to send (based on the second provided formatDataToSend)
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
    state:user.personal_info.state
  };
};

// Generate unique username
const generateUsername = async (email) => {
  let username = email.split("@")[0];
  const isUsernameNotUnique = await User.exists({
    "personal_info.username": username,
  });
  if (isUsernameNotUnique) {
    username += nanoid(5);
  }
  return username;
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
    const { fullname, email, password ,state} = body;

    // Validate presence and type
    if (!fullname || typeof fullname !== "string") {
      return NextResponse.json(
        { error: "Fullname is required and must be a string." },
        { status: 400 }
      );
    }
    if (!state || typeof state !== "string") {
      return NextResponse.json(
        { error: "State is required and must be a string." },
        { status: 400 }
      );
    }
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

    // Trim and validate content
    const trimmedFullname = fullname.trim();
    if (trimmedFullname.length < 3 || trimmedFullname.length > 20) {
      return NextResponse.json(
        { error: "Fullname must be between 3 and 20 characters." },
        { status: 400 }
      );
    }
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Email is invalid." }, { status: 400 });
    }
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        {
          error:
            "Password must be 6–20 characters with at least one digit, one lowercase, and one uppercase letter.",
        },
        { status: 400 }
      );
    }

    // Generate unique username
    const username = await generateUsername(email);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save user
    const user = new User({
      personal_info: {
        fullname: trimmedFullname,
        email,
        password: hashedPassword,
        username,
        state
      },
    });

    const savedUser = await user.save();

    // Return formatted response
    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully.",
        data: formatDataToSend(savedUser),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /signup error:", error);

    // Handle duplicate email
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Email already exists." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to register user. Please try again." },
      { status: 500 }
    );
  }
}