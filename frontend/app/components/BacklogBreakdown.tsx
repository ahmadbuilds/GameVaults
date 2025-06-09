  "use client";

  import React, { useState, useEffect } from "react";
  import { motion } from "framer-motion";
  import { useUser } from "@clerk/nextjs";

  interface Game {
    _id: string;
    title: string;
    status: string;
    userEmail: string;
  }

  interface StatusData {
    id: string;
    label: string;
    count: number;
    percentage: number;
    color: string;
  }

  interface BacklogData {
    totalGames: number;
    activeBacklog: number;
    status: StatusData[];
  }

  const BacklogBreakdown = () => {
    const { user, isLoaded } = useUser();
    const [backlogData, setBacklogData] = useState<BacklogData>({
      totalGames: 0,
      activeBacklog: 0,
      status: []
    });
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

   
    const statusLabels = {
      completed: { label: "Completed", color: "bg-green-500", shortLabel: "C" },
      backlog: { label: "Backlog", color: "bg-blue-400", shortLabel: "B" },
      playing: { label: "Playing", color: "bg-orange-500", shortLabel: "P" },
      abandoned: { label: "Abandoned", color: "bg-red-500", shortLabel: "A" }
    };

    const fetchUserGames = async () => {
      if (!user?.emailAddresses[0]?.emailAddress) {
        setError('User email not available');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const userEmail = user.emailAddresses[0].emailAddress;
        const response = await fetch(`http://localhost:4000/AddGame/UserGames/${encodeURIComponent(userEmail)}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch games: ${response.statusText}`);
        }

        const games: Game[] = await response.json();
        
       
        const processedData = processGamesData(games);
        setBacklogData(processedData);

      } catch (err) {
        console.error('Error fetching user games:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch games data');
      } finally {
        setLoading(false);
      }
    };

    const processGamesData = (games: Game[]): BacklogData => {
      const totalGames = games.length;
      
     
      const statusCounts: { [key: string]: number } = {
        completed: 0,
        backlog: 0,
        playing: 0,
        abandoned: 0
      };

      
      games.forEach(game => {
        const status = game.status?.toLowerCase() || 'backlog';
        if (statusCounts.hasOwnProperty(status)) {
          statusCounts[status]++;
        } else {
         
          statusCounts.backlog++;
        }
      });

      
      const activeBacklog = statusCounts.backlog + statusCounts.playing;

      
      const status: StatusData[] = Object.entries(statusLabels).map(([statusId, statusInfo]) => {
        const count = statusCounts[statusId] || 0;
        const percentage = totalGames > 0 ? (count / totalGames) * 100 : 0;

        return {
          id: statusId,
          label: statusInfo.label,
          count,
          percentage,
          color: statusInfo.color
        };
      }).sort((a, b) => b.count - a.count);

      return {
        totalGames,
        activeBacklog,
        status
      };
    };

    useEffect(() => {
      if (isLoaded && user) {
        fetchUserGames();
      }
    }, [isLoaded, user]);

   
    const activePercentage = backlogData.totalGames > 0 ? (backlogData.activeBacklog / backlogData.totalGames) * 100 : 0;

    if (!isLoaded) {
      return (
        <div className="bg-gradient-to-br from-[#2B3654] to-[#1E2A45] rounded-xl p-6 shadow-lg border border-[#3A4B72]/30">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
            <span className="ml-3 text-gray-300">Loading...</span>
          </div>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="bg-gradient-to-br from-[#2B3654] to-[#1E2A45] rounded-xl p-6 shadow-lg border border-[#3A4B72]/30">
          <div className="flex items-center justify-center h-64 text-center">
            <div className="text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
              </svg>
              <p className="text-lg font-medium">Please sign in to view your backlog</p>
            </div>
          </div>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="bg-gradient-to-br from-[#2B3654] to-[#1E2A45] rounded-xl p-6 shadow-lg border border-[#3A4B72]/30">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
            <span className="ml-3 text-gray-300">Loading your backlog...</span>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-gradient-to-br from-[#2B3654] to-[#1E2A45] rounded-xl p-6 shadow-lg border border-[#3A4B72]/30">
          <div className="flex items-center justify-center h-64 text-center">
            <div className="text-red-400">
              <svg className="w-12 h-12 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-lg font-medium">Error loading backlog</p>
              <p className="text-sm text-gray-400 mt-2">{error}</p>
              <button 
                onClick={fetchUserGames}
                className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
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
        {/* Header section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            <span className="mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
            </span>
            {user.firstName ? `${user.firstName}'s Backlog` : 'My Backlog Breakdown'}
          </h2>
          <button 
            onClick={fetchUserGames}
            className="text-blue-400 hover:text-blue-300 transition-colors"
            title="Refresh data"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Circles */}
          <div className="flex flex-col items-center justify-center">
            {/* Total Games Circle */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative w-44 h-44"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 opacity-20 blur-md"></div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-500/20 flex items-center justify-center">
                <div className="absolute inset-2 rounded-full bg-[#1E2A45] flex flex-col items-center justify-center">
                  <span className="text-sm text-gray-300 mb-1">Total Games</span>
                  <motion.span 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
                  >
                    {backlogData.totalGames}
                  </motion.span>
                  <div className="mt-2 flex items-center text-xs text-gray-400">
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-400 mr-1"></span>
                    <span>Updated now</span>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Active Backlog Small Circle */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              whileHover={{ scale: 1.1 }}
              className="relative w-28 h-28 mt-6"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/30 to-cyan-400/30 blur-sm"></div>
              <div className="absolute inset-1 rounded-full bg-[#1E2A45] flex flex-col items-center justify-center border border-blue-400/20">
                <span className="text-xs text-gray-300">Active Backlog</span>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-3xl font-bold text-blue-400">{backlogData.activeBacklog}</span>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Right Column - Status Breakdown */}
          <div className="space-y-4">
            {/* Active Backlog Summary */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-[#202840]/80 rounded-lg p-3 border border-[#3A4B72]/30"
            >
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-200 font-medium flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Active Progress
                </span>
                <span className="font-medium text-green-400">{backlogData.activeBacklog} · {activePercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full h-4 bg-[#121928] rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${activePercentage}%` }}
                  transition={{ delay: 0.3, duration: 1 }}
                  className="h-full bg-green-500 rounded-full"
                ></motion.div>
              </div>
            </motion.div>
            
            {/* Status bars */}
            {backlogData.status
              .filter(status => status.count > 0) 
              .map((status, index) => (
              <motion.div 
                key={status.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
                onMouseEnter={() => setHoveredId(status.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`flex items-center ${hoveredId === status.id ? 'scale-[1.02]' : ''} transition-all duration-300`}
              >
                <div className="w-8 text-center text-sm font-medium text-gray-300">{status.count}</div>
                <div className={`w-8 h-8 mx-2 rounded-lg flex items-center justify-center ${status.color} shadow-lg`}>
                  <span className="text-sm font-bold text-white">
                    {statusLabels[status.id as keyof typeof statusLabels]?.shortLabel || '?'}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="h-8 rounded-lg overflow-hidden bg-[#121928] shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(status.percentage, 15)}%` }} 
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                      className={`h-full ${status.color} rounded-r-lg`}
                    >
                      <div className="px-3 h-full flex items-center">
                        <span className="text-xs font-medium text-white truncate">
                          {status.label} · {status.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Empty state for no games */}
            {backlogData.totalGames === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center py-8 text-gray-400"
              >
                <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-lg font-medium mb-2">No games yet!</p>
                <p className="text-sm">Start adding games to see your backlog breakdown</p>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  export default BacklogBreakdown;