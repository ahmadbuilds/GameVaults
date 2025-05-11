// components/PlatformsList/index.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Mock data for platforms - you might want to move this to your mocks
const mockPlatforms = [
  { id: '1', name: 'PC', gamesCount: 12 },
  { id: '2', name: 'PlayStation 5', gamesCount: 8 },
  { id: '3', name: 'Xbox Series X', gamesCount: 5 },
  { id: '4', name: 'Nintendo Switch', gamesCount: 6 },
];

export default function PlatformsList() {
  const [platforms, setPlatforms] = useState(mockPlatforms);
  const [newPlatformName, setNewPlatformName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddPlatform = () => {
    if (newPlatformName.trim()) {
      const newPlatform = {
        id: Math.random().toString(36).substring(2, 9),
        name: newPlatformName,
        gamesCount: 0
      };
      setPlatforms([...platforms, newPlatform]);
      setNewPlatformName('');
      setShowAddForm(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Your Platforms</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
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
          <div className="flex gap-3">
            <input
              type="text"
              value={newPlatformName}
              onChange={(e) => setNewPlatformName(e.target.value)}
              placeholder="Platform name"
              className="flex-1 bg-[#2B3654] border border-[#3A4B72]/50 rounded-lg py-2 px-3 text-white outline-none focus:border-blue-400"
            />
            <button
              onClick={handleAddPlatform}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Add
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="bg-[#2B3654] hover:bg-[#3A4B72] text-gray-300 px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Platforms Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {platforms.map((platform) => (
          <Link href={`/Dashboard/backlog/platforms/${platform.id}`} key={platform.id}>
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
        ))}
      </div>
    </div>
  );
}