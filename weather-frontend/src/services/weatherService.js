export const getWeatherData = async (location, token) => {
  console.log('[weatherService] Starting fetch for:', location);
  console.log('[weatherService] Using token:', token ? 'yes' : 'no');

  if (!location || typeof location !== 'string') {
    console.error('[weatherService] Invalid location provided');
    throw new Error('Invalid location provided');
  }

  try {
    const url = `http://localhost:5000/api/weather?city=${encodeURIComponent(location)}`;
    console.log('[weatherService] Fetching from:', url);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    console.log('[weatherService] Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[weatherService] API error:', errorText);
      throw new Error(errorText || `Request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log('[weatherService] Received data:', data);
    
    return {
      current: {
        dt: Math.floor(Date.now() / 1000),
        temp: data.temperature,
        humidity: data.humidity,
        wind_speed: data.windSpeed,
        weather: [{
          description: data.description,
        }],
      },
      location: data.location || location,
    };
  } catch (error) {
    console.error('[weatherService] Fetch failed:', error);
    throw error;
  }
};

/**
 * Fetches weather data for current location using geolocation
 * @param {string} token - Authentication token (JWT)
 * @returns {Object} - Weather data object
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