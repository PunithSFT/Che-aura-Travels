"use client";

import { signIn as clientSignIn } from "next-auth/react";

// Helper function to trigger Google login (Safe for client components)
export const loginWithGoogle = async (callbackUrl = "/") => {
  try {
    await clientSignIn("google", {
      callbackUrl, // Where to redirect after successful login (default: home page)
    });
  } catch (error) {
    console.error("Google login failed:", error);
  }
};
