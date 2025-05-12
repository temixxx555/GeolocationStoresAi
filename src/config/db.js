// lib/mongodb.js
import mongoose from 'mongoose';

const MONGODB_URI = process.env.DB_LOCATION;

if (!MONGODB_URI) {
  throw new Error('Please define the DB_LOCATION environment variable inside .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      autoIndex: true,
    }).then((mongoose) => {
      console.log('✅ MongoDB connected');
      return mongoose;
    }).catch((err) => {
      console.error('❌ MongoDB connection error:', err);
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
