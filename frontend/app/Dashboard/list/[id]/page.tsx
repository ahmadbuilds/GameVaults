'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import MediaUpload from '../../../components/MediaUpload'; 

// Types
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
  caption?: string;
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

export default function CollectionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  
  const [collection, setCollection] = useState<GameCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddMedia, setShowAddMedia] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingGame, setDeletingGame] = useState<string | null>(null);
  const [activeMediaTab, setActiveMediaTab] = useState<'screenshots' | 'videos'>('screenshots');
  const [selectedMedia, setSelectedMedia] = useState<number>(0);

  const collectionId = params.id as string;
  const userEmail = user?.emailAddresses[0]?.emailAddress;

  
  const fetchCollection = async () => {
    try {
      setLoading(true);
      setError(null);

      const url = `${process.env.NEXT_PUBLIC_API_URL}/collections/GetCollection/${collectionId}${userEmail ? `?userEmail=${encodeURIComponent(userEmail)}` : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch collection: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setCollection(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch collection');
      }
    } catch (err) {
      console.error('Error fetching collection:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  
  const handleMediaUploadSuccess = () => {
    
    fetchCollection();
  };

  
  const handleRemoveGame = async (gameId: string) => {
    if (!userEmail) return;

    try {
      setDeletingGame(gameId);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/collections/RemoveGameFromCollection/${collectionId}/${gameId}/${encodeURIComponent(userEmail)}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setCollection(data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error('Error removing game:', err);
      alert('Failed to remove game: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setDeletingGame(null);
    }
  };

  
  const handleDeleteCollection = async () => {
    if (!userEmail) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/collections/DeleteCollection/${collectionId}/${encodeURIComponent(userEmail)}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        router.push('/Dashboard/list');
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error('Error deleting collection:', err);
      alert('Failed to delete collection: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };


const handleDeleteMedia = async (mediaPublicId: string) => {
  if (!userEmail) return;
  console.log('Original publicId:', mediaPublicId);
  
  try {
   
    const encodedPublicId = encodeURIComponent(mediaPublicId);
    console.log('Encoded publicId:', encodedPublicId);
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/collections/RemoveMedia/${collectionId}/${encodeURIComponent(userEmail)}/${encodedPublicId}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (data.success) {
      setCollection(data.data);
      
      const remainingMedia = activeMediaTab === 'screenshots' 
        ? data.data.media.filter((m: Media) => m.type === 'image')
        : data.data.media.filter((m: Media) => m.type === 'video');
      
      if (selectedMedia >= remainingMedia.length) {
        setSelectedMedia(Math.max(0, remainingMedia.length - 1));
      }
    } else {
      throw new Error(data.message);
    }
  } catch (err) {
    console.error('Error deleting media:', err);
    alert('Failed to delete media: ' + (err instanceof Error ? err.message : 'Unknown error'));
  }
};

  useEffect(() => {
    fetchCollection();
  }, [collectionId, userEmail]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F1419] p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-[#1E2A45] rounded mb-4"></div>
            <div className="h-64 bg-[#1E2A45] rounded-xl mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-[#1E2A45] rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="min-h-screen bg-[#0F1419] p-6 flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 text-center max-w-md">
          <h3 className="text-lg font-medium text-white mb-2">Error Loading Collection</h3>
          <p className="text-red-400 mb-4">{error || 'Collection not found'}</p>
          <Link
            href="/Dashboard/list"
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-300"
          >
            Back to Collections
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = collection.userEmail === userEmail;

  
  const screenshots = collection.media?.filter(media => media.type === 'image') || [];
  const videos = collection.media?.filter(media => media.type === 'video') || [];

  return (
    <div className="min-h-screen bg-[#0F1419] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link
              href="/Dashboard/list"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
            <h1 className="text-3xl font-bold text-white">{collection.name}</h1>
            {!collection.isPublic && (
              <span className="bg-[#2B3654] text-gray-400 px-3 py-1 rounded-full text-sm">
                Private
              </span>
            )}
          </div>

          {isOwner && (
            <div className="flex gap-3">
              <Link
                href={`/Dashboard/list/${collectionId}/edit`}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit
              </Link>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Collection Info */}
        <div className="bg-[#1E2A45]/80 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              {collection.description && (
                <p className="text-gray-300 mb-4">{collection.description}</p>
              )}
              
              {collection.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {collection.tags.map(tag => (
                    <span key={tag} className="bg-[#2B3654] text-gray-300 px-3 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-6 text-sm text-gray-400">
                <span>{collection.games.length} games</span>
                <span>{collection.media.length} media files</span>
                <span>Created {new Date(collection.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {isOwner && (
                <button
                  onClick={() => setShowAddMedia(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-500/20 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  Add Media
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Media Gallery */}
        {collection.media.length > 0 && (
          <div className="mb-6">
            <div className="bg-[#1E2A45]/80 border border-[#3A4B72]/30 rounded-xl overflow-hidden backdrop-blur-sm">
              {/* Main Media Display */}
              <div className="aspect-video bg-gradient-to-br from-[#2B3654] to-[#1E2A45] flex items-center justify-center overflow-hidden relative">
                {screenshots.length > 0 || videos.length > 0 ? (
                  activeMediaTab === 'screenshots' && screenshots.length > 0 ? (
                    <div className="relative w-full h-full group">
                      <img 
                        src={screenshots[selectedMedia]?.url || screenshots[0]?.url} 
                        alt={screenshots[selectedMedia]?.caption || 'Collection screenshot'}
                        className="w-full h-full object-cover"
                      />
                      {/* Caption overlay */}
                      {screenshots[selectedMedia]?.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4">
                          <p className="text-sm">{screenshots[selectedMedia].caption}</p>
                        </div>
                      )}
                      {/* Remove Media Button */}
                      {isOwner && (
                        <button
                          onClick={() => handleDeleteMedia(screenshots[selectedMedia].publicId)}
                          className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remove this image"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ) : videos.length > 0 ? (
                    <div className="relative w-full h-full group">
                      <video 
                        src={videos[selectedMedia]?.url || videos[0]?.url}
                        controls
                        className="w-full h-full object-contain"
                      />
                      {/* Caption overlay */}
                      {videos[selectedMedia]?.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4">
                          <p className="text-sm">{videos[selectedMedia].caption}</p>
                        </div>
                      )}
                      {/* Remove Media Button */}
                      {isOwner && (
                        <button
                          onClick={() => handleDeleteMedia(videos[selectedMedia].publicId)}
                          className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remove this video"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="text-gray-400 p-8 text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      No {activeMediaTab} available for this collection
                    </div>
                  )
                ) : (
                  <div className="text-gray-400 p-8 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    No media available for this collection
                  </div>
                )}
              </div>

              {/* Media Tabs */}
              <div className="flex border-b border-[#3A4B72]/30">
                <button
                  onClick={() => {
                    setActiveMediaTab('screenshots');
                    setSelectedMedia(0);
                  }}
                  className={`px-6 py-4 font-medium text-sm flex-1 text-center transition-all duration-200 ${
                    activeMediaTab === 'screenshots'
                      ? 'text-white border-b-2 border-purple-500 bg-purple-500/10'
                      : 'text-gray-400 hover:text-white hover:bg-[#2B3654]/50'
                  }`}
                >
                  Screenshots ({screenshots.length})
                </button>
                <button
                  onClick={() => {
                    setActiveMediaTab('videos');
                    setSelectedMedia(0);
                  }}
                  className={`px-6 py-4 font-medium text-sm flex-1 text-center transition-all duration-200 ${
                    activeMediaTab === 'videos'
                      ? 'text-white border-b-2 border-purple-500 bg-purple-500/10'
                      : 'text-gray-400 hover:text-white hover:bg-[#2B3654]/50'
                  }`}
                >
                  Videos ({videos.length})
                </button>
              </div>

              {/* Media Thumbnails */}
              {((activeMediaTab === 'screenshots' && screenshots.length > 0) || 
                (activeMediaTab === 'videos' && videos.length > 0)) && (
                <div className="p-4 grid grid-cols-4 gap-3 max-h-40 overflow-y-auto">
                  {(activeMediaTab === 'screenshots' ? screenshots : videos).map((media, index) => (
                    <button
                      key={media._id}
                      onClick={() => setSelectedMedia(index)}
                      className={`aspect-video bg-[#2B3654] rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                        selectedMedia === index ? 'border-purple-500 shadow-lg shadow-purple-500/20' : 'border-transparent hover:border-purple-300'
                      }`}
                    >
                      {activeMediaTab === 'screenshots' ? (
                        <img 
                          src={media.url} 
                          alt={media.caption || 'Collection screenshot'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-black/50">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Games */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Games ({collection.games.length})</h2>
          {collection.games.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {collection.games.map(({ gameId: game, _id }) => (
                <motion.div
                  key={_id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#1E2A45]/80 rounded-xl p-4 relative group"
                >
                  {game.imageUrl && (
                    <img
                      src={game.imageUrl}
                      alt={game.title}
                      className="w-full h-32 object-cover rounded-lg mb-4"
                    />
                  )}
                  
                  <h3 className="text-lg font-bold text-white mb-2">{game.title}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-[#2B3654] text-gray-300 px-2 py-1 rounded text-sm">
                      {game.platform}
                    </span>
                    <span className="bg-[#2B3654] text-gray-300 px-2 py-1 rounded text-sm">
                      {game.status}
                    </span>
                  </div>
                  
                  {game.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {game.genres.slice(0, 3).map(genre => (
                        <span key={genre} className="text-xs bg-[#2B3654]/50 text-gray-400 px-2 py-1 rounded">
                          {genre}
                        </span>
                      ))}
                    </div>
                  )}

                  {game.rating && (
                    <div className="flex items-center gap-1 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm text-gray-300">{game.rating}/10</span>
                    </div>
                  )}

                  {isOwner && (
                    <button
                      onClick={() => handleRemoveGame(game._id)}
                      disabled={deletingGame === game._id}
                      className="cursor-pointer absolute top-2 right-2 bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      {deletingGame === game._id ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-[#1E2A45]/30 border border-[#3A4B72]/20 rounded-xl p-8 text-center">
              <p className="text-gray-400">No games in this collection yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Media Upload Modal */}
      {showAddMedia && (
        <MediaUpload
          collectionId={collectionId} 
          uploadType="collection"
          onClose={() => setShowAddMedia(false)}

          onUploadSuccess={handleMediaUploadSuccess}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-[#1E2A45] rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-white mb-4">Delete Collection</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete {collection.name}? This action cannot be undone.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={handleDeleteCollection}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-all duration-300"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}