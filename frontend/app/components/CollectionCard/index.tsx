import { motion } from 'framer-motion';
import Link from 'next/link';


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

interface CollectionCardProps {
  collection: GameCollection;
}

export default function CollectionCard({ collection }: CollectionCardProps) {
  

  return (
    <Link href={`/Dashboard/list/${collection._id}`}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        className="bg-[#1E2A45]/80 hover:bg-[#1E2A45] border border-[#3A4B72]/30 rounded-xl p-4 transition-all duration-300 shadow-md hover:shadow-lg overflow-hidden cursor-pointer"
      >
        <div className="flex flex-col h-full">
          {/* Cover Image */}
          <div className="relative h-32 rounded-lg overflow-hidden bg-gradient-to-br from-[#2B3654] to-[#1E2A45] mb-4">
            {collection.media.length > 0 ? (
              <img 
                src={collection.media[0].url} 
                alt={collection.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
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

            

            
          </div>
        </div>
      </motion.div>
    </Link>
  );
}