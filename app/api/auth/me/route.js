// app/api/auth/me/route.js
import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../../src/lib/serverAuth';

// Force dynamic rendering (no caching)
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Auth /me error:', error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}