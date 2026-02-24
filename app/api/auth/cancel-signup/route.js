import { NextResponse } from 'next/server';
import { connectDB } from '../../../../src/lib/db';
import User from '../../../../src/models/User';

export async function POST(request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email, isVerified: false });
    if (!user) {
      return NextResponse.json({ error: 'No unverified account found' }, { status: 400 });
    }

    await User.deleteOne({ email });

    return NextResponse.json({ success: true, message: 'Signup cancelled successfully' });
  } catch (error) {
    console.error('Cancel signup error:', error);
    return NextResponse.json({ error: 'Failed to cancel signup' }, { status: 500 });
  }
}