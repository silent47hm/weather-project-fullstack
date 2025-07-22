import { useState, useEffect } from "react";

const getGreeting = () => {
  const hours = new Date().getHours();
  if (hours < 12) return "Good Morning";
  if (hours < 18) return "Good Afternoon";
  return "Good Evening";
};

const PublicWeather = ({
  data,
  location,
  historicalData = [],
  forecastData = [],
  hourlyForecast = [],
}) => {
  const [currentTime, setCurrentTime] = useState(
    new Date()
      .toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .replace(/am|pm/i, (match) => match.toUpperCase())
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(
        new Date()
          .toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
          .replace(/am|pm/i, (match) => match.toUpperCase())
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!data) return null;

  return (
    <div className="w-screen h-screen bg-white p-6 sm:p-0 flex flex-col justify-center">
      <div className="flex flex-col xl:flex-row gap-10 h-full">
        {/* Left Column */}
        <div className="flex-1 bg-white rounded-3xl sm:p-8 xl: h-full flex flex-col justify-between">
          {/* Location and Date */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
              <h2 className="text-2xl sm:text-4xl font-semibold text-gray-800 md:lg:text-[30px]">
                {location}
              </h2>
              <p className="text-gray-600 font-semibold text-xl sm:text-2xl md:lg:pr-[490px]">
                {new Date().toLocaleDateString()}
              </p>
            </div>
            {/* Current Weather */}
            <div className="rounded-xl text-center p-6 sm:p-8 mb-10 bg-white md:lg:flex justify-center">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="text-center sm:text-left">
                  <p className="font-[300px] md:lg:text-[295px]  sm:text-8xl  text-gray-900">
                    {Math.round(data.temp)}°
                  </p>
                  <p className="text-2xl sm:text-3xl text-gray-600 capitalize mt-2 md:lg: pl-24">
                    {data.weather[0].description}
                  </p>
                </div>
                <div className="flex flex-col gap-4 text-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-700 md:lg:text-[30px]">🌬️</span>
                    <span className="font-semibold md:lg:text-[30px]">
                      {data.wind_speed} km/h
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-700 md:lg:text-[30px]">💧</span>
                    <span className="font-semibold md:lg:text-[30px]">
                      {data.humidity}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Timeline Forecast */}
            <div>
              {/* 
              Weather Timeline
             */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 lg:border-black">
                {[
                  ...historicalData.slice(0, 3),
                  ...forecastData.slice(0, 3),
                ].map((day, index) => (
                  <ForecastCard
                    key={index}
                    day={day}
                    type={index < 3 ? "" : ""}
                  />
                ))}
              </div>
            </div>
          
        </div>

        {/* Right Column */}
        <div className="bg-gray-100 rounded-3xl p-0 sm:p-8 xl:w-1/4 h-full flex flex-col justify-between">
          <div className="text-center mb-8">
            <p className="text-2xl font-bold">{getGreeting()}</p>
            <p className="text-xl text-gray-600 mt-1">{currentTime}</p>
          </div>

          <div className="flex text-center mb-8 md:lg:justify-center">
  <div>
    <p className="text-9xl font-[300] text-gray-900 md:lg:text-[100px]">
      {Math.round(data.temp)}°
    </p>
    <p className="text-xl text-gray-600 capitalize mt-2 md:lg:text-[20px]">
      {data.weather[0].description}
    </p>
  </div>

  <div className="mt-4 space-y-2 text-lg md:lg:pt-[9px]">
    <p className="mb-0">
      <span className="text-gray-700">🌬️</span>
      <span className="font-semibold md:lg:text-[15px]">{data.wind_speed} km/h</span>
    </p>
    <p>
      <span className="text-gray-700">💧</span>
      <span className="font-semibold md:lg:text-[15px]">{data.humidity}%</span>
    </p>
  </div>
</div>


          <div>
            {/* <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              Hourly Forecast
            </h3> */}
            {hourlyForecast.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {hourlyForecast.slice(0, 6).map((hour, index) => (
                  <HourCard key={`hour-${index}`} hour={hour} />
                ))}
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

// Forecast Card
const ForecastCard = ({ day, type }) => {
  const date = day.date ? new Date(day.date) : new Date();
  const isToday = new Date().toDateString() === date.toDateString();
  const dayName = isToday
    ? "Today"
    : date.toLocaleDateString("en-US", { weekday: "short" });

  return (
    <div
  className={`bg-white rounded-xl p-4 text-center h-40 md:lg:w-36 ${
    isToday ? "border-1 border-black" : "border-l-4"
  }`}
>
  <p className="text-lg text-gray-800 md:lg:text-[20px] font-semibold">{dayName}</p>
  <p className="text-2xl font-bold md:lg:text-[36px] pt-3">{Math.round(day.temp)}°</p>
  <p className="text-sm text-gray-500 capitalize md:lg:pt-2.5">
    {day.weather[0].description}
  </p>
</div>
  );
};

// Hourly Card
const HourCard = ({ hour }) => {
  const formattedTime = (() => {
    const [hourStr] = hour.time.split(":");
    const hourInt = parseInt(hourStr, 10);
    const suffix = hourInt >= 12 ? "PM" : "AM";
    const hour12 = hourInt % 12 === 0 ? 12 : hourInt % 12;
    return `${hour12} ${suffix}`;
  })();

  return (
    <div className="bg-white rounded-xl p-4 text-center hover:shadow-lg transition-shadow md:lg:w-28 h-[180px]">
      <p className="text-md font-semibold text-gray-800 md:lg:text-[15px]">{formattedTime}</p>
      <p className="text-lg font-bold md:lg:text-[34px] pt-3.5">{Math.round(hour.temp)}°</p>
      <p className="text-sm text-gray-500 capitalize md:lg:pt-2">
        {hour.weather[0].description}
      </p>
    </div>
  );
};

export default PublicWeather;
