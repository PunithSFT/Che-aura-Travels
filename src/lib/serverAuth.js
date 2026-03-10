import { auth } from "./auth";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectDB } from "./db";
import User from "../models/User";

export async function getAuthenticatedUser() {
  try {
    // 1. Try NextAuth session (Google) - Using v5 auth()
    const session = await auth();
    
    await connectDB();

    if (session && session.user && session.user.id) {
      const user = await User.findById(session.user.id).select("-password");
      if (user) return user;
    }

    // 2. Try custom JWT token cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select("-password");
      return user || null;
    } catch (err) {
      console.error("Token verification failed:", err.message);
      return null;
    }
  } catch (error) {
    console.error("getAuthenticatedUser error:", error);
    return null;
  }
}
