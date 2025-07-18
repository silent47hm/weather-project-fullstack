import React from 'react';

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