import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import useWeather from '../hooks/useWeather';
import SearchBar from '../components/SearchBar';
import CurrentWeather from '../components/CurrentWeather';
import WeatherDetails from '../components/WeatherDetails';
import Forecast from '../components/Forecast';

const getGreeting = () => {
  const hours = new Date().getHours();
  if (hours < 12) return "Good Morning";
  if (hours < 18) return "Good Afternoon";
  return "Good Evening";
};

const HomePage = () => {
  const { user, logout } = useAuth();
  const { weatherData, loading, error, fetchWeather, fetchCurrentLocationWeather } = useWeather();
  const [logoutMessage, setLogoutMessage] = useState("");
  const [defaultLoaded, setDefaultLoaded] = useState(false);

  useEffect(() => {
    if (user && !defaultLoaded) {
      fetchWeather('Gulbarga');
      setDefaultLoaded(true);
    }
  }, [user, defaultLoaded, fetchWeather]);

  const handleLogout = () => {
    logout();
    setLogoutMessage("Logout Successful");
    setTimeout(() => setLogoutMessage(""), 3000);
    setDefaultLoaded(false);
  };

  const greeting = getGreeting();

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{greeting}</h1>
          {user && (
            <button
              onClick={handleLogout}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md w-full sm:w-auto"
            >
              Logout
            </button>
          )}
        </div>

        {/* Messages */}
        {logoutMessage && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
            <p>{logoutMessage}</p>
          </div>
        )}

        {!user ? (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded">
            <p>Please login to search for weather</p>
          </div>
        ) : (
          <>
            {/* Search Bar */}
            <div className="mb-6">
              <SearchBar 
                onSearch={(location) => {
                  fetchWeather(location);
                  setDefaultLoaded(true);
                }}
                onUseCurrentLocation={fetchCurrentLocationWeather}
                disabled={!user || loading}
              />
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Weather Data */}
            {weatherData && (
              <div className="space-y-6">
                <CurrentWeather 
                  data={weatherData.currentWeather || {}}
                  location={weatherData.location || "Unknown Location"}
                  historicalData={weatherData.historicalData || []}
                  forecastData={weatherData.forecastData || []}
                  hourlyForecast={weatherData.hourlyForecast || []}
                />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <WeatherDetails data={weatherData.currentWeather || {}} />
                  </div>
                  <div>
                    <Forecast data={weatherData.forecastData || []} />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;