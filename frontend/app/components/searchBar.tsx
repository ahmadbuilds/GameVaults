// components/SearchBar.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { searchGames } from '../services/searchService';

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  const router = useRouter();
  const [isSearching, setIsSearching] = useState(false);
  
 
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.length > 0) {
      setIsSearching(true);
      
      const timeoutId = setTimeout(async () => {
        try {
          const results = await searchGames(term);
          setSearchResults(results);
          setIsSearching(false);
        } catch (error) {
          console.error("Search error:", error);
          setIsSearching(false);
        }
      }, 300);
      
      setShowResults(true);
      return () => clearTimeout(timeoutId);
    } else {
      setShowResults(false);
      setSearchResults([]);
    }
  };
  
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest('.search-container')) {
        setShowResults(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="search-container relative w-full max-w-lg">
      <div className="relative">
        <input 
          type="text" 
          placeholder="Search games..." 
          className="w-full bg-[#303030] rounded-full py-2 px-4 pl-10 text-white"
          value={searchTerm}
          onChange={handleSearch}
          onClick={() => searchTerm && setShowResults(true)}
        />
        <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
        </svg>
      </div>
      
      {/* Search results dropdown */}
      {showResults && (
        <div className="absolute w-full mt-2 bg-[#202020] rounded-lg shadow-lg z-10 max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="px-4 py-3 text-gray-400 flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            </div>
          ) : searchResults.length > 0 ? (
            <div className="py-2">
              {searchResults.map((game) => (
                <div 
                  key={game.id}
                  className="px-4 py-2 hover:bg-[#303030] cursor-pointer flex items-center gap-3"
                  onClick={() => {
                   
                    const path = game.status ? 
                      `/Dashboard/library/${game.id}` : 
                      `/Dashboard/backlog/${game.id}`;  
                    
                    
                    console.log(`Navigating to: ${path}`);
                    
                    setShowResults(false);
                    setSearchTerm('');
                  }}
                >
                  {/* Game platform badge */}
                  <span className="px-2 py-1 text-xs rounded bg-[#3B3B3B] text-gray-300">
                    {game.platform}
                  </span>
                  
                  {/* Game title */}
                  <div className="flex-1">
                    <span className="block truncate">{game.title}</span>
                    
                    {/* Show status or priority based on what's available */}
                    <span className="text-xs text-gray-400">
                      {game.status ? `Status: ${game.status}` : 
                       game.priority ? `Priority: ${game.priority}` : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : searchTerm ? (
            <div className="px-4 py-3 text-gray-400">
              No games found matching {searchTerm}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;