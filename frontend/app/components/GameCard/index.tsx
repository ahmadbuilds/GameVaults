// components/GameCard/index.tsx
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Game } from '../../types/game';

interface GameCardProps {
  game: Game;
  onGameUpdated?: () => void;
}

const statusColors = {
  completed: 'bg-emerald-500',
  playing: 'bg-blue-500',
  backlog: 'bg-amber-500',
  abandoned: 'bg-rose-500'
};

export default function GameCard({ game, onGameUpdated }: GameCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-[#1E2A45]/80 hover:bg-[#1E2A45] border border-[#3A4B72]/30 rounded-xl p-4 transition-all duration-300 shadow-md hover:shadow-lg overflow-hidden"
    >
      <Link href={`/Dashboard/library/${game._id}`} className="block">
        <div className="flex gap-4">
          {/* Cover Image */}
          <div className="w-24 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-[#2B3654]">
            {game.displayImageUrl ? (
              <img 
                src={game.displayImageUrl} 
                alt={game.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>

          {/* Game Info */}
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-bold text-white hover:text-purple-400 transition-colors duration-200">
                {game.title}
              </h3>
              
              {/* Rating display */}
              {game.rating && (
                <div className="flex items-center bg-[#2B3654] px-2 py-1 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-medium">{game.rating}</span>
                </div>
              )}
            </div>
    
            {/* Platform */}
            <div className="text-sm text-gray-400 mt-1">
              {game.platform}
            </div>
    
            {/* Progress Bar */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Progress: {game.progress}%</span>
                <span>{game.hoursPlayed}h played</span>
              </div>
              <div className="w-full bg-[#2B3654] rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${statusColors[game.status]}`}
                  style={{ width: `${game.progress}%` }}
                />
              </div>
            </div>
    
            {/* Last Updated */}
            {game.updatedAt && (
              <div className="mt-2 text-xs text-gray-500">
                Last updated: {new Date(game.updatedAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}