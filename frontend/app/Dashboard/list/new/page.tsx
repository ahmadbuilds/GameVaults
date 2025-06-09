'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

interface Game {
  _id: string;
  title: string;
  platform: string;
  status: string;
  genres?: string[];
  rating?: number;
  description?: string;
  imageUrl?: string;
}

export default function NewCollectionPage() {
  const router = useRouter();
  const { user } = useUser();
  const [collectionName, setCollectionName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  const [availableGames, setAvailableGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const userEmail = user?.emailAddresses[0]?.emailAddress;


  useEffect(() => {
    const fetchAvailableGames = async () => {
      if (!userEmail) {
        console.log('No userEmail available');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        
        console.log('Fetching games for user:', userEmail);
        
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/AddGame/GetGamesByEmail?email=${encodeURIComponent(userEmail)}`);
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Response error:', errorText);
          throw new Error(`Failed to fetch user games: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('API Response:', result);
        
        
        if (result && Array.isArray(result.data)) {
          setAvailableGames(result.data);
          console.log('Successfully loaded games:', result.data.length);
        } else {
          console.error('Expected object with data array, got:', typeof result, result);
          setAvailableGames([]);
          setError('Invalid response format from server');
        }
        
      } catch (err) {
        console.error('Error fetching user games:', err);
        setError(`Failed to load games: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setAvailableGames([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableGames();
  }, [userEmail]);

  const toggleGameSelection = (gameId: string) => {
    setSelectedGames(prev => 
      prev.includes(gameId)
        ? prev.filter(id => id !== gameId)
        : [...prev, gameId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!collectionName.trim()) {
      setError('Please enter a collection name');
      return;
    }

    if (!userEmail) {
      setError('User email not available');
      return;
    }

    try {
      setCreating(true);
      setError('');

      const collectionData = {
        name: collectionName.trim(),
        description: description.trim(),
        isPublic
      };

      console.log('Creating collection with data:', collectionData);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/collections/CreateCollection/${encodeURIComponent(userEmail)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(collectionData)
      });

      const result = await response.json();
      console.log('Create collection response:', result);

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create collection');
      }

      if (result.success && result.data) {
        const collectionId = result.data._id;
        console.log('Created collection with ID:', collectionId);

        // Now add games to the collection one by one
        if (selectedGames.length > 0) {
          console.log('Adding games to collection:', selectedGames);
          
          
          const gamePromises = selectedGames.map(async (gameId) => {
            try {
              const addGameResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/collections/AddGameToCollection/${collectionId}/${encodeURIComponent(userEmail)}`,
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ gameId })
                }
              );

              const addGameResult = await addGameResponse.json();
              console.log(`Added game ${gameId} to collection:`, addGameResult);

              if (!addGameResponse.ok) {
                console.error(`Failed to add game ${gameId}:`, addGameResult.message);
                throw new Error(`Failed to add game: ${addGameResult.message}`);
              }
              
              return addGameResult;
            } catch (gameError) {
              console.error(`Error adding game ${gameId}:`, gameError);
              throw gameError;
            }
          });

          
          try {
            await Promise.allSettled(gamePromises);
            console.log('Finished adding games to collection');
          } catch (gameError) {
            console.warn('Some games may not have been added:', gameError);
            
          }
        }

       
        router.push(`/Dashboard/list`);
      } else {
        throw new Error(result.message || 'Failed to create collection');
      }
    } catch (err) {
      console.error('Error creating collection:', err);
      setError(err instanceof Error ? err.message : 'Failed to create collection');
    } finally {
      setCreating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/20 text-emerald-400';
      case 'playing':
        return 'bg-blue-500/20 text-blue-400';
      case 'backlog':
        return 'bg-amber-500/20 text-amber-400';
      case 'abandoned':
        return 'bg-rose-500/20 text-rose-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const displayGenres = (genres: string[] | undefined) => {
    if (!genres || genres.length === 0) return '';
    return genres.slice(0, 2).join(', ');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-[#1E2A45] rounded-xl p-6 border border-[#3A4B72]/30 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Create New Collection</h1>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-6">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        
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
                disabled={creating}
                placeholder="Enter collection name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full bg-[#2B3654] border border-[#3A4B72]/50 rounded-lg py-2 px-3 text-white outline-none focus:border-purple-400"
                disabled={creating}
                placeholder="Describe your collection (optional)"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="h-4 w-4 text-purple-500 rounded border-[#3A4B72] focus:ring-purple-400"
                disabled={creating}
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
              {loading ? (
                <div className="text-center py-8 text-gray-400">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-2"></div>
                  Loading available games...
                </div>
              ) : availableGames.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto p-2">
                  {availableGames.map(game => (
                    <div 
                      key={game._id}
                      onClick={() => !creating && toggleGameSelection(game._id)}
                      className={`cursor-pointer rounded-lg p-3 border transition-all ${
                        selectedGames.includes(game._id)
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-[#3A4B72]/50 hover:border-[#3A4B72]/80'
                      } ${creating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          title='Add Game'
                          type="checkbox"
                          checked={selectedGames.includes(game._id)}
                          onChange={() => {}} // Handled by parent onClick
                          className="h-4 w-4 text-purple-500 rounded border-[#3A4B72] focus:ring-purple-400"
                          disabled={creating}
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-medium truncate">{game.title}</h3>
                          <p className="text-sm text-gray-400 truncate">{game.platform}</p>
                          {displayGenres(game.genres) && (
                            <p className="text-xs text-gray-500 truncate">{displayGenres(game.genres)}</p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className={`text-xs px-2 py-1 rounded ${getStatusColor(game.status)}`}>
                            {game.status}
                          </span>
                          {game.rating && (
                            <div className="text-xs text-yellow-400">
                              {'★'.repeat(game.rating)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <div className="text-4xl mb-2">🎮</div>
                  <p>No games found in your library.</p>
                  <p className="text-sm mt-1">Add some games first to create collections!</p>
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
                {availableGames
                  .filter(game => selectedGames.includes(game._id))
                  .map(game => (
                    <span 
                      key={game._id}
                      className="text-xs bg-[#2B3654] text-gray-300 px-2 py-1 rounded-md flex items-center gap-1"
                    >
                      {game.title}
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!creating) {
                            toggleGameSelection(game._id);
                          }
                        }}
                        className="text-gray-400 hover:text-white ml-1"
                        disabled={creating}
                      >
                        ×
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
              className="cursor-pointer px-4 py-2 bg-[#2B3654] hover:bg-[#3A4B72] text-gray-300 rounded-lg transition-colors duration-200"
              disabled={creating}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!collectionName.trim() || creating}
              className="cursor-pointer px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {creating ? 'Creating...' : 'Create Collection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}