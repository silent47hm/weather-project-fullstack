import { useState } from 'react';
import { getWeatherData, getWeatherForCurrentLocation } from '../services/weatherService';

/**
 * Custom hook to manage weather data fetching and state
 * @param {string} token - JWT token for authentication
 * @returns {Object} - Contains weather data, loading state, error, and fetch functions
 */
const useWeather = (token) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async (location) => {
    if (!location || !token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await getWeatherData(location, token);
      setWeatherData(data);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching weather data');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentLocationWeather = async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await getWeatherForCurrentLocation(token);
      setWeatherData(data);
    } catch (err) {
      setError(err.message || 'Could not get weather for your current location');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  return { 
    weatherData, 
    loading, 
    error, 
    fetchWeather,
    fetchCurrentLocationWeather 
  };
};

export default useWeather;