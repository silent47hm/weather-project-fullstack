/**
 * Service for fetching weather data from the backend API
 * @module services/weatherService
 */

/**
 * Fetches current weather for a specific location
 * @param {string} location - The location to get weather for
 * @param {string} token - JWT token for authentication
 * @returns {Promise<Object>} - Weather data object
 * @throws {Error} - If the request fails or returns invalid data
 */
export const getWeatherData = async (location, token) => {
  if (!location || typeof location !== 'string') {
    throw new Error('Invalid location provided');
  }

  try {
    const response = await fetch(`/api/weather?city=${encodeURIComponent(location)}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Weather API request failed with status ${response.status}`
      );
    }

    const data = await response.json();
    
    // Transform backend response to match frontend expectations
    return {
      current: {
        dt: Math.floor(Date.now() / 1000), // Current timestamp
        temp: data.temperature,
        feels_like: data.temperature, // Your API doesn't provide feels_like
        humidity: data.humidity,
        wind_speed: data.windSpeed,
        weather: [{
          id: 800, // Default clear sky ID
          main: 'Clear',
          description: data.description,
          icon: '01d' // Default icon
        }],
        sunrise: 0, // Your API doesn't provide these
        sunset: 0,
        pressure: 0,
        visibility: 10000 // Default visibility
      },
      forecast: [] // Your API doesn't provide forecast
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

/**
 * Fetches weather data for user's current location using geolocation
 * @param {string} token - JWT token for authentication
 * @returns {Promise<Object>} - Weather data object
 * @throws {Error} - If geolocation is not supported or permission denied
 */
export const getWeatherForCurrentLocation = async (token) => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `/api/weather?lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
          
          const data = await response.json();
          
          // Transform backend response
          resolve({
            current: {
              dt: Math.floor(Date.now() / 1000),
              temp: data.temperature,
              feels_like: data.temperature,
              humidity: data.humidity,
              wind_speed: data.windSpeed,
              weather: [{
                id: 800,
                main: 'Clear',
                description: data.description,
                icon: '01d'
              }],
              sunrise: 0,
              sunset: 0,
              pressure: 0,
              visibility: 10000
            },
            forecast: []
          });
        } catch (error) {
          reject(error);
        }
      },
      (error) => {
        reject(new Error(`Geolocation error: ${error.message}`));
      }
    );
  });
};