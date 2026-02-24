// app/api/auth/verify/[token]/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '../../../../../src/lib/db';
import User from '../../../../../src/models/User';

export async function GET(request, { params }) {
  const { token } = params;

  try {
    await connectDB();

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.redirect(
        new URL('/auth?error=invalid_token', request.url)
      );
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    return NextResponse.redirect(
      new URL('/auth?verified=true', request.url)
    );
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.redirect(
      new URL('/auth?error=server_error', request.url)
    );
  }
}