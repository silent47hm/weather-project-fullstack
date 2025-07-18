import { FiDroplet, FiWind, FiEye, FiSunrise, FiSunset } from 'react-icons/fi';

const WeatherDetails = ({ data }) => {
  if (!data) return null;

  // Helper function to format time from UNIX timestamp
  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Weather Details</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Humidity */}
          <div className="flex items-center">
            <FiDroplet className="text-blue-500 mr-2" size={20} />
            <div>
              <p className="text-gray-500 text-sm">Humidity</p>
              <p className="font-medium">{data.humidity}%</p>
            </div>
          </div>
          
          {/* Wind Speed */}
          <div className="flex items-center">
            <FiWind className="text-blue-500 mr-2" size={20} />
            <div>
              <p className="text-gray-500 text-sm">Wind</p>
              <p className="font-medium">{data.wind_speed} km/h</p>
            </div>
          </div>
          
          {/* Visibility */}
          <div className="flex items-center">
            <FiEye className="text-blue-500 mr-2" size={20} />
            <div>
              <p className="text-gray-500 text-sm">Visibility</p>
              <p className="font-medium">{data.visibility / 1000} km</p>
            </div>
          </div>
          
          {/* Sunrise */}
          <div className="flex items-center">
            <FiSunrise className="text-yellow-500 mr-2" size={20} />
            <div>
              <p className="text-gray-500 text-sm">Sunrise</p>
              <p className="font-medium">{formatTime(data.sunrise)}</p>
            </div>
          </div>
          
          {/* Sunset */}
          <div className="flex items-center">
            <FiSunset className="text-yellow-500 mr-2" size={20} />
            <div>
              <p className="text-gray-500 text-sm">Sunset</p>
              <p className="font-medium">{formatTime(data.sunset)}</p>
            </div>
          </div>
          
          {/* Pressure */}
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-500 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
              />
            </svg>
            <div>
              <p className="text-gray-500 text-sm">Pressure</p>
              <p className="font-medium">{data.pressure} hPa</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDetails;
