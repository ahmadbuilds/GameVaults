// app/Dashboard/list/[id]/page.tsx
'use client';

import { notFound } from 'next/navigation';
import { mockGames } from '../../../../app/mocks/games';
import { mockCollections } from '../../../../app/mocks/lists';
import GameCard from '../../../../app/components/GameCard';
import { motion } from 'framer-motion';

export default function ListDetailPage({ params }: { params: { id: string } }) {
  const collection = mockCollections.find(c => c.id === params.id);
  
  if (!collection) {
    return notFound();
  }

  // Get full game objects for the games in this collection
// Get full game objects for the games in this collection
const gamesInCollection = mockGames
  .filter(game => collection.games.includes(game.id))
  .sort((a, b) => a.title.localeCompare(b.title));

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-6"
    >
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => window.history.back()}
          className="bg-[#1E2A45] hover:bg-[#2F3B5C] p-2 rounded-lg transition-all duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <h1 className="text-3xl font-bold text-white">{collection.name}</h1>
      </div>

      {/* Collection Info */}
      {collection.description && (
        <div className="bg-[#1E2A45]/80 border border-[#3A4B72]/30 rounded-xl p-6">
          <p className="text-gray-300">{collection.description}</p>
        </div>
      )}

      {/* Games Count */}
      <div className="text-sm text-gray-400">
        {gamesInCollection.length} {gamesInCollection.length === 1 ? 'game' : 'games'} in this collection
      </div>

      {/* Games Grid */}
      {gamesInCollection.length > 0 ? (
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
          {gamesInCollection.map((game) => (
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
          <h3 className="text-lg font-medium text-white mb-2">No games in this collection</h3>
          <p className="text-gray-400">
            Add games to this collection from your library
          </p>
        </div>
      )}
    </motion.div>
  );
}