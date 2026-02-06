import nodemailer from "nodemailer";
import { NEWS_SUMMARY_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE } from "./templates";

/**
 * Create and export a Nodemailer transporter.
 *
 * This transporter is responsible for:
 * - connecting to Gmail
 * - authenticating using env variables
 */
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL!,
    pass: process.env.NODEMAILER_PASSWORD!,
  },
});

/**
 * Sends a personalized welcome email to a new user.
 * @param email - Recipient email address
 * @param name  - User's name (used in the template)
 * @param intro - AI-generated introduction text
 */
export const sendWelcomeEmail = async ({ email, name, intro }: WelcomeEmailData) => {
  const htmlTemplate = WELCOME_EMAIL_TEMPLATE.replace("{{name}}", name).replace("{{intro}}", intro);

  const mailOptions = {
    from: `"Signalist" <signalist@tinygift.pro>`,
    to: email,
    subject: `Welcome to Signalist - your stock market toolkit is ready!`,
    text: "Thanks for joining Signalist",
    html: htmlTemplate,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

export const sendNewsSummaryEmail = async ({
  email,
  date,
  newsContent,
}: {
  email: string;
  date: string;
  newsContent: string;
}): Promise<void> => {
  const htmlTemplate = NEWS_SUMMARY_EMAIL_TEMPLATE.replace("{{date}}", date).replace(
    "{{newsContent}}",
    newsContent,
  );

  const mailOptions = {
    from: `"Signalist News" <signalist@jsmastery.pro>`,
    to: email,
    subject: `📈 Market News Summary Today - ${date}`,
    text: `Today's market news summary from Signalist`,
    html: htmlTemplate,
  };

  await transporter.sendMail(mailOptions);
};
