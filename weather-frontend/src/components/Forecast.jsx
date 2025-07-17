import WeatherIcon from './WeatherIcon';

/**
 * Displays weather forecast for upcoming days
 * @param {Object} props - Component props
 * @param {Array} props.data - Array of forecast data
 */
const Forecast = ({ data }) => {
  if (!data || !data.length) return null;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">5-Day Forecast</h3>
        
        <div className="space-y-4">
          {data.map((day, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              {/* Day */}
              <div className="w-24">
                <p className="font-medium text-gray-800">
                  {new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                </p>
              </div>
              
              {/* Weather Icon */}
              <div className="flex-grow flex items-center">
                <WeatherIcon code={day.weather[0].icon} size="small" />
                <p className="ml-2 text-gray-600 text-sm">{day.weather[0].description}</p>
              </div>
              
              {/* Temperature Range */}
              <div className="flex items-center">
                <span className="font-medium text-gray-800 w-10 text-right">
                  {Math.round(day.temp.max)}°
                </span>
                <span className="text-gray-400 mx-1">/</span>
                <span className="text-gray-500 w-10">
                  {Math.round(day.temp.min)}°
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Forecast;