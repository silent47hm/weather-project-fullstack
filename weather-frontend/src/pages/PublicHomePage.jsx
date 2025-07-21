import { useState, useEffect } from "react";
import publicUseWeather from "../hooks/publicUseWeather";
import PublicWeather from "../components/PublicWeather";

const PublicHomePage = () => {
  const { weatherData, loading, error, fetchWeather } = publicUseWeather();

  const [defaultLoaded, setDefaultLoaded] = useState(false);

  useEffect(() => {
    if (!defaultLoaded) {
      fetchWeather("Gulbarga");
      setDefaultLoaded(true);
    }
  }, [defaultLoaded, fetchWeather]);

  return (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    {loading && (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )}

    {error && (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
        <p className="text-red-700">{error}</p>
      </div>
    )}

    {weatherData && (
      <PublicWeather
        data={weatherData.currentWeather || {}}
        location={weatherData.location || "Unknown Location"}
        historicalData={weatherData.historicalData || []}
        forecastData={weatherData.forecastData || []}
        hourlyForecast={weatherData.hourlyForecast || []}
      />
    )}
  </div>
);

};

export default PublicHomePage;