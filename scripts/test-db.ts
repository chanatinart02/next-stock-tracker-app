import { connectToDatabase } from "../database/mongoose";

/**
 * Test my real database connection `connectToDatabase`
 * it verifies
 * - my app connection logic works
 * - caching logic doesn’t throw
 * - set MONGODB_URI is valid
 */
async function main() {
  try {
    await connectToDatabase();
    // If connectToDatabase resolves without throwing, connection is OK
    console.log("OK: Database connection succeeded");
    process.exit(0);
  } catch (err) {
    console.error("ERROR: Database connection failed");
    console.error(err);
    process.exit(1);
  }
}

main();
