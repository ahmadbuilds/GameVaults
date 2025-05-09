"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

// This would normally come from your API or service
const backlogData = {
  totalGames: 29,
  backlog2025: 12,
  status: [
    { id: 1, label: "Unplayed", count: 1, percentage: 4.0, color: "bg-blue-400" },
    { id: 9, label: "Unfinished", count: 9, percentage: 36.0, color: "bg-red-500" },
    { id: 7, label: "Beaten", count: 7, percentage: 28.0, color: "bg-green-500" },
    { id: 8, label: "Completed", count: 8, percentage: 32.0, color: "bg-yellow-500" },
    { id: 4, label: "Endless", count: 4, percentage: 0, color: "bg-purple-500" },
    { id: 0, label: "None", count: 0, percentage: 0, color: "bg-gray-400" }
  ]
};

const BacklogBreakdown = () => {
  const [isHovered, setIsHovered] = useState(null);
  
  const activeBacklog = backlogData.status.slice(0, 3).reduce((acc, status) => acc + status.count, 0);
  const activePercentage = (activeBacklog / backlogData.totalGames) * 100;

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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
          </span>
          Backlog Breakdown
        </h2>
        <button className="text-gray-300 hover:text-white bg-[#1E2A45] hover:bg-[#2F3B5C] p-2 rounded-lg transition-all duration-300">
          <svg 
            className="w-5 h-5" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" 
              clipRule="evenodd" 
            />
          </svg>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Total Games Circle */}
        <div className="flex flex-col items-center justify-center">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative w-44 h-44"
          >
            {/* Circle background - glow effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 opacity-20 blur-md"></div>
            
            {/* Main circle */}
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
                  <span>Updated today</span>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* 2025 Backlog Small Circle */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            whileHover={{ scale: 1.1 }}
            className="relative w-28 h-28 mt-6"
          >
            {/* Circle background */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/30 to-cyan-400/30 blur-sm"></div>
            
            {/* Inner circle with count */}
            <div className="absolute inset-1 rounded-full bg-[#1E2A45] flex flex-col items-center justify-center border border-blue-400/20">
              <span className="text-xs text-gray-300">2025 Backlog</span>
              <div className="flex items-center">
                <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-3xl font-bold text-blue-400">{backlogData.backlog2025}</span>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Status Breakdown */}
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
                Active Backlog
              </span>
              <span className="font-medium text-green-400">{activeBacklog} · {activePercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full h-4 bg-[#121928] rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${activePercentage}%` }}
                transition={{ delay: 0.3, duration: 1 }}
                className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
              ></motion.div>
            </div>
          </motion.div>
          
          {/* Status bars */}
          {backlogData.status.map((status, index) => (
            <motion.div 
              key={status.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
              onMouseEnter={() => setIsHovered(status.id)}
              onMouseLeave={() => setIsHovered(null)}
              className={`flex items-center ${isHovered === status.id ? 'scale-[1.02]' : ''} transition-all duration-300`}
            >
              <div className="w-8 text-center text-sm font-medium text-gray-300">{status.count}</div>
              <div className={`w-8 h-8 mx-2 rounded-lg flex items-center justify-center ${status.color} shadow-lg shadow-${status.color.split('-')[1]}-500/20`}>
                <span className="text-xs font-bold text-white">{status.id}</span>
              </div>
              <div className="flex-1">
                <div className="h-8 rounded-lg overflow-hidden bg-[#121928] shadow-inner">
                  {status.percentage > 0 && (
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${status.percentage}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                      className={`h-full ${status.color} rounded-r-lg`}
                    >
                      <div className="px-3 h-full flex items-center">
                        <span className="text-xs font-medium text-white truncate">
                          {status.label} · {status.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </motion.div>
                  )}
                  {status.percentage === 0 && (
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '100px' }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                      className={`h-full ${status.color} w-24 rounded-r-lg`}
                    >
                      <div className="px-3 h-full flex items-center">
                        <span className="text-xs font-medium text-white">
                          {status.label}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default BacklogBreakdown;