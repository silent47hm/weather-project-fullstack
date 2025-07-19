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
      fetchWeather('New York');
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
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800">{greeting}</h1>
          {user && (
            <button
              onClick={handleLogout}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Logout
            </button>
          )}
        </div>

        {logoutMessage && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
            <p>{logoutMessage}</p>
          </div>
        )}

        {!user ? (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
            <p>Please login to search for weather</p>
          </div>
        ) : (
          <>
            <SearchBar 
              onSearch={(location) => {
                fetchWeather(location);
                setDefaultLoaded(true);
              }}
              onUseCurrentLocation={fetchCurrentLocationWeather}
              disabled={!user || loading}
            />

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
              <>
                <CurrentWeather 
                  data={weatherData.currentWeather || {}}
                  location={weatherData.location || "Unknown Location"}
                  historicalData={weatherData.historicalData || []}
                  forecastData={weatherData.forecastData || []}
                  hourlyForecast={weatherData.hourlyForecast || []}
                />
                <WeatherDetails data={weatherData.currentWeather || {}} />
                <Forecast data={weatherData.forecastData || []} />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;