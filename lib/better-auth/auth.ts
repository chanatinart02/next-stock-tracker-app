import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { connectToDatabase } from "@/database/mongoose";
import { nextCookies } from "better-auth/next-js";

/**
 * Singleton instance of Better Auth.
 * This prevents creating multiple auth instances
 * during hot reloads or multiple requests.
 */
let authInstance: ReturnType<typeof betterAuth> | null = null;

/**
 * Lazily creates and returns the Better Auth instance.
 */
export const getAuth = async () => {
  // Reuse existing instance if already created
  if (authInstance) return authInstance;

  // Ensure database connection exists
  const mongoose = await connectToDatabase();
  const db = mongoose.connection.db;

  if (!db) throw new Error("Database connection is not fond");

  // Create Better Auth instance
  authInstance = betterAuth({
    // Use MongoDB adapter
    database: mongodbAdapter(db as any),
    // Security & app configuration
    secret: process.env.BETTER_AUTH_SECRET,
    baseUrl: process.env.BETTER_AUTH_URL,
    // Enable email/password authentication
    emailAndPassword: {
      enabled: true,
      disableSignUp: false,
      requireEmailVerification: false,
      minPasswordLength: 6,
      maxPasswordLength: 128,
      autoSignIn: true,
    },
    // Next.js cookie integration
    plugins: [nextCookies()],
  });

  return authInstance;
};

// Export a ready-to-use auth instance
export const auth = await getAuth();
