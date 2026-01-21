import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Global cache typing
 * files can be re-executed many times in dev mode
 * to avoid creating multiple database connections.
 */
declare global {
  var mongooseCache: {
    conn: typeof mongoose | null; // resolved mongoose connection
    promise: Promise<typeof mongoose> | null; // in-progress connection promise
  };
}

/**
 * Reuse existing cache or create a new one.
 * The cache lives on the global object so it survives module reloads.
 */
let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

/**
 * Connect to MongoDB using a cached connection if available.
 * This prevents:
 * - multiple connections in dev hot reload
 * - connection storms in serverless environments
 */
export const connectToDatabase = async () => {
  if (!MONGODB_URI) throw new Error("MONGODB_URI is not defined in .env file");

  // If already connected, reuse the existing connection
  if (cached.conn) return cached.conn;

  // If no connection is in progress, start one
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false, // disable command buffering when disconnected
    });
  }

  try {
    // Await the shared connection promise
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset promise so future calls can retry
    cached.promise = null;
    throw error;
  }

  console.log(`Connected to MongoDB (${mongoose.connection.name}) in ${process.env.NODE_ENV}`);

  return cached.conn;
};
