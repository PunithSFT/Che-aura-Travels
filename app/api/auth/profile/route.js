// app/api/auth/profile/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '../../../../src/lib/db';
import User from '../../../../src/models/User';
import jwt from 'jsonwebtoken';
import { writeFile } from 'fs/promises';
import path from 'path';
import { mkdir } from 'fs/promises';


export async function PUT(request) {
  try {
    await connectDB();

    const formData = await request.formData();
    const name = formData.get('name');
    const phone = formData.get('phone');
    const bio = formData.get('bio');
    const profilePic = formData.get('profilePic');

    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    let user = await User.findById(decoded.userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Update text fields
    if (name) user.name = name.trim();
    if (phone) user.phone = phone.trim();
    if (bio) user.bio = bio.trim();

    // Handle profile picture
    if (profilePic && profilePic.size > 0) {
      const bytes = await profilePic.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const filename = `${user._id}-${Date.now()}.${profilePic.name.split('.').pop()}`;
      const uploadDir = path.join(process.cwd(), 'public/uploads/profiles');

      await mkdir(uploadDir, { recursive: true });
      const filepath = path.join(uploadDir, filename);

      await writeFile(filepath, buffer);

      user.profilePic = `/uploads/profiles/${filename}`;
    }

    await user.save();

    // Fetch fresh user without password
    const updatedUser = await User.findById(user._id).select('-password');

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

// DELETE (account deletion) - optional but good to have
export async function DELETE(request) {
  try {
    await connectDB();

    const { password } = await request.json();

    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('+password');

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }

    // Delete user
    await User.deleteOne({ _id: user._id });

    const response = NextResponse.json({ success: true, message: 'Account deleted successfully' });
    response.cookies.set('token', '', { expires: new Date(0), path: '/' });

    return response;
  } catch (error) {
    console.error('Delete profile error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}