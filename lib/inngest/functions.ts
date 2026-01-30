import { sendWelcomeEmail } from "../nodemailer";
import { inngest } from "./client";
import { PERSONALIZED_WELCOME_EMAIL_PROMPT } from "./prompts";

/**
 * background workflows - Send a personalized welcome email upon user sign-up
 * - Waits for an event: `app/user.created`
 * - Builds a personalized prompt
 * - Uses Gemini AI to generate email content
 * - Sends a welcome email via Nodemailer
 */
export const sendSignUpEmail = inngest.createFunction(
  { id: "send-sign-up-email" }, // Used for logs, retries, dashboard visibility
  // Event trigger run only `inngest.send({ name: "app/user.created" })`
  { event: "app/user.created" },
  async ({ event, step }) => {
    // Convert structured user data → readable text for AI prompt
    const userProfile = `
        - Country: ${event.data.country}
        - Investment goals: ${event.data.investmentGoals}
        - Risk tolerance: ${event.data.riskTolerance}
        - Preferred industry: ${event.data.preferredIndustry}
        `;

    // Prepare AI prompt
    const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace(`{{userProfile}}`, userProfile);

    // AI inference step
    const response = await step.ai.infer("generate-welcome-intro", {
      model: step.ai.models.gemini({ model: "gemini-2.5-flash-lite" }),
      body: {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      },
    });

    // Sending the email
    await step.run("send-welcome-email", async () => {
      // Extract AI response safely - Prevents runtime crashes
      const part = response.candidates?.[0].content.parts?.[0];
      // Fallback text if AI response fail or return empty output
      const introText =
        (part && "text" in part ? part.text : null) ||
        "Thanks for joining Signalist! We're excited to have you on board.";

      // destructure email and name from event data
      const {
        data: { email, name },
      } = event;

      // Send the email
      return await sendWelcomeEmail({ email, name, intro: introText });
    });

    return {
      success: true,
      message: "Welcome email send successfully",
    };
  },
);
