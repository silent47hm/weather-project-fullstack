import axios from "axios";

export const getWeather = async (req, res) => {
  try {
    const { city, lat, lon, zip } = req.query;
    const apiKey = process.env.WEATHER_API_KEY; // WeatherAPI.com API Key
    
    if (!apiKey) {
      return res.status(500).json({ error: "Weather API key not configured" });
    }

    let locationParam;
    if (city) {
      locationParam = `q=${city}`;
    } else if (lat && lon) {
      locationParam = `q=${lat},${lon}`;
    } else if (zip) {
      locationParam = `q=${zip}`;
    } else {
      return res.status(400).json({ error: "City, latitude/longitude, or zip code is required" });
    }

    // Current and forecast data (includes 3 days forecast)
    const forecastUrl = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&${locationParam}&days=3&aqi=no&alerts=no`;
    
    console.log("Calling Weather API:", forecastUrl); // Debug log

    const forecastResponse = await axios.get(forecastUrl);
    const forecastData = forecastResponse.data;

    // Check if response is valid
    if (!forecastData || forecastData.error) {
      return res.status(404).json({ error: forecastData?.error?.message || "Weather data not found" });
    }

    // Get historical data for past 3 days (if needed)
    let historicalData = [];
    try {
      const historyUrl = `http://api.weatherapi.com/v1/history.json?key=${apiKey}&${locationParam}&dt=${getPastDate(3)}&end_dt=${getPastDate(1)}`;
      const historyResponse = await axios.get(historyUrl);
      if (historyResponse.data && !historyResponse.data.error) {
        historicalData = processHistoricalData(historyResponse.data);
      }
    } catch (historyError) {
      console.warn("Failed to fetch historical data:", historyError.message);
      // Historical data is optional, so we continue without it
    }

    // Process hourly forecast (next 6 hours)
    const hourlyForecast = forecastData.forecast.forecastday[0].hour
      .filter((hour, index) => index % 2 === 0) // Take every 2nd hour to get 6 points
      .slice(0, 6) // Ensure we only get 6 entries
      .map(hour => ({
        time: hour.time.split(' ')[1], // Extract just the time part
        temperature: hour.temp_c,
        description: hour.condition.text,
        humidity: hour.humidity,
        windSpeed: hour.wind_kph,
      }));

    // Process daily forecast (next 3 days)
    const dailyForecast = forecastData.forecast.forecastday.map(day => ({
      date: day.date,
      temperature: day.day.avgtemp_c,
      description: day.day.condition.text,
      humidity: day.day.avghumidity,
      windSpeed: day.day.maxwind_kph,
    }));

    // Prepare response
    res.status(200).json({
      location: `${forecastData.location.name}, ${forecastData.location.country}`,
      currentWeather: {
        temperature: forecastData.current.temp_c,
        description: forecastData.current.condition.text,
        humidity: forecastData.current.humidity,
        windSpeed: forecastData.current.wind_kph,
      },
      hourlyForecast,
      dailyForecast,
      historicalData, // Include historical data if available
    });
  } catch (err) {
    console.error("Weather API Error:", err.message);
    res.status(500).json({ 
      error: "Failed to fetch weather data",
      details: err.response?.data?.error?.message || err.message 
    });
  }
};

//Public Weather
export const publicWeather = async (req, res) => {
  try {
    const { city, lat, lon, zip } = req.query;
    const apiKey = process.env.WEATHER_API_KEY; // WeatherAPI.com API Key
    
    if (!apiKey) {
      return res.status(500).json({ error: "Weather API key not configured" });
    }

    let locationParam;
    if (city) {
      locationParam = `q=${city}`;
    } else if (lat && lon) {
      locationParam = `q=${lat},${lon}`;
    } else if (zip) {
      locationParam = `q=${zip}`;
    } else {
      return res.status(400).json({ error: "City, latitude/longitude, or zip code is required" });
    }

    // Current and forecast data (includes 3 days forecast)
    const forecastUrl = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&${locationParam}&days=3&aqi=no&alerts=no`;
    
    console.log("Calling Weather API:", forecastUrl); // Debug log

    const forecastResponse = await axios.get(forecastUrl);
    const forecastData = forecastResponse.data;

    // Check if response is valid
    if (!forecastData || forecastData.error) {
      return res.status(404).json({ error: forecastData?.error?.message || "Weather data not found" });
    }

    // Get historical data for past 3 days (if needed)
    let historicalData = [];
    try {
      const historyUrl = `http://api.weatherapi.com/v1/history.json?key=${apiKey}&${locationParam}&dt=${getPastDate(3)}&end_dt=${getPastDate(1)}`;
      const historyResponse = await axios.get(historyUrl);
      if (historyResponse.data && !historyResponse.data.error) {
        historicalData = processHistoricalData(historyResponse.data);
      }
    } catch (historyError) {
      console.warn("Failed to fetch historical data:", historyError.message);
      // Historical data is optional, so we continue without it
    }

    // Process hourly forecast (next 6 hours)
    const hourlyForecast = forecastData.forecast.forecastday[0].hour
      .filter((hour, index) => index % 2 === 0) // Take every 2nd hour to get 6 points
      .slice(0, 6) // Ensure we only get 6 entries
      .map(hour => ({
        time: hour.time.split(' ')[1], // Extract just the time part
        temperature: hour.temp_c,
        description: hour.condition.text,
        humidity: hour.humidity,
        windSpeed: hour.wind_kph,
      }));

    // Process daily forecast (next 3 days)
    const dailyForecast = forecastData.forecast.forecastday.map(day => ({
      date: day.date,
      temperature: day.day.avgtemp_c,
      description: day.day.condition.text,
      humidity: day.day.avghumidity,
      windSpeed: day.day.maxwind_kph,
    }));

    // Prepare response
    res.status(200).json({
      location: `${forecastData.location.name}, ${forecastData.location.country}`,
      currentWeather: {
        temperature: forecastData.current.temp_c,
        description: forecastData.current.condition.text,
        humidity: forecastData.current.humidity,
        windSpeed: forecastData.current.wind_kph,
      },
      hourlyForecast,
      dailyForecast,
      historicalData, // Include historical data if available
    });
  } catch (err) {
    console.error("Weather API Error:", err.message);
    res.status(500).json({ 
      error: "Failed to fetch weather data",
      details: err.response?.data?.error?.message || err.message 
    });
  }
};

// Helper function to get past dates in YYYY-MM-DD format
function getPastDate(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
}

// Helper function to process historical data
function processHistoricalData(data) {
  if (!data.forecast || !data.forecast.forecastday) return [];
  
  return data.forecast.forecastday.map(day => ({
    date: day.date,
    temperature: day.day.avgtemp_c,
    description: day.day.condition.text,
    humidity: day.day.avghumidity,
    windSpeed: day.day.maxwind_kph,
  }));
}