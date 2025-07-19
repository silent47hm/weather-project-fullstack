import { useState } from 'react';

const SearchBar = ({ onSearch, disabled, onUseCurrentLocation }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit} className="flex shadow-md rounded-lg overflow-hidden mb-3">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={disabled ? "Please login to search" : "Enter city name or zip"}
          className={`flex-grow px-4 py-3 focus:outline-none ${
            disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
          }`}
          disabled={disabled}
          required
        />
        <button
          type="submit"
          disabled={disabled}
          className={`bg-blue-600 text-white px-6 py-3 ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
        >
          Search
        </button>
      </form>
      {!disabled && (
        <button
          onClick={onUseCurrentLocation}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Use Current Location
        </button>
      )}
    </div>
  );
};

export default SearchBar;