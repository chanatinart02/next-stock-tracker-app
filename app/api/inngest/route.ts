import { serve } from "inngest/next";
import { inngest } from "@/lib/inggest/client";
import { sendSignUpEmail } from "@/lib/inggest/functions";

// API route to handle Inngest functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [sendSignUpEmail],
});
