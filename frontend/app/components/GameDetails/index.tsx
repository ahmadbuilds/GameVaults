// components/GameDetail/index.tsx
'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Game } from '../../types/game';
import { useUser } from '@clerk/nextjs';
import MediaUpload from '../MediaUpload';

interface GameDetailProps {
  params: Promise<{ id: string }>;
}
interface MediaItem {
  url: string;
  type: 'image' | 'video';
  publicId: string;
  caption?: string;
  uploadedAt: Date;
}
const statusColors = {
  completed: 'bg-emerald-500',
  playing: 'bg-blue-500',
  backlog: 'bg-amber-500',
  abandoned: 'bg-rose-500'
};

const statusLabels = {
  completed: 'Completed',
  playing: 'Playing',
  backlog: 'Backlog',
  abandoned: 'Abandoned'
};

export default function GameDetail({ params }: GameDetailProps) {
 
  const { id: gameId } = use(params);
  
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMediaTab, setActiveMediaTab] = useState<'screenshots' | 'videos'>('screenshots');
  const [selectedMedia, setSelectedMedia] = useState<number>(0);
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const router = useRouter();
  const { user } = useUser();

  const fetchGame = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/AddGame/GetGamesByEmail?email=${encodeURIComponent(user.primaryEmailAddress.emailAddress)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch games');
      }
      
      const data = await response.json();
      if (data.success) {
        const foundGame = data.data.find((g: Game) => g._id === gameId);
        if (foundGame) {
          setGame(foundGame);
        } else {
          throw new Error('Game not found');
        }
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGame();
  }, [gameId, user]);

  const handleMediaUploadSuccess = () => {
    
    fetchGame();
  };

  const handleRemoveMedia = async (mediaPublicId: string) => {
    if (!user?.primaryEmailAddress?.emailAddress || !game) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/AddGame/RemoveMedia/${game._id}/${encodeURIComponent(user.primaryEmailAddress.emailAddress)}/${mediaPublicId}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        throw new Error('Failed to remove media');
      }

    
      await fetchGame();
    } catch (error) {
      console.error('Error removing media:', error);
      alert('Failed to remove media. Please try again.');
    }
  };

  const handleDeleteGame = async () => {
    if (!user?.primaryEmailAddress?.emailAddress || !game) return;

    setIsDeleting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/AddGame/DeleteGame/${game._id}/${encodeURIComponent(user.primaryEmailAddress.emailAddress)}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        throw new Error('Failed to delete game');
      }

      const data = await response.json();
      
      if (data.success) {

       
        router.push('/Dashboard/library');
      } else {
        throw new Error(data.error || 'Failed to delete game');
      }
    } catch (error) {
      console.error('Error deleting game:', error);
      alert('Failed to delete game. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <div className="animate-pulse text-white">Loading game data...</div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <div className="text-red-400">Error: {error || 'Game not found'}</div>
        <Link 
          href="/Dashboard/library" 
          className="inline-block mt-4 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Back to Library
        </Link>
      </div>
    );
  }

  
  const screenshots: MediaItem[] = (game.mediaUrls?.filter(media => media.type === 'image') || []) as MediaItem[];
  const videos: MediaItem[] = (game.mediaUrls?.filter(media => media.type === 'video') || []) as MediaItem[];

  // If no media exists, fallback to single imageUrl
  if (screenshots.length === 0 && game.imageUrl) {
      screenshots.push({
      url: game.imageUrl,
      type: 'image' as const,
      publicId: 'fallback',
      caption: 'Game Cover',
      uploadedAt: new Date()
    });
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto py-8 px-4 text-white"
      >
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <button
            title='Back' 
            onClick={() => router.push('/Dashboard/library')}
            className="bg-[#1E2A45] hover:bg-[#2F3B5C] p-3 rounded-lg transition-all duration-300 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {game.title}
          </h1>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Game Info */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Media Gallery */}
            <div className="bg-[#1E2A45]/80 border border-[#3A4B72]/30 rounded-xl overflow-hidden backdrop-blur-sm">
              {/* Main Media Display */}
              <div className="aspect-video bg-gradient-to-br from-[#2B3654] to-[#1E2A45] flex items-center justify-center overflow-hidden relative">
                {screenshots.length > 0 || videos.length > 0 ? (
                  activeMediaTab === 'screenshots' && screenshots.length > 0 ? (
                    <div className="relative w-full h-full group">
                      <img 
                        src={screenshots[selectedMedia]?.url || screenshots[0]?.url} 
                        alt={screenshots[selectedMedia]?.caption || 'Game screenshot'}
                        className="w-full h-full object-cover"
                      />
                      {/* Remove Media Button */}
                      {screenshots[selectedMedia]?.publicId !== 'fallback' && (
                        <button
                          onClick={() => handleRemoveMedia(screenshots[selectedMedia].publicId)}
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
                      {/* Remove Media Button */}
                      <button
                        onClick={() => handleRemoveMedia(videos[selectedMedia].publicId)}
                        className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove this video"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="text-gray-400 p-8 text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      No {activeMediaTab} available for this game
                    </div>
                  )
                ) : (
                  <div className="text-gray-400 p-8 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    No media available for this game
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
                      key={index}
                      onClick={() => setSelectedMedia(index)}
                      className={`aspect-video bg-[#2B3654] rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                        selectedMedia === index ? 'border-purple-500 shadow-lg shadow-purple-500/20' : 'border-transparent hover:border-purple-300'
                      }`}
                    >
                      {activeMediaTab === 'screenshots' ? (
                        <img 
                          src={media.url} 
                          alt={media.caption || ''}
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

            {/* Game Description */}
            <div className="bg-[#1E2A45]/80 border border-[#3A4B72]/30 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                About This Game
              </h2>
              <p className="text-gray-300 leading-relaxed text-lg">
                {game.description || 'No description available for this game.'}
              </p>
            </div>

            {/* Personal Notes */}
            {game.personalNotes && (
              <div className="bg-[#1E2A45]/80 border border-[#3A4B72]/30 rounded-xl p-6 backdrop-blur-sm">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Personal Notes
                </h2>
                <p className="text-gray-300 leading-relaxed text-lg">{game.personalNotes}</p>
              </div>
            )}
          </div>

          {/* Right Column - Game Metadata */}
          <div className="flex flex-col gap-6">
            {/* Game Stats */}
            <div className="bg-[#1E2A45]/80 border border-[#3A4B72]/30 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-bold mb-4">Your Stats</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>Status</span>
                    <span className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${statusColors[game.status]}`} />
                      {statusLabels[game.status]}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Progress</span>
                    <span>{game.progress}%</span>
                  </div>
                  <div className="w-full bg-[#2B3654] rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${statusColors[game.status]}`}
                      style={{ width: `${game.progress}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>Hours Played</span>
                    <span className="font-semibold text-white">{game.hoursPlayed}h</span>
                  </div>
                </div>

                {game.rating && (
                  <div>
                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                      <span>Your Rating</span>
                      <span className="flex items-center">
                        <span className="font-semibold text-white mr-1">{game.rating}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </span>
                    </div>
                  </div>
                )}

                {game.updatedAt && (
                  <div>
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Last Updated</span>
                      <span>{new Date(game.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Game Details */}
            <div className="bg-[#1E2A45]/80 border border-[#3A4B72]/30 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-bold mb-4">Details</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm text-gray-400 font-medium">Platform</h3>
                  <p className="text-white font-semibold">{game.platform}</p>
                </div>

                {game.developer && (
                  <div>
                    <h3 className="text-sm text-gray-400 font-medium">Developer</h3>
                    <p className="text-white font-semibold">{game.developer}</p>
                  </div>
                )}

                {game.publisher && (
                  <div>
                    <h3 className="text-sm text-gray-400 font-medium">Publisher</h3>
                    <p className="text-white font-semibold">{game.publisher}</p>
                  </div>
                )}

                {game.releaseDate && (
                  <div>
                    <h3 className="text-sm text-gray-400 font-medium">Release Date</h3>
                    <p className="text-white font-semibold">{new Date(game.releaseDate).toLocaleDateString()}</p>
                  </div>
                )}

                {game.genres && game.genres.length > 0 && (
                  <div>
                    <h3 className="text-sm text-gray-400 font-medium mb-2">Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {game.genres.map((genre, index) => (
                        <span key={index} className="text-xs bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/30">
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {game.playMode && game.playMode.length > 0 && (
                  <div>
                    <h3 className="text-sm text-gray-400 font-medium mb-2">Play Mode</h3>
                    <div className="flex flex-wrap gap-2">
                      {game.playMode.map((mode, index) => (
                        <span key={index} className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full border border-blue-500/30">
                          {mode}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Link
                href={`/Dashboard/library/${game._id}/edit`}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 font-medium text-center hover:scale-105"
              >
                Edit Game Details
              </Link>
              <button
                onClick={() => setShowMediaUpload(true)}
                className="cursor-pointer w-full bg-[#1E2A45] hover:bg-[#2F3B5C] text-white py-3 px-6 rounded-lg transition-all duration-300 font-medium hover:scale-105"
              >
                Add Media
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="cursor-pointer w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-6 rounded-lg hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300 font-medium hover:scale-105 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Game
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Media Upload Modal */}
      {showMediaUpload && (
        <MediaUpload
          gameId={gameId}
          onClose={() => setShowMediaUpload(false)}
          onUploadSuccess={handleMediaUploadSuccess}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1E2A45] border border-[#3A4B72]/30 rounded-xl p-6 max-w-md w-full"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-500/20 p-3 rounded-full">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Delete Game</h3>
                <p className="text-gray-400 text-sm">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete <span className="font-semibold text-white">{game?.title}</span>? 
              This will permanently remove the game and all associated media from your library.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 bg-[#2B3654] hover:bg-[#3A4B72] text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteGame}
                disabled={isDeleting}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                 <>
                   <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                   Deleting...
                 </>
               ) : (
                 'Delete Game'
               )}
             </button>
           </div>
         </motion.div>
       </div>
     )}
   </>
 );
}