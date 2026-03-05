import { NextResponse } from 'next/server';
import { connectDB } from '../../../../src/lib/db';
import User from '../../../../src/models/User';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendVerificationEmail } from '../../../../src/lib/email';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    if (!user.isVerified) {
      // Clear any old token first (prevents confusion with old codes)
      user.verificationToken = undefined;
      user.verificationTokenExpiry = undefined;

      // Generate fresh OTP
      const otp = crypto.randomInt(100000, 999999).toString();
      user.verificationToken = otp;
      user.verificationTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();

      await sendVerificationEmail({
        to: email,
        name: user.name || 'User',
        verificationToken: otp,
      });

      return NextResponse.json({
        success: false,
        requiresVerification: true,
        message: 'Your account needs email verification. We sent a new 6-digit code to your inbox.',
        email: email.trim(),
      }, { status: 200 });
    }

    // Verified → login success
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    const response = NextResponse.json({
      success: true,
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: 'Logged in successfully',
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
    console.error('[Login] Error:', error);
    return NextResponse.json({ error: 'Login failed. Please try again.' }, { status: 500 });
  }
}