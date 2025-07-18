import WeatherIcon from './WeatherIcon';

const getGreeting = () => {
  const hours = new Date().getHours();
  if (hours < 12) return 'Good Morning';
  if (hours < 18) return 'Good Afternoon';
  return 'Good Evening';
};

const CurrentWeather = ({ data, location }) => {
  if (!data) return null;

  const greeting = getGreeting();
  const currentDate = new Date();

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden p-6">
      <div className="flex flex-col md:flex-row items-center justify-between">
        {/* Left Section: Location, Date and Greeting */}
        <div className="mb-4 md:mb-0">
          <h2 className="text-3xl font-bold text-gray-800">{location}</h2>
          <p className="text-gray-600 text-lg">
            {new Date(data.dt * 1000).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <p className="text-gray-500 text-sm mt-1">{greeting}</p>
        </div>

        {/* Right Section: Temperature and Icon */}
        <div className="text-center md:text-right mt-6 md:mt-0">
          <p className="text-5xl font-bold text-gray-800">{Math.round(data.temp)}°C</p>
          <p className="text-gray-600 text-xl capitalize">{data.weather[0].description}</p>
          <WeatherIcon code={data.weather[0].icon} size="large" />
          <p className="text-gray-500 text-sm mt-2">Feels like {Math.round(data.feels_like)}°C</p>
          <p className="text-lg text-gray-600 mt-2">
            {currentDate.toLocaleDateString()}
          </p>
        </div>
      </div>
      {/* Weather Details: Humidity, Wind Speed */}
      <div className="mt-6 text-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm">Humidity</p>
            <p className="font-medium">{data.humidity}%</p>
          </div>
          <div>
            <p className="text-sm">Wind</p>
            <p className="font-medium">{data.wind_speed} km/h</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
