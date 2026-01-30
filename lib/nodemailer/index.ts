import nodemailer from "nodemailer";
import { WELCOME_EMAIL_TEMPLATE } from "./templates";

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
