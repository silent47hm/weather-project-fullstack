import { useState } from 'react';
import { getWeatherData, getWeatherForCurrentLocation } from '../services/weatherService';

const useWeather = (token) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async (location) => {
    console.log('[useWeather] fetchWeather called with:', location);
    
    if (!location || !token) {
      console.error('[useWeather] Missing location or token');
      return;
    }

    setLoading(true);
    setError(null);
    setWeatherData(null); // Clear previous data
    
    try {
      console.log('[useWeather] Calling getWeatherData...');
      const data = await getWeatherData(location, token);
      console.log('[useWeather] Received weather data:', data);
      setWeatherData(data);
    } catch (err) {
      console.error('[useWeather] Error fetching weather:', err);
      setError(err.message || 'Failed to fetch weather data');
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
      setError(err.message || 'Failed to get your location weather');
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