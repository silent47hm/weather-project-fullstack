// pages/HomePage.jsx
import { useAuth } from '../context/AuthContext';
import useWeather from '../hooks/useWeather';
import SearchBar from '../components/SearchBar';
import CurrentWeather from '../components/CurrentWeather';

const HomePage = () => {
  const { user, logout } = useAuth();
  const { weatherData, loading, error, fetchWeather } = useWeather();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-800">Weather Forecast</h1>
          {user && (
            <button
              onClick={logout}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Logout
            </button>
          )}
        </div>

        {!user ? (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
            <p>Please login to search for weather</p>
          </div>
        ) : (
          <>
            <SearchBar onSearch={fetchWeather} />

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

            {weatherData && (
              <CurrentWeather data={weatherData.current} location={weatherData.location} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
