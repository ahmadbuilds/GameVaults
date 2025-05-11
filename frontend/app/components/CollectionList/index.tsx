// components/CollectionList/index.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GameCollection, mockCollections } from '../../mocks/lists';
import CollectionCard from '../CollectionCard';
import Link from 'next/link';

type SortOption = 'name' | 'recent' | 'updated' | 'size';
type FilterOption = 'all' | 'public' | 'private';

export default function CollectionList() {
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const sortedAndFilteredCollections = mockCollections
    .filter(collection => {
      const matchesFilter = filterBy === 'all' || 
        (filterBy === 'public' && collection.isPublic) || 
        (filterBy === 'private' && !collection.isPublic);
      const matchesSearch = collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        collection.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        collection.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'updated':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'size':
          return b.games.length - a.games.length;
        default:
          return 0;
      }
    });

  return (
    <div className="flex flex-col gap-6">
      {/* Header with Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Your Collections</h2>
          <p className="text-sm text-gray-400">Organize your games into custom lists</p>
        </div>
        
       <Link
  href="/Dashboard/list/new"
  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 flex items-center gap-2"
>
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
  </svg>
  New Collection
</Link>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        {/* Search */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search collections..."
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
              <option value="recent">Sort by: Recently Added</option>
              <option value="updated">Sort by: Recently Updated</option>
              <option value="name">Sort by: Name</option>
              <option value="size">Sort by: Collection Size</option>
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
              <option value="all">All Collections</option>
              <option value="public">Public Only</option>
              <option value="private">Private Only</option>
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Collection Count */}
      <div className="text-sm text-gray-400">
        Showing {sortedAndFilteredCollections.length} of {mockCollections.length} collections
      </div>

      {/* Collections Grid */}
      {sortedAndFilteredCollections.length > 0 ? (
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
          {sortedAndFilteredCollections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </motion.div>
      ) : (
        <div className="bg-[#1E2A45]/30 border border-[#3A4B72]/20 rounded-xl p-8 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-purple-500/10 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No collections found</h3>
          <p className="text-gray-400 mb-4">
            Try adjusting your search or filter criteria
          </p>
          <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
            Create New Collection
          </button>
        </div>
      )}
    </div>
  );
}