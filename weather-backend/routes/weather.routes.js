import express from 'express';
import { getWeather, publicWeather } from '../controllers/weather.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';


const router = express.Router();

// Weather route - protected by authenticate middleware
router.get('/', authenticate, getWeather);

//Public route
router.get('/public',publicWeather)

export default router;
