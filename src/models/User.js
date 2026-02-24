// src/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 50 },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    phone: { type: String, trim: true, default: '' },
    bio: { type: String, trim: true, default: '' },
    profilePic: { type: String, default: '/default-avatar.png' },

    // Email verification fields (added)
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpiry: { type: Date },

    // ... any other fields you had before ...
  },
  { timestamps: true }
);

// Pre-save hook: hash password only if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Export model (singleton pattern to avoid re-compilation errors)
export default mongoose.models.User || mongoose.model('User', userSchema);