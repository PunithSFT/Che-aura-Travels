import { NextResponse } from 'next/server';
import { connectDB } from '../../../../src/lib/db';
import User from '../../../../src/models/User';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP required' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({
      email,
      verificationToken: otp,
      verificationTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 });
    }

    // Success: verify & log in
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    const response = NextResponse.json({
      success: true,
      message: 'Account verified and logged in!',
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('[Verify OTP] Error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}