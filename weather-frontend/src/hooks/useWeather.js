// hooks/useWeather.js
import { useState } from 'react';
import { getWeatherData } from '../services/weatherService';
import { useAuth } from '../context/AuthContext';

const useWeather = () => {
  const { user } = useAuth();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async (location) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (!token) {
      setError('Please login to search weather');
      return;
    }

    if (!location) {
      setError('Please enter a location');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getWeatherData(location, token);
      setWeatherData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  return { weatherData, loading, error, fetchWeather };
};

export default useWeather;
