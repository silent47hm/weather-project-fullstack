import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

// Import route files
import authRoutes from "./routes/auth.routes.js" // Authentication routes
import weatherRoutes from "./routes/weather.routes.js"; // Weather-related routes

dotenv.config();

const app = express();

// Enable CORS for your frontend application (adjust the URL accordingly)
app.use(cors({
  origin: 'http://localhost:5173', // Change to your frontend's URL if different
  credentials: true,  // Allow cookies and credentials
}));

// Middleware to parse cookies and JSON bodies
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);  // Auth-related routes (login, register)
app.use("/api/weather", weatherRoutes);  // Weather-related routes (requires authentication)

// Check if required environment variables are present
if (!process.env.MONGO_URI || !process.env.PORT) {
  console.error("❌ MONGO_URI or PORT not defined in .env");
  process.exit(1);
}

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");

    // Start the server once DB connection is successful
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Exit if DB connection fails
  });
