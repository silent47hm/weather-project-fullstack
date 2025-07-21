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
  hourlyForecast = [],
}) => {
  const [currentTime, setCurrentTime] = useState(
  new Date()
    .toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })
    .replace(/am|pm/i, match => match.toUpperCase())
);

  useEffect(() => {
  const timer = setInterval(() => {
    setCurrentTime(
      new Date()
        .toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })
        .replace(/am|pm/i, match => match.toUpperCase())
    );
  }, 1000);

  return () => clearInterval(timer);
}, []);

  if (!data) return null;

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 w-full mx-auto">
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Left Column - Current Weather + Forecasts */}
        <div className="flex-1">
          {/* Location and Date */}
          <div className="flex flex-col sm:flex-row justify-evenly items-start sm:items-center mb-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
              {location}
            </h2>
            <p className="text-gray-600 font-medium text-sm sm:text-base">
              {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Current Weather */}
          <div className="rounded-xl p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-center justify-between md:lg:justify-center gap-4">
              <div className="text-center sm:text-left">
                <p className="text-5xl sm:text-7xl md:text-9xl font-bold text-gray-800">
                  {Math.round(data.temp)}°C
                </p>
                <p className="text-lg sm:text-xl text-gray-600 capitalize mt-2">
                  {data.weather[0].description}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Humidity:</span>
                  <span className="font-medium">{data.humidity}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Wind:</span>
                  <span className="font-medium">{data.wind_speed} km/h</span>
                </div>
              </div>
            </div>
          </div>

          {/* Weather Timeline */}
          <div className="mb-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-4">
              Weather Timeline
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {[...historicalData.slice(0, 3), ...forecastData.slice(0, 3)].map(
                (day, index) => (
                  <ForecastCard
                    key={index}
                    day={day}
                    type={index < 3 ? "past" : "future"}
                  />
                )
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Hourly Forecast */}
        <div className="bg-gray-100 rounded-2xl w-full xl:w-1/3">
          <div className="pr-3 pl-3 pt-3 sm:p-6">
            <div className="flex flex-col sm:flex-row xl:flex-col items-center justify-between gap-4 mb-6">
              <div className="text-center mb:lg: pb-1">
                <p className="text-lg font-semibold">{getGreeting()}</p>
                <p className="text-gray-600">{currentTime}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-4xl sm:text-5xl font-bold text-gray-800">
                  {Math.round(data.temp)}°C
                </p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Humidity:</span>
                    <span className="font-medium">{data.humidity}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Wind:</span>
                    <span className="font-medium">{data.wind_speed} km/h</span>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="text-lg sm:text-xl font-semibold mb-4">
              Hourly Forecast
            </h3>
            {hourlyForecast.length > 0 ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {hourlyForecast.slice(0, 6).map((hour, index) => (
                    <HourCard key={`hour-${index}`} hour={hour} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <p className="text-yellow-700">Hourly data not available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Forecast Card Component (updated for responsiveness)
const ForecastCard = ({ day, type }) => {
  const date = day.date ? new Date(day.date) : new Date();
  const isToday = new Date().toDateString() === date.toDateString();
  const dayName = isToday
    ? "Today"
    : date.toLocaleDateString("en-US", { weekday: "short" });

  return (
    <div
      className={`bg-white rounded-lg shadow-sm p-3 text-center border-l-4 ${
        type === "past" ? "border-gray-300" : "border-blue-300"
      }`}
    >
      <p className="font-medium text-gray-800 text-sm sm:text-base">
        {dayName}
      </p>

      <p className="text-md sm:text-lg font-bold">{Math.round(day.temp)}°C</p>
      <p className="text-xs sm:text-sm text-gray-500 capitalize">
        {day.weather[0].description}
      </p>
      <span className="text-xs text-gray-400 mt-1 block">
        {type === "past" ? "Past" : "Forecast"}
      </span>
    </div>
  );
};

// Hourly Card Component (updated for responsiveness)
const HourCard = ({ hour }) => {
  const formattedTime = (() => {
    const [hourStr, minuteStr] = hour.time.split(":");
    const hourInt = parseInt(hourStr, 10);
    const suffix = hourInt >= 12 ? "PM" : "AM";
    const hour12 = hourInt % 12 === 0 ? 12 : hourInt % 12;
    return `${hour12} ${suffix}`;
  })();

  return (
    <div className="bg-white rounded-lg shadow-sm p-2 sm:p-3 text-center hover:shadow-md transition-shadow">
      <p className="text-xs sm:text-sm font-medium text-gray-800">
        {formattedTime}
      </p>

      <p className="text-sm sm:text-md font-bold">{Math.round(hour.temp)}°C</p>
      <div className="flex justify-center gap-1 sm:gap-2 mt-1 text-xs text-gray-500">
        <span>{hour.humidity}%</span>
        <span>•</span>
        <span>{hour.wind_speed} km/h</span>
      </div>
    </div>
  );
};

export default CurrentWeather;
