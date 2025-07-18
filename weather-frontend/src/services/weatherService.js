export const getWeatherData = async (location, token = null) => {
  try {
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(
      `http://localhost:5000/api/weather?city=${encodeURIComponent(location)}`,
      {
        headers,
        credentials: 'include'
      }
    );

    const contentType = response.headers.get('content-type');

    if (!response.ok) {
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Weather request failed');
      } else {
        const errorText = await response.text();
        console.error('Unexpected response (non-JSON):', errorText);
        throw new Error('Unexpected server response. Please check the API.');
      }
    }

    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return {
        current: {
          temp: data.temperature,
          humidity: data.humidity,
          wind_speed: data.windSpeed,
          weather: [{ description: data.description }],
        },
        location: data.location || location
      };
    } else {
      const errorText = await response.text();
      throw new Error('Invalid response format from server');
    }
  } catch (error) {
    console.error('Weather fetch error:', error);
    throw error;
  }
};


/**
 * Fetches weather data for current location using geolocation
 * - Authentication token (JWT)
 *  - Weather data object
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
            `http://localhost:5000/api/weather?lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              credentials: 'include'
            }
          );

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to fetch weather data');
          }

          const data = await response.json();

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
            location: data.location || 'Your Location',
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