import { getNews } from "../actions/finnhub.actions";
import { getAllUsersForNewsEmail } from "../actions/user.actions";
import { getWatchlistSymbolsByEmail } from "../actions/watchlist.actions";
import { sendNewsSummaryEmail, sendWelcomeEmail } from "../nodemailer";
import { getFormattedTodayDate } from "../utils";
import { inngest } from "./client";
import { NEWS_SUMMARY_EMAIL_PROMPT, PERSONALIZED_WELCOME_EMAIL_PROMPT } from "./prompts";

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

export const sendDailyNewsSummary = inngest.createFunction(
  { id: "daily-news-summary" },
  // Cron job: every day at 12:00 (server time)
  [{ event: "app/send.daily.news" }, { cron: "0 12 * * *" }],
  // [{ event: "app/send.daily.news" }, { cron: "TZ=Asia/Bangkok 23 14 6 2 *" }], // For testing: Feb 6, 2024 at 14:23 Bangkok time
  async ({ step }) => {
    // Step #1: Fetch all users who should receive the news email
    const users = await step.run("get-all-users", getAllUsersForNewsEmail);

    if (!users || users.length === 0)
      return { success: false, message: "No users found for news email" };

    // Step #2: For each user, fetch their personalized news based on watchlist
    const results = await step.run("fetch-user-news", async () => {
      // We will build an array like: [{ user, articles }, { user, articles }, ...]
      const perUser: Array<{ user: UserForNewsEmail; articles: MarketNewsArticle[] }> = [];

      //  loop users one by one instead of Promise.all here
      for (const user of users as UserForNewsEmail[]) {
        try {
          // Get the user's watchlist symbols (e.g. AAPL, TSLA, etc.)
          const symbols = await getWatchlistSymbolsByEmail(user.email);
          // Try to fetch personalized news for those symbols
          let articles = await getNews(symbols);

          // Enforce max 6 articles per user
          articles = (articles || []).slice(0, 6);

          // If the user has no news (empty watchlist or API returned nothing),
          // fallback to general market news
          if (!articles || articles.length === 0) {
            articles = await getNews();
            articles = (articles || []).slice(0, 6);
          }
          // Store the result for this user
          perUser.push({ user, articles });
        } catch (e) {
          console.error("daily-news: error preparing user news", user.email, e);
          perUser.push({ user, articles: [] });
        }
      }
      return perUser;
    });

    // =========================
    // Step #3: Summarize each user's news with AI
    // =========================
    // We build a new array that contains:
    // - the user
    // - the generated summary text (or null if failed)
    const userNewsSummaries: { user: UserForNewsEmail; newsContent: string | null }[] = [];

    for (const { user, articles } of results) {
      try {
        // Build the prompt by injecting the user's articles as JSON
        // Using JSON keeps the structure clear and predictable for the model
        const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace(
          "{{newsData}}",
          JSON.stringify(articles, null, 2),
        );

        // AI inference to generate the news summary
        const response = await step.ai.infer(`summarize-news-${user.email}`, {
          model: step.ai.models.gemini({ model: "gemini-2.5-flash-lite" }),
          body: {
            contents: [{ role: "user", parts: [{ text: prompt }] }],
          },
        });

        // Safely extract the text from the AI response
        const part = response.candidates?.[0]?.content?.parts?.[0];
        // If anything is missing, fallback to a default message
        const newsContent = (part && "text" in part ? part.text : null) || "No market news.";

        userNewsSummaries.push({ user, newsContent });
      } catch (e) {
        console.error("Failed to summarize news for : ", user.email);
        userNewsSummaries.push({ user, newsContent: null });
      }
    }

    // Step #4: Send emails
    await step.run("send-news-emails", async () => {
      //  use Promise.all to send emails in parallel for speed
      await Promise.all(
        userNewsSummaries.map(async ({ user, newsContent }) => {
          // If summarization failed, skip sending
          if (!newsContent) return false;

          return await sendNewsSummaryEmail({
            email: user.email,
            date: getFormattedTodayDate(),
            newsContent,
          });
        }),
      );
    });

    return { success: true, message: "Daily news summary emails sent successfully" };
  },
);
