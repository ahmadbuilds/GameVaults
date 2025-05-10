// components/CollectionCard/index.tsx
import { motion } from 'framer-motion';
import { GameCollection } from '../../mocks/lists';
import { mockGames } from '../../mocks/games';

interface CollectionCardProps {
  collection: GameCollection;
}

export default function CollectionCard({ collection }: CollectionCardProps) {
  // Get sample games for preview
  const sampleGames = mockGames.filter(game => 
    collection.games.slice(0, 3).includes(game.id)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-[#1E2A45]/80 hover:bg-[#1E2A45] border border-[#3A4B72]/30 rounded-xl p-4 transition-all duration-300 shadow-md hover:shadow-lg overflow-hidden"
    >
      <div className="flex flex-col h-full">
        {/* Cover Image */}
        <div className="relative h-32 rounded-lg overflow-hidden bg-gradient-to-br from-[#2B3654] to-[#1E2A45] mb-4">
          {collection.coverImage ? (
            <img 
              src={collection.coverImage} 
              alt={collection.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          <div className="absolute bottom-2 right-2 bg-[#1E2A45]/90 text-white text-xs px-2 py-1 rounded-md">
            {collection.games.length} games
          </div>
        </div>

        {/* Collection Info */}
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-white">{collection.name}</h3>
            {!collection.isPublic && (
              <span className="text-xs bg-[#2B3654] text-gray-400 px-2 py-1 rounded-md">
                Private
              </span>
            )}
          </div>

          {collection.description && (
            <p className="text-sm text-gray-400 mt-1 line-clamp-2">
              {collection.description}
            </p>
          )}

          {/* Tags */}
          {collection.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {collection.tags.slice(0, 3).map(tag => (
                <span 
                  key={tag} 
                  className="text-xs bg-[#2B3654]/50 text-gray-300 px-2 py-1 rounded-md"
                >
                  {tag}
                </span>
              ))}
              {collection.tags.length > 3 && (
                <span className="text-xs bg-[#2B3654]/50 text-gray-400 px-2 py-1 rounded-md">
                  +{collection.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Game Previews */}
          {sampleGames.length > 0 && (
            <div className="mt-4 pt-3 border-t border-[#3A4B72]/30">
              <h4 className="text-xs text-gray-500 mb-2">Contains:</h4>
              <div className="flex gap-2">
                {sampleGames.map(game => (
                  <div key={game.id} className="w-8 h-8 rounded-md overflow-hidden bg-[#2B3654]">
                    {game.coverImage ? (
                      <img 
                        src={game.coverImage} 
                        alt={game.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
                {collection.games.length > 3 && (
                  <div className="w-8 h-8 rounded-md bg-[#2B3654] flex items-center justify-center text-xs text-gray-400">
                    +{collection.games.length - 3}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}