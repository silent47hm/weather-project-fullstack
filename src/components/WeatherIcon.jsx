import React from 'react';

/**
 * Displays weather icon based on OpenWeatherMap icon code
 * @param {Object} props - Component props
 * @param {string} props.code - OpenWeatherMap icon code
 * @param {'small'|'medium'|'large'} [props.size='medium'] - Size of the icon
 */
const WeatherIcon = ({ code, size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-16 h-16',
    large: 'w-24 h-24',
  };

  const iconUrl = `https://openweathermap.org/img/wn/${code}@2x.png`;

  return (
    <img
      src={iconUrl}
      alt="Weather icon"
      className={`${sizeClasses[size]} object-contain`}
    />
  );
};

export default WeatherIcon;