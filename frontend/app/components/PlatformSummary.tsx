"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";


interface Game {
  id: string;
  title: string;
  platform: string;
  status: 'backlog' | 'playing' | 'completed' | 'abandoned';
  genre?: string;
  releaseDate?: string;
  rating?: number;
}

interface UserPlatform {
  id: string;
  name: string;
  icon?: string;
  gamesCount?: number;
  userId: string;
  createdAt?: string;
}

interface PlatformData {
  id: number;
  platform: string;
  icon: string;
  backlog: number;
  playing: number;
  completed: number;
  abandoned: number;
  total: number;
  gamesCount: number;
}

interface StatusConfig {
  name: string;
  color: string;
  textColor: string;
  icon: string;
}

interface PlatformIcons {
  [key: string]: string;
}

const PlatformSummary: React.FC = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [platformData, setPlatformData] = useState<PlatformData[]>([]);
  const [userPlatforms, setUserPlatforms] = useState<UserPlatform[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<number | null>(null);

  const statusConfig: StatusConfig[] = [
    { name: "Backlog", color: "bg-red-500", textColor: "text-red-500", icon: "📚" },
    { name: "Playing", color: "bg-blue-500", textColor: "text-blue-500", icon: "🎮" },
    { name: "Completed", color: "bg-green-500", textColor: "text-green-500", icon: "🌟" },
    { name: "Abandoned", color: "bg-gray-500", textColor: "text-gray-500", icon: "🚫" }
  ];

  // Platform icons mapping
  const platformIcons: PlatformIcons = {
    "Epic Games Launcher": "🎮",
    "Steam": "🎲",
    "PlayStation": "🎯",
    "Xbox": "🎮",
    "Nintendo Switch": "🕹️",
    "PC": "💻",
    "Mobile": "📱",
    "Default": "🎮"
  };

  const fetchUserPlatforms = async (userEmail: string): Promise<UserPlatform[]> => {
    try {
      const response = await fetch(`http://localhost:4000/platform/email?email=${encodeURIComponent(userEmail)}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch platforms: ${response.status}`);
      }

      const platforms: UserPlatform[] = await response.json();
      
      
      if (!Array.isArray(platforms)) {
        console.warn('Platforms response is not an array:', platforms);
        return [];
      }
      
      setUserPlatforms(platforms);
      return platforms;
    } catch (err) {
      console.error('Error fetching user platforms:', err);
      return [];
    }
  };

  const fetchUserGames = async (): Promise<void> => {
    if (!isLoaded || !isSignedIn || !user?.primaryEmailAddress?.emailAddress) {
      setError("User not authenticated or email not available");
      setLoading(false);
      return;
    }

    const userEmail = user.primaryEmailAddress.emailAddress;

    try {
      setLoading(true);
      
     
      const [gamesResponse, platforms] = await Promise.all([
        fetch(`http://localhost:4000/AddGame/UserGames/${encodeURIComponent(userEmail)}`),
        fetchUserPlatforms(userEmail)
      ]);
      
      if (!gamesResponse.ok) {
        throw new Error(`Failed to fetch games: ${gamesResponse.status}`);
      }

      const games: Game[] = await gamesResponse.json();
      
     
      const gamesArray = Array.isArray(games) ? games : [];
      
      
      const platformSummary = processPlatformData(gamesArray, platforms);
      setPlatformData(platformSummary);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching user games:', err);
      setError(err?.message || 'An error occurred while fetching games');
    } finally {
      setLoading(false);
    }
  };

  const processPlatformData = (games: Game[], platforms: UserPlatform[] = []): PlatformData[] => {
    const platformMap = new Map<string, PlatformData>();

    
    const platformsArray = Array.isArray(platforms) ? platforms : [];

    
    platformsArray.forEach((platform, index) => {
     
      if (platform && typeof platform === 'object' && platform.name) {
        platformMap.set(platform.name, {
          id: index + 1,
          platform: platform.name,
          icon: platform.icon || platformIcons[platform.name] || platformIcons["Default"],
          backlog: 0,
          playing: 0,
          completed: 0,
          abandoned: 0,
          total: 0,
          gamesCount: platform.gamesCount || 0
        });
      }
    });

    
    const gamesArray = Array.isArray(games) ? games : [];

   
    gamesArray.forEach(game => {
     
      if (!game || typeof game !== 'object') return;
      
      const platform = game.platform || 'Unknown';
      const status = game.status || 'backlog';

      if (!platformMap.has(platform)) {
        
        platformMap.set(platform, {
          id: platformMap.size + 1,
          platform: platform,
          icon: platformIcons[platform] || platformIcons["Default"],
          backlog: 0,
          playing: 0,
          completed: 0,
          abandoned: 0,
          total: 0,
          gamesCount: 0
        });
      }

      const platformData = platformMap.get(platform);
      if (!platformData) return; // Type guard
      
     
      switch (status.toLowerCase()) {
        case 'backlog':
          platformData.backlog++;
          break;
        case 'playing':
          platformData.playing++;
          break;
        case 'completed':
          platformData.completed++;
          break;
        case 'abandoned':
          platformData.abandoned++;
          break;
        default:
          platformData.backlog++;
      }
      
      platformData.total++;
    });

    
    return Array.from(platformMap.values())
      .filter(platform => platform.total > 0)
      .sort((a, b) => b.total - a.total);
  };

  useEffect(() => {
    if (isLoaded && isSignedIn && user?.primaryEmailAddress?.emailAddress) {
      fetchUserGames();
    } else if (isLoaded && !isSignedIn) {
      setError("Please sign in to view your platform summary");
      setLoading(false);
    }
  }, [isLoaded, isSignedIn, user]);

 
  if (!isLoaded) {
    return (
      <div className="bg-gradient-to-br from-[#2B3654] to-[#1E2A45] rounded-xl p-6 shadow-lg border border-[#3A4B72]/30">
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
          <span className="ml-3 text-white">Loading user data...</span>
        </div>
      </div>
    );
  }

  
  if (!isSignedIn) {
    return (
      <div className="bg-gradient-to-br from-[#2B3654] to-[#1E2A45] rounded-xl p-6 shadow-lg border border-[#3A4B72]/30">
        <div className="flex items-center justify-center h-48 flex-col">
          <div className="text-purple-400 text-6xl mb-4">🔐</div>
          <div className="text-white text-lg mb-2">Authentication Required</div>
          <div className="text-gray-400 text-center">Please sign in to view your platform summary</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-[#2B3654] to-[#1E2A45] rounded-xl p-6 shadow-lg border border-[#3A4B72]/30">
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
          <span className="ml-3 text-white">Loading platform data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-[#2B3654] to-[#1E2A45] rounded-xl p-6 shadow-lg border border-[#3A4B72]/30">
        <div className="flex items-center justify-center h-48 flex-col">
          <div className="text-red-400 text-lg mb-2">⚠️ Error</div>
          <div className="text-white text-center">{error}</div>
          <button 
            onClick={fetchUserGames}
            className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (platformData.length === 0 && !loading) {
    return (
      <div className="bg-gradient-to-br from-[#2B3654] to-[#1E2A45] rounded-xl p-6 shadow-lg border border-[#3A4B72]/30">
        <div className="flex items-center justify-center h-48 flex-col">
          <div className="text-purple-400 text-6xl mb-4">🎮</div>
          <div className="text-white text-lg mb-2">No Games Found</div>
          <div className="text-gray-400 text-center">Start adding games to see your platform summary!</div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-[#2B3654] to-[#1E2A45] rounded-xl p-6 shadow-lg border border-[#3A4B72]/30"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white flex items-center">
          <span className="mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
            </svg>
          </span>
          Platform Summary
        </h2>
      </div>
      
      {/* Platform Legend */}
      <div className="mb-4 flex items-center justify-center space-x-4">
        {statusConfig.map((status, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="flex items-center text-sm"
          >
            <div className={`w-3 h-3 rounded-full ${status.color} mr-1`}></div>
            <span className="text-gray-300">{status.name}</span>
          </motion.div>
        ))}
      </div>
      
      <div className="overflow-hidden rounded-lg border border-[#3A4B72]/30">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#1E2A45] text-gray-400 text-xs">
                <th className="text-left py-3 px-4">Platform</th>
                <th className="text-center py-3 px-2 w-1/6">
                  <div className="bg-red-500 w-6 h-6 rounded-md mx-auto flex items-center justify-center">
                    <span className="text-white text-xs font-bold">BL</span>
                  </div>
                </th>
                <th className="text-center py-3 px-2 w-1/6">
                  <div className="bg-blue-500 w-6 h-6 rounded-md mx-auto flex items-center justify-center">
                    <span className="text-white text-xs font-bold">P</span>
                  </div>
                </th>
                <th className="text-center py-3 px-2 w-1/6">
                  <div className="bg-green-500 w-6 h-6 rounded-md mx-auto flex items-center justify-center">
                    <span className="text-white text-xs font-bold">C</span>
                  </div>
                </th>
                <th className="text-center py-3 px-2 w-1/6">
                  <div className="bg-gray-500 w-6 h-6 rounded-md mx-auto flex items-center justify-center">
                    <span className="text-white text-xs font-bold">A</span>
                  </div>
                </th>
                <th className="text-right py-3 px-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {platformData.map((platform, index) => (
                <motion.tr 
                  key={platform.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ backgroundColor: "rgba(58, 75, 114, 0.3)" }}
                  onClick={() => setSelectedPlatform(selectedPlatform === platform.id ? null : platform.id)}
                  className={`text-white border-b border-[#3A4B72]/30 cursor-pointer transition-colors duration-200 ${selectedPlatform === platform.id ? 'bg-[#3A4B72]/40' : ''}`}
                >
                  <td className="py-4 px-4 text-left">
                    <div className="flex items-center">
                      <span className="mr-2 text-lg">{platform.icon}</span>
                      <span className="font-medium">{platform.platform}</span>
                    </div>
                  </td>
                  <td className="py-4 px-2 text-center">
                    <span className="inline-block px-2 py-1 bg-red-500/10 text-red-400 rounded-md font-medium">
                      {platform.backlog}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-center">
                    <span className="inline-block px-2 py-1 bg-blue-500/10 text-blue-400 rounded-md font-medium">
                      {platform.playing}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-center">
                    <span className="inline-block px-2 py-1 bg-green-500/10 text-green-400 rounded-md font-medium">
                      {platform.completed}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-center">
                    <span className="inline-block px-2 py-1 bg-gray-500/10 text-gray-400 rounded-md font-medium">
                      {platform.abandoned}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                      {platform.total} Games
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Platform Details - shown when a platform is selected */}
        {selectedPlatform && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-[#1E2A45]/70 p-4"
          >
            {platformData.filter(p => p.id === selectedPlatform).map(platform => (
              <div key={platform.id} className="flex flex-col">
                <div className="mb-2 text-sm text-gray-300">
                  <span className="font-medium text-white">{platform.platform}</span> breakdown:
                </div>
                <div className="h-4 w-full bg-[#121928] rounded-full overflow-hidden flex">
                  {platform.backlog > 0 && (
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(platform.backlog / platform.total) * 100}%` }}
                      className="h-full bg-red-500"
                    ></motion.div>
                  )}
                  {platform.playing > 0 && (
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(platform.playing / platform.total) * 100}%` }}
                      className="h-full bg-blue-500"
                    ></motion.div>
                  )}
                  {platform.completed > 0 && (
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(platform.completed / platform.total) * 100}%` }}
                      className="h-full bg-green-500"
                    ></motion.div>
                  )}
                  {platform.abandoned > 0 && (
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(platform.abandoned / platform.total) * 100}%` }}
                      className="h-full bg-gray-500"
                    ></motion.div>
                  )}
                </div>
                <div className="mt-2 grid grid-cols-4 gap-2 text-xs text-center">
                  <div>
                    <span className="text-red-400 font-medium">{((platform.backlog / platform.total) * 100).toFixed(1)}%</span> Backlog
                  </div>
                  <div>
                    <span className="text-blue-400 font-medium">{((platform.playing / platform.total) * 100).toFixed(1)}%</span> Playing
                  </div>
                  <div>
                    <span className="text-green-400 font-medium">{((platform.completed / platform.total) * 100).toFixed(1)}%</span> Completed
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium">{((platform.abandoned / platform.total) * 100).toFixed(1)}%</span> Abandoned
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
      
      {/* Summary Statistics */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="bg-[#1E2A45]/60 p-3 rounded-lg border border-[#3A4B72]/20">
          <div className="text-xs text-gray-400">Platforms</div>
          <div className="text-xl font-bold text-white">{platformData.length}</div>
        </div>
        <div className="bg-[#1E2A45]/60 p-3 rounded-lg border border-[#3A4B72]/20">
          <div className="text-xs text-gray-400">Total Games</div>
          <div className="text-xl font-bold text-white">
            {platformData.reduce((sum, platform) => sum + platform.total, 0)}
          </div>
        </div>
        <div className="bg-[#1E2A45]/60 p-3 rounded-lg border border-[#3A4B72]/20">
          <div className="text-xs text-gray-400">Completion Rate</div>
          <div className="text-xl font-bold text-green-400">
            {platformData.length > 0 ? ((platformData.reduce((sum, platform) => sum + platform.completed, 0) / 
               platformData.reduce((sum, platform) => sum + platform.total, 0)) * 100).toFixed(1) : 0}%
          </div>
        </div>
        <div className="bg-[#1E2A45]/60 p-3 rounded-lg border border-[#3A4B72]/20">
          <div className="text-xs text-gray-400">Backlog</div>
          <div className="text-xl font-bold text-red-400">
            {platformData.reduce((sum, platform) => sum + platform.backlog, 0)}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PlatformSummary;