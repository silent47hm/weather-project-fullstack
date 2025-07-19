import { useState, useEffect } from "react";
import WeatherIcon from "./WeatherIcon";

const getGreeting = () => {
  const hours = new Date().getHours();
  if (hours < 12) return "Good Morning";
  if (hours < 18) return "Good Afternoon";
  return "Good Evening";
};

const CurrentWeather = ({ 
  data, 
  location, 
  historicalData = [], 
  forecastData = [],
  hourlyForecast = [] 
}) => {
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!data) return null;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{location}</h2>
          <p className="text-gray-600">{new Date().toLocaleDateString()}</p>
        </div>
        <div className="mt-2 md:mt-0">
          <p className="text-lg font-semibold">{getGreeting()}</p>
          <p className="text-gray-600">{currentTime}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column - Current Weather + Forecasts */}
        <div className="flex-1">
          {/* Current Weather */}
          <div className="bg-blue-50 rounded-xl p-6 mb-6 flex items-center justify-between">
            <div>
              <p className="text-7xl font-bold text-gray-800">
                {Math.round(data.temp)}°C
              </p>
              <p className="text-xl text-gray-600 capitalize">
                {data.weather[0].description}
              </p>
            </div>
            <WeatherIcon code={data.weather[0].icon} size="large" />
          </div>

          {/* Forecast Cards */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Past & Future Forecast</h3>
            <div className="grid grid-cols-3 gap-4">
              {/* Past 3 Days */}
              {historicalData.map((day, index) => (
                <ForecastCard 
                  key={`past-${index}`}
                  day={day}
                  type="past"
                />
              ))}
              
              {/* Next 3 Days */}
              {forecastData.map((day, index) => (
                <ForecastCard
                  key={`future-${index}`}
                  day={day}
                  type="future"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Hourly Forecast */}
        <div className="lg:w-1/3">
          <h3 className="text-xl font-semibold mb-4">Hourly Forecast</h3>
          {hourlyForecast.length > 0 ? (
            <>
              <div className="grid grid-cols-3 gap-3 mb-3">
                {hourlyForecast.slice(0, 3).map((hour, index) => (
                  <HourCard key={`hour-${index}`} hour={hour} />
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {hourlyForecast.slice(3, 6).map((hour, index) => (
                  <HourCard key={`hour-${index+3}`} hour={hour} />
                ))}
              </div>
            </>
          ) : (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <p className="text-yellow-700">Hourly data not available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Forecast Card Component
const ForecastCard = ({ day, type }) => {
  const date = day.date ? new Date(day.date) : new Date();
  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
  const dateString = date.toLocaleDateString();

  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 text-center border-l-4 ${
      type === 'past' ? 'border-gray-300' : 'border-blue-300'
    }`}>
      <p className="font-medium text-gray-800">{dayName}</p>
      <p className="text-sm text-gray-500 mb-2">{dateString}</p>
      <WeatherIcon code={day.weather[0].icon} size="small" />
      <p className="text-lg font-bold mt-2">{Math.round(day.temp)}°C</p>
      <p className="text-xs text-gray-500 capitalize">
        {day.weather[0].description}
      </p>
      {type === 'past' && (
        <span className="text-xs text-gray-400 mt-1 block">Past</span>
      )}
    </div>
  );
};

// Hourly Card Component
const HourCard = ({ hour }) => (
  <div className="bg-white rounded-lg shadow-sm p-3 text-center hover:shadow-md transition-shadow">
    <p className="text-sm font-medium text-gray-500">{hour.day}</p>
    <p className="font-medium text-gray-800">{hour.time}</p>
    <WeatherIcon code={hour.weather[0].icon} size="small" />
    <p className="text-lg font-bold mt-1">{Math.round(hour.temp)}°C</p>
    <div className="flex justify-center space-x-2 mt-1 text-xs">
      <span className="text-gray-500">{hour.humidity}%</span>
      <span className="text-gray-500">{hour.wind_speed} km/h</span>
    </div>
  </div>
);

export default CurrentWeather;