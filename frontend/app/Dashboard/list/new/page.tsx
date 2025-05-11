// app/Dashboard/list/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockGames } from '../../../../app/mocks/games';
import { mockCollections } from '../../../../app/mocks/lists';
import GameCard from '../../../../app/components/GameCard';

export default function NewCollectionPage() {
  const router = useRouter();
  const [collectionName, setCollectionName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(false);

  const toggleGameSelection = (gameId: string) => {
    setSelectedGames(prev => 
      prev.includes(gameId)
        ? prev.filter(id => id !== gameId)
        : [...prev, gameId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!collectionName.trim()) {
      alert('Please enter a collection name');
      return;
    }

    const newCollection = {
      id: Math.random().toString(36).substring(2, 9),
      name: collectionName,
      description,
      games: selectedGames,
      tags: [],
      isPublic,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // In a real app, you would save to your database here
    mockCollections.push(newCollection);
    console.log('Created new collection:', newCollection);
    
    // Redirect to the new collection's page
    router.push(`/Dashboard/list/${newCollection.id}`);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-[#1E2A45] rounded-xl p-6 border border-[#3A4B72]/30 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Create New Collection</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Collection Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Collection Name*</label>
              <input
                type="text"
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
                className="w-full bg-[#2B3654] border border-[#3A4B72]/50 rounded-lg py-2 px-3 text-white outline-none focus:border-purple-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full bg-[#2B3654] border border-[#3A4B72]/50 rounded-lg py-2 px-3 text-white outline-none focus:border-purple-400"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="h-4 w-4 text-purple-500 rounded border-[#3A4B72] focus:ring-purple-400"
              />
              <label htmlFor="isPublic" className="ml-2 text-sm text-gray-300">
                Make this collection public
              </label>
            </div>
          </div>

          {/* Game Selection */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Select Games</h2>
            <div className="bg-[#1E2A45]/50 border border-[#3A4B72]/30 rounded-lg p-4">
              {mockGames.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto p-2">
                  {mockGames.map(game => (
                    <div 
                      key={game.id}
                      onClick={() => toggleGameSelection(game.id)}
                      className={`cursor-pointer rounded-lg p-3 border transition-all ${
                        selectedGames.includes(game.id)
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-[#3A4B72]/50 hover:border-[#3A4B72]/80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedGames.includes(game.id)}
                          readOnly
                          className="h-4 w-4 text-purple-500 rounded border-[#3A4B72] focus:ring-purple-400"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-medium truncate">{game.title}</h3>
                          <p className="text-sm text-gray-400 truncate">{game.platform}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          game.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                          game.status === 'playing' ? 'bg-blue-500/20 text-blue-400' :
                          game.status === 'backlog' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-rose-500/20 text-rose-400'
                        }`}>
                          {game.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  No games in your library yet
                </div>
              )}
            </div>
          </div>

          {/* Selected Games Preview */}
          {selectedGames.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">
                Selected Games ({selectedGames.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {mockGames
                  .filter(game => selectedGames.includes(game.id))
                  .map(game => (
                    <span 
                      key={game.id}
                      className="text-xs bg-[#2B3654] text-gray-300 px-2 py-1 rounded-md flex items-center gap-1"
                    >
                      {game.title}
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleGameSelection(game.id);
                        }}
                        className="text-gray-400 hover:text-white"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.push('/Dashboard/list')}
              className="px-4 py-2 bg-[#2B3654] hover:bg-[#3A4B72] text-gray-300 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!collectionName.trim()}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-200 disabled:opacity-70"
            >
              Create Collection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}