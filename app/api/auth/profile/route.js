// app/api/auth/profile/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '../../../../src/lib/db';
import User from '../../../../src/models/User';
import { writeFile } from 'fs/promises';
import path from 'path';
import { mkdir } from 'fs/promises';
import { getAuthenticatedUser } from '../../../../src/lib/serverAuth';

export async function PUT(request) {
  try {
    await connectDB();
    const authenticatedUser = await getAuthenticatedUser();
    if (!authenticatedUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Fetch a fresh document to ensure we have all fields and it's a Mongoose document
    const user = await User.findById(authenticatedUser._id);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const formData = await request.formData();
    const name = formData.get('name');
    const phone = formData.get('phone');
    const bio = formData.get('bio');
    const profilePic = formData.get('profilePic');

    console.log('Updating profile for user:', user.email);
    console.log('Received data:', { name, phone, bio, hasProfilePic: !!profilePic });

    // Update text fields (allow empty strings to clear fields except for name)
    if (name !== null) user.name = name.trim() || user.name;
    if (phone !== null) user.phone = phone.trim();
    if (bio !== null) user.bio = bio.trim();

    // Handle profile picture
    if (profilePic && typeof profilePic !== 'string' && profilePic.size > 0) {
      try {
        const bytes = await profilePic.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileExt = profilePic.name ? profilePic.name.split('.').pop() : 'jpg';
        const filename = `${user._id}-${Date.now()}.${fileExt}`;
        const uploadDir = path.join(process.cwd(), 'public/uploads/profiles');

        await mkdir(uploadDir, { recursive: true });
        const filepath = path.join(uploadDir, filename);

        await writeFile(filepath, buffer);
        console.log('Profile picture saved at:', filepath);

        user.profilePic = `/uploads/profiles/${filename}`;
      } catch (uploadError) {
        console.error('Error saving profile picture:', uploadError);
        // Continue saving other fields even if picture fails
      }
    }

    await user.save();
    console.log('User document saved successfully');

    // Return updated user without password
    const updatedUser = await User.findById(user._id).select('-password');
    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

// DELETE (account deletion)
export async function DELETE(request) {
  try {
    const userWithPassword = await getAuthenticatedUser(); // Note: getAuthenticatedUser excludes password
    if (!userWithPassword) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // We need password to confirm deletion, but Google users don't have a password
    // For simplicity, let's allow Google users to delete without password if they are authenticated
    // or we could check if they have a password set.

    const { password } = await request.json();
    
    // Find user again WITH password for verification
    const user = await User.findById(userWithPassword._id).select('+password');

    if (user.password) {
        if (!password) {
            return NextResponse.json({ error: 'Password required' }, { status: 400 });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
        }
    }

    // Delete user
    await User.deleteOne({ _id: user._id });

    const response = NextResponse.json({ success: true, message: 'Account deleted successfully' });
    
    // Clear custom JWT cookie
    response.cookies.set('token', '', { expires: new Date(0), path: '/' });
    
    // Note: NextAuth session deletion usually happens on client side via signOut()
    // but clearing the cookie here helps.

    return response;
  } catch (error) {
    console.error('Delete profile error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}