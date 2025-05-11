// components/GameDetail/index.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Game } from '../../mocks/games';

interface GameDetailProps {
  game: Game;
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

export default function GameDetail({ game }: GameDetailProps) {
  const [activeMediaTab, setActiveMediaTab] = useState<'screenshots' | 'videos'>('screenshots');
  const [selectedMedia, setSelectedMedia] = useState<number>(0);

  const screenshots = game.media.filter(m => m.type === 'image');
  const videos = game.media.filter(m => m.type === 'video');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-6 text-white"
    >
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <button className="bg-[#1E2A45] hover:bg-[#2F3B5C] p-2 rounded-lg transition-all duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <h1 className="text-3xl font-bold">{game.title}</h1>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Game Info */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Media Gallery */}
          <div className="bg-[#1E2A45]/80 border border-[#3A4B72]/30 rounded-xl overflow-hidden">
            {/* Main Media Display */}
            <div className="aspect-video bg-[#2B3654] flex items-center justify-center overflow-hidden">
              {game.media.length > 0 ? (
                activeMediaTab === 'screenshots' && screenshots.length > 0 ? (
                  <img 
                    src={screenshots[selectedMedia].url} 
                    alt={screenshots[selectedMedia].caption || 'Game screenshot'}
                    className="w-full h-full object-contain"
                  />
                ) : activeMediaTab === 'videos' && videos.length > 0 ? (
                  <video 
                    src={videos[selectedMedia].url}
                    controls
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-gray-400 p-8 text-center">
                    No {activeMediaTab} available
                  </div>
                )
              ) : (
                <div className="text-gray-400 p-8 text-center">
                  No media available for this game
                </div>
              )}
            </div>

            {/* Media Tabs */}
            <div className="flex border-b border-[#3A4B72]/30">
              <button
                onClick={() => setActiveMediaTab('screenshots')}
                className={`px-4 py-3 font-medium text-sm flex-1 text-center ${
                  activeMediaTab === 'screenshots'
                    ? 'text-white border-b-2 border-purple-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Screenshots ({screenshots.length})
              </button>
              <button
                onClick={() => setActiveMediaTab('videos')}
                className={`px-4 py-3 font-medium text-sm flex-1 text-center ${
                  activeMediaTab === 'videos'
                    ? 'text-white border-b-2 border-purple-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Videos ({videos.length})
              </button>
            </div>

            {/* Media Thumbnails */}
            <div className="p-4 grid grid-cols-4 gap-2 max-h-40 overflow-y-auto">
              {(activeMediaTab === 'screenshots' ? screenshots : videos).map((media, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedMedia(index)}
                  className={`aspect-video bg-[#2B3654] rounded-md overflow-hidden border-2 ${
                    selectedMedia === index ? 'border-purple-500' : 'border-transparent'
                  }`}
                >
                  {media.type === 'image' ? (
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
          </div>

          {/* Game Description */}
          <div className="bg-[#1E2A45]/80 border border-[#3A4B72]/30 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">About This Game</h2>
            <p className="text-gray-300 leading-relaxed">{game.description}</p>
          </div>

          {/* Personal Notes */}
          {game.personalNotes && (
            <div className="bg-[#1E2A45]/80 border border-[#3A4B72]/30 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Personal Notes
              </h2>
              <p className="text-gray-300 leading-relaxed">{game.personalNotes}</p>
            </div>
          )}

          {/* Achievements */}
          {/* {game.achievements && game.achievements.length > 0 && (
            <div className="bg-[#1E2A45]/80 border border-[#3A4B72]/30 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Achievements</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {game.achievements.map((achievement, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg border ${
                      achievement.unlocked
                        ? 'border-emerald-500/30 bg-emerald-500/10'
                        : 'border-gray-700/50 bg-[#1E2A45]/50'
                    }`}
                  >
                    <div className="flex gap-3">
                      {achievement.icon ? (
                        <img 
                          src={achievement.icon} 
                          alt={achievement.name}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-md bg-[#2B3654] flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                      <div>
                        <h3 className={`font-medium ${
                          achievement.unlocked ? 'text-white' : 'text-gray-400'
                        }`}>
                          {achievement.name}
                        </h3>
                        <p className="text-sm mt-1 text-gray-400">{achievement.description}</p>
                        {achievement.unlocked && achievement.unlockedAt && (
                          <p className="text-xs mt-2 text-gray-500">
                            Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )} */}
        </div>

        {/* Right Column - Game Metadata */}
        <div className="flex flex-col gap-6">
          {/* Cover Image */}
          <div className="bg-[#1E2A45]/80 border border-[#3A4B72]/30 rounded-xl overflow-hidden">
            {game.coverImage ? (
              <img 
                src={game.coverImage} 
                alt={game.title}
                className="w-full h-auto object-cover"
              />
            ) : (
              <div className="aspect-[2/3] bg-[#2B3654] flex items-center justify-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>

          {/* Game Stats */}
          <div className="bg-[#1E2A45]/80 border border-[#3A4B72]/30 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Your Stats</h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-400 mb-1">
                  <span>Status</span>
                  <span className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${statusColors[game.status]}`} />
                    {statusLabels[game.status]}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{game.progress}%</span>
                </div>
                <div className="w-full bg-[#2B3654] rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${statusColors[game.status]}`}
                    style={{ width: `${game.progress}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm text-gray-400 mb-1">
                  <span>Hours Played</span>
                  <span>{game.hoursPlayed}h</span>
                </div>
              </div>

              {game.rating && (
                <div>
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>Your Rating</span>
                    <span className="flex items-center">
                      {game.rating}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </span>
                  </div>
                </div>
              )}

              {game.lastPlayed && (
                <div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Last Played</span>
                    <span>{new Date(game.lastPlayed).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Game Details */}
          <div className="bg-[#1E2A45]/80 border border-[#3A4B72]/30 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Details</h2>
            
            <div className="space-y-3">
              <div>
                <h3 className="text-sm text-gray-400">Platform</h3>
                <p className="text-white">{game.platform}</p>
              </div>

              <div>
                <h3 className="text-sm text-gray-400">Developer</h3>
                <p className="text-white">{game.developer}</p>
              </div>

              <div>
                <h3 className="text-sm text-gray-400">Publisher</h3>
                <p className="text-white">{game.publisher}</p>
              </div>

              <div>
                <h3 className="text-sm text-gray-400">Release Date</h3>
                <p className="text-white">{new Date(game.releaseDate).toLocaleDateString()}</p>
              </div>

              {game.genres.length > 0 && (
                <div>
                  <h3 className="text-sm text-gray-400">Genres</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {game.genres.map((genre, index) => (
                      <span key={index} className="text-xs bg-[#2B3654]/50 text-gray-300 px-2 py-1 rounded-md">
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {game.playMode.length > 0 && (
                <div>
                  <h3 className="text-sm text-gray-400">Play Mode</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {game.playMode.map((mode, index) => (
                      <span key={index} className="text-xs bg-[#2B3654]/50 text-gray-300 px-2 py-1 rounded-md">
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
    href={`/Dashboard/library/${game.id}/edit`}
    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 font-medium text-center"
  >
    Edit Game Details
  </Link>
  <button className="w-full bg-[#1E2A45] hover:bg-[#2F3B5C] text-white py-3 rounded-lg transition-all duration-300 font-medium">
    Add Media
  </button>
</div>



        </div>
      </div>
    </motion.div>
  );
}