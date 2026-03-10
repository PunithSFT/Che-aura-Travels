import { NextResponse } from 'next/server';
import { connectDB } from '../../../../src/lib/db';
import User from '../../../../src/models/User';
import crypto from 'crypto';
import { sendVerificationEmail } from '../../../../src/lib/email';
import { signupLimiter } from '../../../../src/middleware/rateLimit';
import zxcvbn from 'zxcvbn';

export async function POST(request) {
  console.log('[Signup] Request received');

  try {
    const { name, email, password } = await request.json();
    console.log('[Signup] Body parsed:', { name, email, passwordProvided: !!password });

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    await connectDB();

    let user = await User.findOne({ email });
    if (user && user.isVerified) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }

    // Clean old unverified attempt if exists
    if (user) {
      await User.deleteOne({ email });
    }

    const strength = zxcvbn(password);
    if (strength.score < 3) {
      return NextResponse.json(
        { error: 'Password is too weak. Use 8+ chars, uppercase, numbers, symbols.' },
        { status: 400 }
      );
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    // Password is passed here – pre-save hook in User model will hash it
    user = await User.create({
      name: name.trim(),
      email: email.trim(),
      password,                // ← FIXED: explicitly passing the plain password
      verificationToken: otp,
      verificationTokenExpiry: Date.now() + 10 * 60 * 1000,
      isVerified: false,
    });

    console.log('[Signup] Unverified user created:', user._id.toString());

    await sendVerificationEmail({
      to: email,
      name: name.trim() || 'User',
      verificationToken: otp,
    });

    return NextResponse.json({
      success: true,
      message: 'Account created! Please check your email and enter the 6-digit code to verify.',
      email: email.trim(),
    }, { status: 201 });

  } catch (error) {
    console.error('[Signup] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Signup failed. Try again.' },
      { status: 500 }
    );
  }
}