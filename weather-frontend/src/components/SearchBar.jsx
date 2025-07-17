import { useState } from 'react';

/**
 * SearchBar component for location input
 * @param {Object} props - Component props
 * @param {Function} props.onSearch - Function to call when search is triggered
 */
const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  /**
   * Handles form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex shadow-md rounded-lg overflow-hidden">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter city name or zip code"
          className="flex-grow px-4 py-3 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 transition-colors duration-200"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;