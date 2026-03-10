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

    const formData = await request.formData();
    const name = formData.get('name');
    const phone = formData.get('phone');
    const bio = formData.get('bio');
    const profilePic = formData.get('profilePic');

    console.log('--- Profile Update Start ---');
    console.log('User:', authenticatedUser.email);
    console.log('Raw formData profilePic:', profilePic ? (typeof profilePic === 'string' ? 'string' : 'File/Blob') : 'null');

    // Fetch existing user to get current profilePic URL for cleanup
    const user = await User.findById(authenticatedUser._id);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const updateData = {};
    if (name !== null) updateData.name = name.trim() || user.name;
    if (phone !== null) updateData.phone = phone.trim();
    if (bio !== null) updateData.bio = bio.trim();

    // ────────────────────────────────────────────────
    // PROFILE PICTURE UPLOAD LOGIC
    // ────────────────────────────────────────────────
    if (profilePic && typeof profilePic !== 'string' && profilePic.size > 0) {
      console.log('New image detected, processing upload...');
      try {
        const fileExt = profilePic.name ? profilePic.name.split('.').pop() : 'jpg';
        const filename = `${user._id}-${Date.now()}.${fileExt}`;
        const isVercel = !!process.env.BLOB_READ_WRITE_TOKEN;

        if (isVercel) {
          // Vercel Blob Path
          if (user.profilePic && user.profilePic.includes('public.blob.vercel-storage.com')) {
            await del(user.profilePic).catch(err => console.warn('Old blob del failed:', err.message));
          }
          const blob = await put(filename, profilePic, { access: 'public', addRandomSuffix: true });
          updateData.profilePic = blob.url;
          console.log('Uploaded to Vercel Blob:', blob.url);
        } else {
          // Local Filesystem Path
          const bytes = await profilePic.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const uploadDir = path.join(process.cwd(), 'public/uploads/profiles');
          await mkdir(uploadDir, { recursive: true });
          const filepath = path.join(uploadDir, filename);

          if (user.profilePic && user.profilePic.startsWith('/uploads/')) {
            const oldPath = path.join(process.cwd(), 'public', user.profilePic);
            await unlink(oldPath).catch(err => console.warn('Old file unlink failed:', err.message));
          }
          await writeFile(filepath, buffer);
          updateData.profilePic = `/uploads/profiles/${filename}`;
          console.log('Saved to local storage:', updateData.profilePic);
        }
      } catch (uploadError) {
        console.error('File upload processing error:', uploadError);
      }
    }

    // Perform the update using findByIdAndUpdate to bypass pre-save hooks if they are causing issues
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    console.log('Update successful');
    console.log('--- Profile Update End ---');

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

// DELETE remains same but improved cleanup
export async function DELETE(request) {
  try {
    const userAuth = await getAuthenticatedUser();
    if (!userAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { password } = await request.json();
    const user = await User.findById(userAuth._id).select('+password');

    if (user.password) {
      if (!password) return NextResponse.json({ error: 'Password required' }, { status: 400 });
      const isMatch = await user.comparePassword(password);
      if (!isMatch) return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }

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