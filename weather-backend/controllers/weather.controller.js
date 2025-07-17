import axios from "axios";

export const getWeather = async (req, res) => {
  try {
    const { city, lat, lon, zip } = req.query;
    const apiKey = process.env.WEATHER_API_KEY; // Make sure this is the OpenWeatherMap API key
    let url;

    if (city) {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    } else if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    } else if (zip) {
      url = `https://api.openweathermap.org/data/2.5/weather?zip=${zip}&units=metric&appid=${apiKey}`;
    } else {
      return res.status(400).json({ error: "City, latitude/longitude, or zip code is required" });
    }

    console.log("Calling Weather API:", url); // Optional debug log

    const response = await axios.get(url); //axios is a powerful tool used for clear get requet and Add header adn error handling is good in ason we simple syntax
    const data = response.data;

    res.status(200).json({ //used for like what we have want to our response we add many things
      location: data.name,
      temperature: data.main.temp,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
    });
  } catch (err) {
    console.error("Weather API Error:", err.message);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
};

