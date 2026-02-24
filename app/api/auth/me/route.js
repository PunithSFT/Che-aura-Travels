// app/api/auth/me/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '../../../../src/lib/db';
import User from '../../../../src/models/User';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// Force dynamic rendering (no caching)
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Await cookies() properly in async route
    const cookieStore = await cookies();  // ← this fixes the error
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error('Token verification failed:', err.message);
      return NextResponse.json({ user: null });
    }

    // Connect to DB
    await connectDB();

    // Find user (exclude password)
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return NextResponse.json({ user: null });
    }

    // Return user object (includes isVerified)
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Auth /me error:', error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}