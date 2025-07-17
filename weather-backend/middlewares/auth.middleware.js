import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authenticate = async (req, res, next) => {
  try {
    // 1. Get token from cookie or Authorization header
    const token = req.cookies?.token || 
                 req.headers?.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Get fresh user data (without password)
    const user = await User.findById(decoded._id)
      .select('-password -__v')
      .lean();
    
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // 4. Attach user to request
    req.user = user;
    next();
    
  } catch (error) {
    console.error("Authentication error:", error);
    
    // Handle specific JWT errors
    let errorMessage = "Authentication failed";
    if (error.name === 'JsonWebTokenError') {
      errorMessage = "Invalid token";
    } else if (error.name === 'TokenExpiredError') {
      errorMessage = "Token expired";
    }
    
    res.status(401).json({ error: errorMessage });
  }
};