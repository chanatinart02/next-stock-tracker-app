"use server";

import { headers } from "next/headers";
import { auth } from "../better-auth/auth";
import { inngest } from "../inggest/client";

/**
 * Sign up a user using email and password.
 * Also triggers a welcome email via Inngest.
 */
export const signUpWithEmail = async ({
  email,
  password,
  fullName,
  country,
  investmentGoals,
  riskTolerance,
  preferredIndustry,
}: SignUpFormData) => {
  try {
    // Create user in Better Auth
    const response = await auth.api.signUpEmail({
      body: {
        email: email,
        password: password,
        name: fullName,
      },
    });

    // Trigger welcome email via Inngest
    if (response) {
      await inngest.send({
        name: "app/user.created",
        data: {
          email,
          name: fullName,
          country,
          investmentGoals,
          riskTolerance,
          preferredIndustry,
        },
      });
    }

    return { success: true, data: response };
  } catch (error) {
    console.log("Error signing up:", error);
    return { success: false, message: "Sign-up failed. Please try again." };
  }
};

/**
 * Sign out the current user.
 */
export const signOut = async () => {
  try {
    await auth.api.signOut({ headers: await headers() });
  } catch (error) {
    console.log("Error signing out:", error);
    return { success: false, message: "Sign-out failed. Please try again." };
  }
};

/**
 * Sign in a user using email and password.
 */
export const signInWithEmail = async ({ email, password }: SignInFormData) => {
  try {
    const response = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    return { success: true, data: response };
  } catch (error) {
    console.log("Error signing in:", error);
    return { success: false, message: "Sign-in failed. Please try again." };
  }
};
