import axios from "axios";

export const getWeather = async (req, res) => {
  try {
    const { city, lat, lon, zip } = req.query;
    const apiKey = process.env.WEATHER_API_KEY; // OpenWeatherMap API Key
    
    let url;

    // Determine which type of query parameter to use (city, latitude/longitude, or zip)
    if (city) {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    } else if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    } else if (zip) {
      url = `https://api.openweathermap.org/data/2.5/weather?zip=${zip}&units=metric&appid=${apiKey}`;
    } else {
      return res.status(400).json({ error: "City, latitude/longitude, or zip code is required" });
    }

    console.log("Calling Weather API:", url); // Optional debug log to check the API URL

    const response = await axios.get(url);
    const data = response.data;

    // Send weather data as JSON response
    res.status(200).json({
      location: data.name,
      temperature: data.main.temp,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
    });
  } catch (err) {
    console.error("Weather API Error:", err.message); // Log any API errors
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
};
