'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/nextjs';

interface Platform {
  id: string;
  name: string;
  gamesCount: number;
}

export default function PlatformsList({ searchQuery = '' }: { searchQuery?: string }) {
  const { user } = useUser();
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [filteredPlatforms, setFilteredPlatforms] = useState<Platform[]>([]);
  const [newPlatformName, setNewPlatformName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [prevSearchQuery, setPrevSearchQuery] = useState('');

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      fetchPlatforms();
    }
  }, [user]);

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
     
      const timer = setTimeout(() => {
        if (searchQuery.trim()) {
          searchPlatforms(searchQuery);
        } else {
          setFilteredPlatforms(platforms);
        }
        setPrevSearchQuery(searchQuery);
      }, 500); 
      
      return () => clearTimeout(timer);
    }
  }, [searchQuery, user, platforms]);

  const fetchPlatforms = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:4000/platform/email?email=${user?.primaryEmailAddress?.emailAddress}`
      );
      if (!response.ok) throw new Error('Failed to fetch platforms');
      const { data } = await response.json();
      
      const formattedPlatforms = data.map((platform: any) => ({
        id: platform._id,
        name: platform.name,
        gamesCount: platform.gamesCount
      }));
      
      setPlatforms(formattedPlatforms);
      setFilteredPlatforms(formattedPlatforms);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch platforms');
    } finally {
      setLoading(false);
    }
  };

  const searchPlatforms = async (query: string) => {
    if (!user?.primaryEmailAddress?.emailAddress || !query.trim()) {
      setFilteredPlatforms(platforms);
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:4000/platform/search?email=${user.primaryEmailAddress.emailAddress}&name=${query}`
      );
      if (!response.ok) throw new Error('Failed to search platforms');
      const { data } = await response.json();
      
      const formattedPlatforms = data.map((platform: any) => ({
        id: platform._id,
        name: platform.name,
        gamesCount: platform.gamesCount
      }));
      
      setFilteredPlatforms(formattedPlatforms);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search platforms');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlatform = async () => {
    if (!newPlatformName.trim()) return;
    if (!user?.primaryEmailAddress?.emailAddress) return;

    try {
      
      const exists = platforms.some(
        (p) => p.name.toLowerCase() === newPlatformName.toLowerCase()
      );
      if (exists) {
        setError('Platform with this name already exists');
        return;
      }

      const response = await fetch('http://localhost:4000/platform', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newPlatformName,
          email: user.primaryEmailAddress.emailAddress,
        }),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to add platform');
      }

     
      await fetchPlatforms();
      setNewPlatformName('');
      setShowAddForm(false);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add platform');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Your Platforms</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="cursor-pointer bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
        >
          Add Platform
        </button>
      </div>

      {/* Add Platform Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-[#1E2A45]/80 border border-[#3A4B72]/30 rounded-xl p-4 mb-6"
        >
          <h3 className="text-lg font-medium text-white mb-3">Add New Platform</h3>
          <div className="flex gap-3 flex-col">
            <div className="flex gap-3">
              <input
                type="text"
                value={newPlatformName}
                onChange={(e) => {
                  setNewPlatformName(e.target.value);
                  setError('');
                }}
                placeholder="Platform name"
                className="flex-1 bg-[#2B3654] border border-[#3A4B72]/50 rounded-lg py-2 px-3 text-white outline-none focus:border-blue-400"
              />
              <button
                onClick={handleAddPlatform}
                className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setError('');
                }}
                className="cursor-pointer bg-[#2B3654] hover:bg-[#3A4B72] text-gray-300 px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
          </div>
        </motion.div>
      )}

      {loading ? (
        <div className="text-center text-gray-400">Loading platforms...</div>
      ) : (
        /* Platforms Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlatforms.length > 0 ? (
            filteredPlatforms.map((platform) => (
              <Link href={`/Dashboard/backlog`} key={platform.id}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-[#1E2A45]/80 hover:bg-[#1E2A45] border border-[#3A4B72]/30 rounded-xl p-4 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <h3 className="text-lg font-bold text-white">{platform.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {platform.gamesCount} {platform.gamesCount === 1 ? 'game' : 'games'}
                  </p>
                  <div className="mt-3 h-1 w-full bg-[#2B3654] rounded-full">
                    <div 
                      className="h-1 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"
                      style={{ width: `${Math.min(100, (platform.gamesCount / 20) * 100)}%` }}
                    />
                  </div>
                </motion.div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400 py-8">
              No platforms found. Add your first platform to get started.
            </div>
          )}
        </div>
      )}
    </div>
  );
}