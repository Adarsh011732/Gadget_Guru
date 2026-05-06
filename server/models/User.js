import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { 
    type: String, required: true, unique: true, 
    lowercase: true, trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: { type: String, required: true, minlength: 6 },
  avatar: { type: String, default: '' },
  resetToken: { type: String, default: null },
  resetTokenExpiry: { type: Date, default: null },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate reset token (6-digit OTP)
userSchema.methods.generateResetToken = function() {
  const otp = crypto.randomInt(100000, 999999).toString();
  this.resetToken = crypto.createHash('sha256').update(otp).digest('hex');
  this.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes
  return otp;
};

const User = mongoose.model('User', userSchema);
export default User;
