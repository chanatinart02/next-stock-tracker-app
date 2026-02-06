"use server";

import { connectToDatabase } from "@/database/mongoose";
import { Watchlist } from "@/database/models/watchlist.model";

// fetching symbols for one user
export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
  if (!email) return [];

  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error("MongoDB connection not found");

    // Find the user by email to get their userId
    const user = await db
      .collection("user")
      .findOne<{ _id?: unknown; id?: string; email?: string }>({ email });

    if (!user) return [];

    // Normalize user ID: either use `id` field or `_id` field
    const userId = (user.id as string) || String(user._id || "");
    if (!userId) return [];

    // Query Watchlist collection by userId
    // Return only the `symbol` field
    // .lean() returns plain JS objects instead of Mongoose documents  which is faster and uses less memory.
    const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();

    // Map results into a simple string[] of symbols and normalize to strings
    return items.map((i) => String(i.symbol));
  } catch (err) {
    console.error("getWatchlistSymbolsByEmail error:", err);
    return [];
  }
}
