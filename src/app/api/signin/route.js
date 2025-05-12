import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import User from "../../../models/User";

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

export async function POST(request) {
  try {
    const { fullname, state, password, community, email } = await request.json();

    // Fullname Validation
    if (fullname.length < 3 || fullname.length > 20) {
      return NextResponse.json({ error: "Fullname must be between 3 and 20 characters." }, { status: 403 });
    }

    // Community Validation
    if (community.length < 5 || community.length > 20) {
      return NextResponse.json({ error: "Community must be between 5 and 20 characters." }, { status: 403 });
    }

    // State Validation
    if (state.length < 5 || state.length > 20) {
      return NextResponse.json({ error: "State must be between 5 and 20 characters." }, { status: 403 });
    }

    // Email Validation
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 403 });
    }
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Email is invalid" }, { status: 403 });
    }

    // Password Validation
    if (!passwordRegex.test(password)) {
      return NextResponse.json({
        error: "Password should be 6 to 20 characters long with at least one numeric, one lowercase, and one uppercase letter.",
      }, { status: 403 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the username (combining fullname and email)
    const username = `${fullname}${email}`;

    // Create new user instance
    const user = new User({
      personal_info: {
        fullname,
        email,
        password: hashedPassword,
        username,
      },
    });

    // Save the user to the database
    const newUser = await user.save();

    return NextResponse.json(formatDataToSend(newUser), { status: 200 });
    
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function formatDataToSend(user) {
  // Format user data for the response
  return {
    message: "User created successfully",
    user: {
      fullname: user.personal_info.fullname,
      email: user.personal_info.email,
      username: user.personal_info.username,
    },
  };
}
