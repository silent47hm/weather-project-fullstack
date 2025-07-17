// auth.routes.js
import express from "express";
import { register, login, logout, checkAuth } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes (require authentication)
router.get("/check", authenticate, checkAuth); // Middleware added here
router.post("/logout", authenticate, logout); 

export default router;