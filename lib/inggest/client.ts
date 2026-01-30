import { Inngest } from "inngest";

/**
 * Creates an Inngest client instance.
 * - Inngest needs one central client to:
 *   - receive events
 *   - create background functions
 *   - run AI steps
 *
 * Think of this as:
 * "the connection between our app and Inngest"
 */
export const inngest = new Inngest({
  id: "Signalist", // Unique name that shows up in the Inngest dashboard
  // Optional: configure AI settings for our workflows
  ai: {
    gemini: {
      apiKey: process.env.GEMINI_API_KEY,
    },
  },
});
