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
    console.log('User ID:', authenticatedUser._id);
    
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
      console.log('New image detected:', profilePic.name, 'Size:', profilePic.size);
      
      try {
        const fileExt = profilePic.name ? profilePic.name.split('.').pop() : 'jpg';
        const filename = `profile-${user._id}-${Date.now()}.${fileExt}`;
        
        // Vercel Blob Detection
        const token = process.env.BLOB_READ_WRITE_TOKEN;
        
        if (token) {
          console.log('Using Vercel Blob Storage...');
          
          // Delete old blob if it exists
          if (user.profilePic && user.profilePic.includes('public.blob.vercel-storage.com')) {
            await del(user.profilePic).catch(e => console.warn('Old blob del error:', e.message));
          }

          const blob = await put(filename, profilePic, {
            access: 'public',
            addRandomSuffix: true,
            token: token // Explicitly pass token
          });
          
          if (!blob || !blob.url) throw new Error('Vercel Blob upload failed to return a URL');
          
          updateData.profilePic = blob.url;
          console.log('Successfully uploaded to Blob:', blob.url);
        } else {
          console.log('No Blob token found. Falling back to local storage (Development only)...');
          
          if (process.env.NODE_ENV === 'production') {
            throw new Error('MISSING STORAGE TOKEN: Please add Vercel Blob to your project.');
          }

          const bytes = await profilePic.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const uploadDir = path.join(process.cwd(), 'public/uploads/profiles');
          await mkdir(uploadDir, { recursive: true });
          const filepath = path.join(uploadDir, filename);

          if (user.profilePic && user.profilePic.startsWith('/uploads/')) {
            const oldPath = path.join(process.cwd(), 'public', user.profilePic);
            await unlink(oldPath).catch(() => {});
          }

          await writeFile(filepath, buffer);
          updateData.profilePic = `/uploads/profiles/${filename}`;
        }
      } catch (uploadError) {
        console.error('CRITICAL UPLOAD ERROR:', uploadError.message);
        return NextResponse.json({ error: `Image upload failed: ${uploadError.message}` }, { status: 500 });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    console.log('Profile updated successfully');
    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('General Profile Error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const userAuth = await getAuthenticatedUser();
    if (!userAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { password } = await request.json();
    const user = await User.findById(userAuth._id).select('+password');

    if (user.password && user.password.length > 5) {
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