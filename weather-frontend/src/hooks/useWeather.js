import { useState, useCallback } from 'react';
import { getWeatherData, getWeatherForCurrentLocation } from '../services/weatherService';
import { useAuth } from '../context/AuthContext';

const useWeather = () => {
  const { user } = useAuth();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getWeatherIcon = (description) => {
    if (!description) return '01d';
    const desc = description.toLowerCase();
    if (desc.includes('clear')) return '01d';
    if (desc.includes('cloud')) return '03d';
    if (desc.includes('rain')) return '10d';
    if (desc.includes('snow')) return '13d';
    if (desc.includes('thunder')) return '11d';
    return '01d';
  };

  const formatWeatherData = useCallback((apiData) => {
    if (!apiData) return null;

    // Generate past 3 days data
    const currentDate = new Date();
    const historicalData = [...Array(3)].map((_, i) => {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - (i + 1));
      return {
        date: date.toISOString(),
        temp: Math.floor(Math.random() * 10) + 15, // Sample temp
        weather: [{ description: "Sunny", icon: "01d" }],
        humidity: 60,
        wind_speed: 10
      };
    });

    return {
      location: apiData.location || 'Unknown Location',
      currentWeather: {
        temp: apiData.currentWeather?.temperature || 0,
        weather: [{
          description: apiData.currentWeather?.description || 'Unknown',
          icon: getWeatherIcon(apiData.currentWeather?.description)
        }],
        humidity: apiData.currentWeather?.humidity || 0,
        wind_speed: apiData.currentWeather?.windSpeed || 0
      },
      historicalData,
      forecastData: (apiData.dailyForecast || []).slice(0, 3).map(item => ({
        date: item.date,
        temp: item.temperature || 0,
        weather: [{
          description: item.description || 'Unknown',
          icon: getWeatherIcon(item.description)
        }],
        humidity: item.humidity || 0,
        wind_speed: item.windSpeed || 0
      })),
      hourlyForecast: (apiData.hourlyForecast || [])
        .slice(0, 6)
        .map(item => ({
          time: item.time || '--:--',
          temp: item.temperature || 0,
          weather: [{
            description: item.description || 'Unknown',
            icon: getWeatherIcon(item.description)
          }],
          humidity: item.humidity || 0,
          wind_speed: item.windSpeed || 0
        }))
    };
  }, []);

  const fetchWeather = async (location) => {
    if (!user) {
      setError('Please login to search weather');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const data = await getWeatherData(location, token);
      setWeatherData(formatWeatherData(data));
    } catch (err) {
      console.error('Fetch weather error:', err);
      setError(err.message || 'Failed to fetch weather data');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentLocationWeather = async () => {
    if (!user) {
      setError('Please login to use location services');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const data = await getWeatherForCurrentLocation(token);
      setWeatherData(formatWeatherData(data));
    } catch (err) {
      console.error('Fetch location weather error:', err);
      setError(err.message || 'Failed to fetch location weather');
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