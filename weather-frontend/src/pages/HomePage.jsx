import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import useWeather from '../hooks/useWeather';
import SearchBar from '../components/SearchBar';
import CurrentWeather from '../components/CurrentWeather';
import Forecast from '../components/Forecast';

// Helper function to get greeting based on time of day
const getGreeting = () => {
  const hours = new Date().getHours();
  if (hours < 12) return 'Good Morning';
  if (hours < 18) return 'Good Afternoon';
  return 'Good Evening';
};

const HomePage = () => {
  const { user, logout } = useAuth();
  const { weatherData, loading, error, fetchWeather } = useWeather();
  const [logoutMessage, setLogoutMessage] = useState('');

  const handleLogout = () => {
    logout();
    setLogoutMessage('Logout Successful');
    setTimeout(() => setLogoutMessage(''), 3000); // Clear message after 3 seconds
  };

  const greeting = getGreeting();

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url("your-image-url.jpg")' }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-white">{greeting}</h1>
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
            <SearchBar onSearch={fetchWeather} disabled={loading} />

            {loading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <p className="mt-2 text-blue-700">Loading weather data...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
            )}

            {weatherData ? (
              <>
                <CurrentWeather data={weatherData.current} location={weatherData.location} />
                <Forecast data={weatherData.daily} />
              </>
            ) : (
              <p>No weather data available</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
