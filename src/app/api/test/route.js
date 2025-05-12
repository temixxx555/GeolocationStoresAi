// src/app/api/test/route.js

import connectDB from "../../../config/db";
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();  // Attempt to connect to MongoDB
    return NextResponse.json({ message: 'MongoDB connected successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Database connection failed', error: error.message }, { status: 500 });
  }
}
