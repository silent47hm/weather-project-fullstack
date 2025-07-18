import { useState } from 'react';

const SearchBar = ({ onSearch, disabled }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex shadow-md rounded-lg overflow-hidden">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={disabled ? "Please login to search" : "Enter city name"}
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
      </div>
    </form>
  );
};

export default SearchBar;