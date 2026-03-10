import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "./db";
import User from "../models/User";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        try {
          await connectDB();
          let existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            const randomPassword = Math.random().toString(36).slice(-10) + "A1!";
            existingUser = await User.create({
              name: user.name,
              email: user.email,
              password: randomPassword,
              isVerified: true,
              role: "user",
            });
          } else if (!existingUser.isVerified) {
            existingUser.isVerified = true;
            await existingUser.save();
          }
          user.id = existingUser._id.toString();
          return true;
        } catch (error) {
          console.error("Error during Google sign in:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
