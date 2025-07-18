import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateToken = (user) => {
  if (!user?._id || !user?.email) {
    throw new Error('Invalid user data for token generation');
  }

  return jwt.sign(
    { 
      _id: user._id.toString(),
      email: user.email 
    }, 
    process.env.JWT_SECRET, 
    { 
      expiresIn: "7d",
      issuer: "weather-app"
    }
  );
};

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check for existing user
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Create new user
    const user = await User.create({ 
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password
    });

    // Generate token
    const token = generateToken(user);

    // Set secure cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // Changed to lax for better compatibility
      maxAge: 7 * 24 * 60 * 60 * 1000,
      domain: process.env.COOKIE_DOMAIN || undefined
    });

    // Return response
    res.status(201).json({ 
      user: {
        _id: user._id,
        username: user.username,
        email: user.email
      }, 
      token 
    });

  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ 
      error: "Registration failed",
      ...(process.env.NODE_ENV === "development" && { details: err.message })
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user with password
    const user = await User.findOne({ email: email.toLowerCase().trim() })
                          .select('+password');
    
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user);

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      domain: process.env.COOKIE_DOMAIN || undefined
    });

    // Return response
    res.status(200).json({ 
      user: {
        _id: user._id,
        username: user.username,
        email: user.email
      },
      token 
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ 
      error: "Login failed",
      ...(process.env.NODE_ENV === "development" && { details: err.message })
    });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    domain: process.env.COOKIE_DOMAIN || undefined
  });
  res.status(200).json({ message: "Logged out successfully" });
};

export const checkAuth = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // Get fresh user data
    const user = await User.findById(req.user._id)
      .select('-password -__v')
      .lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user });

  } catch (error) {
    console.error("Check auth error:", error);
    res.status(500).json({ 
      error: "Authentication check failed",
      ...(process.env.NODE_ENV === "development" && { details: error.message })
    });
  }
};