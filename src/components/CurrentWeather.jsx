import WeatherIcon from './WeatherIcon';

/**
 * Displays the current weather conditions
 * @param {Object} props - Component props
 * @param {Object} props.data - Current weather data
 * @param {string} props.location - Location name
 */
const CurrentWeather = ({ data, location }) => {
  if (!data) return null;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Location and Date */}
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold text-gray-800">{location}</h2>
            <p className="text-gray-600">
              {new Date(data.dt * 1000).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <p className="text-gray-500 text-sm mt-1">
              {data.weather[0].description}
            </p>
          </div>
          
          {/* Temperature and Icon */}
          <div className="flex items-center">
            <WeatherIcon code={data.weather[0].icon} size="large" />
            <div className="ml-4">
              <span className="text-5xl font-bold text-gray-800">
                {Math.round(data.temp)}°
              </span>
              <span className="text-gray-500 ml-1">C</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;