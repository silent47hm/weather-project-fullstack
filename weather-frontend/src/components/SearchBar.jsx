import { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting:', searchTerm); // Debug log
    
    if (searchTerm.trim()) {
      try {
        await onSearch(searchTerm.trim());
        // Don't clear input here - let the parent handle success/failure
      } catch (error) {
        console.error('Search error:', error);
        // Keep the search term so user can try again
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex shadow-md rounded-lg overflow-hidden">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter city name"
          className="flex-grow px-4 py-3 focus:outline-none"
          required
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