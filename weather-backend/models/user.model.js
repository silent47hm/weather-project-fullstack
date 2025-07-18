import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: [true, "Username is required"],
    trim: true,
    minlength: [3, "Username must be at least 3 characters"],
    maxlength: [30, "Username cannot exceed 30 characters"]
  },
  email: { 
    type: String, 
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: "Invalid email format"
    }
  },
  password: { 
    type: String, 
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters"],
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.__v;
      return ret;
    }
  }
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12); // Increased salt rounds for better security
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    console.error('Password hashing error:', err);
    next(new Error('Failed to hash password'));
  }
});

// Password comparison method
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!candidatePassword) {
    throw new Error('Password is required');
  }
  
  if (!this.password) {
    throw new Error('User password not found');
  }

  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error('Password comparison failed:', error);
    throw new Error('Authentication failed');
  }
};

// Static method for finding by credentials
userSchema.statics.findByCredentials = async function(email, password) {
  const user = await this.findOne({ email }).select('+password');
  
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  return user;
};

export default mongoose.model("User", userSchema);