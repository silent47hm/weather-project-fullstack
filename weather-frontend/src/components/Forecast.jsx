import WeatherIcon from './WeatherIcon';

const Forecast = ({ data = [] }) => {
  if (!data.length) return null;

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden p-6 mt-6">
      {/* <h3 className="text-2xl font-semibold text-gray-800 mb-4">7-Day Forecast</h3> */}
      
      {/* <div className="space-y-4">
        {data.map((day, index) => (
          <div key={index} className="flex items-center justify-between py-4 border-b border-gray-200 last:border-0">
            
            <div className="w-24">
              <p className="font-medium text-gray-800">
                {day.dt ? new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }) : "N/A"}
              </p>
            </div>
            
            
            <div className="flex-grow flex items-center">
              <WeatherIcon code={day.weather?.[0]?.icon || "01d"} size="small" />
              <p className="ml-2 text-gray-600 text-sm">
                {day.weather?.[0]?.description || "Unknown"}
              </p>
            </div>
            
            
            <div className="flex items-center">
              <span className="font-medium text-gray-800 w-10 text-right">
                {Math.round(day.temp?.max || 0)}°
              </span>
              <span className="text-gray-400 mx-1">/</span>
              <span className="text-gray-500 w-10">
                {Math.round(day.temp?.min || 0)}°
              </span>
            </div>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default Forecast;