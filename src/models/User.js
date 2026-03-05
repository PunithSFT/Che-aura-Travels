import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false }, // select: false hides it in queries
  role: { type: String, default: 'user' },
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  verificationTokenExpiry: Date,
  // ... other fields
}, { timestamps: true });

// IMPORTANT: Hash password before saving (only if modified)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  if (!this.password) {
    console.error('Password field is missing for user:', this.email);
    return false;
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;