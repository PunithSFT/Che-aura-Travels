// app/api/auth/signup/route.js — FIXED VERSION
import { NextResponse } from 'next/server';
import { connectDB } from '../../../../src/lib/db';
import User from '../../../../src/models/User';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendVerificationEmail } from '../../../../src/lib/email';
import { signupLimiter } from '../../../../src/middleware/rateLimit';
import zxcvbn from 'zxcvbn';

export async function POST(request) {
  console.log('[Signup] Request received');

  try {
    // Apply rate limiter (Next.js compatible way)
    const limiterResponse = signupLimiter(request, () => {}, () => {});
    if (limiterResponse && limiterResponse.status === 429) {
      console.log('[Signup] Rate limit exceeded');
      return limiterResponse;
    }

    const { name, email, password } = await request.json();
    console.log('[Signup] Body parsed:', { name, email });

    if (!name || !email || !password) {
      console.log('[Signup] Missing fields');
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    console.log('[Signup] Connecting to DB...');
    await connectDB();
    console.log('[Signup] DB connected');

    console.log('[Signup] Checking email...');
    const exists = await User.findOne({ email });
    if (exists) {
      console.log('[Signup] Email in use');
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }

    console.log('[Signup] Password strength check...');
    const strength = zxcvbn(password);
    if (strength.score < 3) {
      console.log('[Signup] Weak password - score:', strength.score);
      return NextResponse.json(
        { error: 'Password is too weak. Use 8+ chars, uppercase, numbers, symbols.' },
        { status: 400 }
      );
    }

    console.log('[Signup] Generating token...');
    const verificationToken = crypto.randomBytes(32).toString('hex');

    console.log('[Signup] Creating user...');
    const user = await User.create({
      name,
      email,
      password,
      verificationToken,
      verificationTokenExpiry: Date.now() + 3600000,
    });
    console.log('[Signup] User created:', user._id.toString());

    console.log('[Signup] Sending email to:', email);
    await sendVerificationEmail(email, verificationToken);
    console.log('[Signup] Email sent');

    const userResponse = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    console.log('[Signup] Generating JWT...');
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

    console.log('[Signup] Setting cookie...');
    const authResponse = NextResponse.json(
      { success: true, user: userResponse, message: 'Verification email sent. Check your inbox.' },
      { status: 201 }
    );

    authResponse.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60,
      path: '/',
    });

    console.log('[Signup] Success');
    return authResponse;
  } catch (error) {
    console.error('[Signup] CRASH:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });

    return NextResponse.json(
      { error: error.message || 'Signup failed. Try again.' },
      { status: 500 }
    );
  }
}