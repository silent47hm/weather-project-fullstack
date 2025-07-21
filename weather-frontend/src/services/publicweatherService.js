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
      `http://localhost:5000/api/weather?${params.toString()}`,
      {
        headers: {
        //   'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
        // credentials: 'include'
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

// export const getWeatherForCurrentLocation = async (token) => {
//   return new Promise((resolve, reject) => {
//     if (!navigator.geolocation) {
//       reject(new Error('Geolocation not supported'));
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         try {
//           const { latitude, longitude } = position.coords;
//           const data = await getWeatherData(`${latitude},${longitude}`, token);
//           resolve(data);
//         } catch (error) {
//           reject(error);
//         }
//       },
//       (error) => {
//         reject(new Error(`Geolocation error: ${error.message}`));
//       },
//       { timeout: 10000 }
//     );
//   });
// };