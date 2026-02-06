"use server";

import { connectToDatabase } from "@/database/mongoose";

export const getAllUsersForNewsEmail = async () => {
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;

    if (!db) throw new Error("Database connection not established");

    // Query users collection for all users with email and name
    // Ensure the fields exist and are not null
    // Projection to only get necessary fields
    const users = await db
      .collection("user")
      .find(
        { email: { $exists: true, $ne: null } },
        { projection: { _id: 1, id: 1, email: 1, name: 1, country: 1 } },
      )
      .toArray();

    //  Filter out users missing email or name (safety check)
    //  - Normalize the ID:
    //        Prefer `user.id` (if your auth system provides it),
    //        otherwise fallback to MongoDB `_id`
    //    - Return only the fields needed by the email workflow
    return users
      .filter((user) => user.email && user.name)
      .map((user) => ({
        id: user.id || user._id.toString() || "",
        email: user.email,
        name: user.name,
      }));
  } catch (error) {
    console.error("Error fetching users for new email:", error);
    return [];
  }
};
