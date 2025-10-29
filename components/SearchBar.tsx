import React, { useState, useCallback, useEffect, useRef } from 'react';
import { COMMON_MOLECULES } from '../constants';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLFormElement>(null);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length > 1) {
      const filteredSuggestions = COMMON_MOLECULES.filter(molecule =>
        molecule.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8);
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, []);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setQuery(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
    onSearch(suggestion);
  }, [onSearch]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, onSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto relative mb-12 animate-fadeInUp" ref={searchContainerRef}>
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-200"></div>
        <div className="relative flex items-center bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="pl-6 pr-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => query.length > 1 && suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="Search for a molecule..."
            className="flex-1 px-2 py-5 text-lg text-gray-800 bg-transparent focus:outline-none placeholder-gray-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="m-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
            disabled={isLoading || !query.trim()}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Searching...</span>
              </div>
            ) : (
              'Search'
            )}
          </button>
        </div>
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-72 overflow-y-auto animate-fadeInUp">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="px-6 py-3 cursor-pointer text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0 flex items-center gap-3"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>{suggestion}</span>
            </div>
          ))}
        </div>
      )}
    </form>
  );
};

export default SearchBar;