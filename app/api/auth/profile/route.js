// app/api/auth/profile/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '../../../../src/lib/db';
import User from '../../../../src/models/User';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import { mkdir } from 'fs/promises';
import { getAuthenticatedUser } from '../../../../src/lib/serverAuth';
import { put, del } from '@vercel/blob';

export async function PUT(request) {
  try {
    await connectDB();
    const authenticatedUser = await getAuthenticatedUser();
    if (!authenticatedUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await User.findById(authenticatedUser._id);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const formData = await request.formData();
    const name = formData.get('name');
    const phone = formData.get('phone');
    const bio = formData.get('bio');
    const profilePic = formData.get('profilePic');

    console.log('Updating profile for:', user.email);

    if (name !== null) user.name = name.trim() || user.name;
    if (phone !== null) user.phone = phone.trim();
    if (bio !== null) user.bio = bio.trim();

    // ────────────────────────────────────────────────
    // PROFILE PICTURE UPLOAD LOGIC
    // ────────────────────────────────────────────────
    if (profilePic && typeof profilePic !== 'string' && profilePic.size > 0) {
      try {
        const fileExt = profilePic.name ? profilePic.name.split('.').pop() : 'jpg';
        const filename = `${user._id}-${Date.now()}.${fileExt}`;

        // 1. Detect environment (Vercel vs Local)
        const isVercel = !!process.env.BLOB_READ_WRITE_TOKEN;

        if (isVercel) {
          console.log('Vercel detected: Uploading to Vercel Blob...');
          
          // Delete old blob if it exists
          if (user.profilePic && user.profilePic.includes('public.blob.vercel-storage.com')) {
            try {
              await del(user.profilePic);
              console.log('Deleted old blob image');
            } catch (err) {
              console.warn('Could not delete old blob:', err.message);
            }
          }

          const blob = await put(filename, profilePic, {
            access: 'public',
            addRandomSuffix: true,
          });
          user.profilePic = blob.url;
          console.log('Uploaded to Blob:', blob.url);

        } else {
          console.log('Development mode: Saving to local filesystem...');
          
          const bytes = await profilePic.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const uploadDir = path.join(process.cwd(), 'public/uploads/profiles');

          await mkdir(uploadDir, { recursive: true });
          const filepath = path.join(uploadDir, filename);

          // Delete old local file if it exists
          if (user.profilePic && user.profilePic.startsWith('/uploads/')) {
            try {
              const oldPath = path.join(process.cwd(), 'public', user.profilePic);
              await unlink(oldPath);
              console.log('Deleted old local file');
            } catch (err) {
              console.warn('Could not delete old local file:', err.message);
            }
          }

          await writeFile(filepath, buffer);
          user.profilePic = `/uploads/profiles/${filename}`;
        }
      } catch (uploadError) {
        console.error('Upload error:', uploadError);
      }
    }

    await user.save();
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
    const userWithPassword = await getAuthenticatedUser();
    if (!userWithPassword) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { password } = await request.json();
    const user = await User.findById(userWithPassword._id).select('+password');

    if (user.password) {
      if (!password) return NextResponse.json({ error: 'Password required' }, { status: 400 });
      const isMatch = await user.comparePassword(password);
      if (!isMatch) return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }

    // Cleanup assets before deletion
    if (user.profilePic) {
      if (user.profilePic.includes('public.blob.vercel-storage.com')) {
        await del(user.profilePic).catch(() => {});
      } else if (user.profilePic.startsWith('/uploads/')) {
        const oldPath = path.join(process.cwd(), 'public', user.profilePic);
        await unlink(oldPath).catch(() => {});
      }
    }

    await User.deleteOne({ _id: user._id });

    const response = NextResponse.json({ success: true, message: 'Account deleted' });
    response.cookies.set('token', '', { expires: new Date(0), path: '/' });
    return response;
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}