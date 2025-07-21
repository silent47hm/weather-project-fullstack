export const getPublicWeatherData = async (location) => {
  try {
    const params = new URLSearchParams();
    
    // Handle different location formats
    if (location.includes(',')) {
      const [lat, lon] = location.split(',');
      params.append('lat', lat.trim());
      params.append('lon', lon.trim());
    } else if (!isNaN(location)) {
      params.append('zip', location);
    } else {
      params.append('city', location);
    }

    const response = await fetch(
      `http://localhost:5000/api/weather/public?${params.toString()}`, //Public "/public missed in url"
      {
        headers: {
    
          'Content-Type': 'application/json'
        }
     
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch weather data');
    }



    return await response.json();
  } catch (error) {
    console.error('WeatherService Error:', error);
    throw error;
  }
};

