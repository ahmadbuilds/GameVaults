'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CollectionCard from '../CollectionCard';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';


interface Game {
  _id: string;
  title: string;
  platform: string;
  status: string;
  genres: string[];
  rating?: number;
  description?: string;
  imageUrl?: string;
  userEmail: string;
}

interface GameInCollection {
  gameId: Game;
  addedAt: string;
  _id: string;
}

interface Media {
  publicId: string;
  url: string;
  type: 'image' | 'video';
  uploadedAt: string;
  _id: string;
}

interface Like {
  userEmail: string;
  likedAt: string;
  _id: string;
}

interface GameCollection {
  _id: string;
  name: string;
  description?: string;
  userEmail: string;
  games: GameInCollection[];
  media: Media[];
  tags: string[];
  isPublic: boolean;
  views: number;
  likes: Like[];
  createdAt: string;
  updatedAt: string;
}

type SortOption = 'name' | 'recent' | 'updated' | 'size';
type FilterOption = 'all' | 'public' | 'private';

export default function CollectionList() {
  const [collections, setCollections] = useState<GameCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [searchQuery, setSearchQuery] = useState('');

  

  const userEmail = useUser()?.user?.emailAddresses[0]?.emailAddress;

  
  const fetchCollections = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!userEmail) {
        throw new Error('User email not found');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/collections/UserCollections/${encodeURIComponent(userEmail)}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch collections: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setCollections(data.data || []);
      } else {
        throw new Error(data.message || 'Failed to fetch collections');
      }
    } catch (err) {
      console.error('Error fetching collections:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, [userEmail]);

  const sortedAndFilteredCollections = collections
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

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div>
            <div className="h-8 w-64 bg-[#1E2A45] rounded animate-pulse mb-2"></div>
            <div className="h-4 w-48 bg-[#1E2A45] rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-36 bg-[#1E2A45] rounded animate-pulse"></div>
        </div>

        {/* Controls Skeleton */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="h-10 w-64 bg-[#1E2A45] rounded animate-pulse"></div>
          <div className="flex gap-3">
            <div className="h-10 w-48 bg-[#1E2A45] rounded animate-pulse"></div>
            <div className="h-10 w-36 bg-[#1E2A45] rounded animate-pulse"></div>
          </div>
        </div>

        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[#1E2A45] rounded-xl p-6 animate-pulse">
              <div className="h-6 w-3/4 bg-[#3A4B72] rounded mb-4"></div>
              <div className="h-4 w-full bg-[#3A4B72] rounded mb-2"></div>
              <div className="h-4 w-2/3 bg-[#3A4B72] rounded mb-4"></div>
              <div className="flex gap-2 mb-4">
                <div className="h-6 w-16 bg-[#3A4B72] rounded"></div>
                <div className="h-6 w-20 bg-[#3A4B72] rounded"></div>
              </div>
              <div className="flex justify-between items-center">
                <div className="h-4 w-24 bg-[#3A4B72] rounded"></div>
                <div className="h-8 w-20 bg-[#3A4B72] rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 text-center">
        <div className="inline-flex items-center justify-center p-4 bg-red-500/10 rounded-full mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-white mb-2">Error Loading Collections</h3>
        <p className="text-red-400 mb-4">{error}</p>
        <button 
          onClick={fetchCollections}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-300"
        >
          Try Again
        </button>
      </div>
    );
  }

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
              title='Sort'
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
              title='filter'
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
        Showing {sortedAndFilteredCollections.length} of {collections.length} collections
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
            <CollectionCard key={collection._id} collection={collection} />
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
            {collections.length === 0 
              ? "You haven't created any collections yet. Start by creating your first collection!"
              : "Try adjusting your search or filter criteria"
            }
          </p>
          <Link
            href="/Dashboard/list/new"
            className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
          >
            Create New Collection
          </Link>
        </div>
      )}
    </div>
  );
}