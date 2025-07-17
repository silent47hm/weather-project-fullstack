import express from 'express';
import { getWeather } from '../controllers/weather.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Weather route - protected by authenticate middleware
router.get('/', authenticate, getWeather);

export default router;
