import WeatherIcon from './WeatherIcon';

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
              <div className="bg-white p-4 rounded-lg shadow mt-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-3xl font-bold">{Math.round(data.temp)}°C</p>
          <p className="text-gray-600 capitalize">
            {data.weather[0].description}
          </p>
        </div>
        <div className="text-right">
          <p>Humidity: {data.humidity}%</p>
          <p>Wind: {data.wind_speed} km/h</p>
        </div>
      </div>
    </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;