// components/GameList/index.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Game, mockGames } from '../../mocks/games';
import GameCard from '../GameCard';

type SortOption = 'title' | 'progress' | 'hours' | 'rating';
type FilterOption = 'all' | 'completed' | 'playing' | 'backlog' | 'abandoned';

export default function GameList() {
  const [sortBy, setSortBy] = useState<SortOption>('title');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const sortedAndFilteredGames = mockGames
    .filter(game => {
      const matchesFilter = filterBy === 'all' || game.status === filterBy;
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'progress':
          return b.progress - a.progress;
        case 'hours':
          return b.hoursPlayed - a.hoursPlayed;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

  return (

    

    <div className="flex flex-col gap-6">



      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        {/* Search */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search games..."
            className="w-full bg-[#1E2A45] border border-[#3A4B72]/50 focus:border-purple-400 rounded-lg py-2 px-4 text-white outline-none transition-all duration-300 pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Sort/Filter */}
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <select
              className="appearance-none bg-[#1E2A45] border border-[#3A4B72]/50 text-gray-300 rounded-lg py-2 px-4 pr-8 outline-none focus:border-purple-400 transition-all duration-300 w-full"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
            >
              <option value="title">Sort by: Title</option>
              <option value="progress">Sort by: Progress</option>
              <option value="hours">Sort by: Hours Played</option>
              <option value="rating">Sort by: Rating</option>
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          <div className="relative flex-1 md:flex-none">
            <select
              className="appearance-none bg-[#1E2A45] border border-[#3A4B72]/50 text-gray-300 rounded-lg py-2 px-4 pr-8 outline-none focus:border-purple-400 transition-all duration-300 w-full"
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as FilterOption)}
            >
              <option value="all">All Games</option>
              <option value="completed">Completed</option>
              <option value="playing">Playing</option>
              <option value="backlog">Backlog</option>
              <option value="abandoned">Abandoned</option>
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Game Count */}
      <div className="text-sm text-gray-400">
        Showing {sortedAndFilteredGames.length} of {mockGames.length} games
      </div>

      {/* Games Grid */}
      {sortedAndFilteredGames.length > 0 ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {sortedAndFilteredGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </motion.div>
      ) : (
        <div className="bg-[#1E2A45]/30 border border-[#3A4B72]/20 rounded-xl p-8 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-purple-500/10 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No games found</h3>
          <p className="text-gray-400">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}