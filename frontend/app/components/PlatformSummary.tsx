"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

// This would normally come from your API or service
const platformData = [
  {
    id: 1,
    platform: "Epic Games Launcher",
    icon: "🎮",
    unfinished: 9,
    beaten: 7,
    completed: 8,
    endless: 4,
    total: 29
  },
  {
    id: 2,
    platform: "Steam",
    icon: "🎲",
    unfinished: 5,
    beaten: 3,
    completed: 2,
    endless: 1,
    total: 11
  },
  {
    id: 3,
    platform: "PlayStation",
    icon: "🎯",
    unfinished: 3,
    beaten: 2,
    completed: 4,
    endless: 0,
    total: 9
  }
];

const PlatformSummary = () => {
    const [selectedPlatform, setSelectedPlatform] = useState<number | null>(null);
  
  const statusConfig = [
    { name: "Unfinished", color: "bg-red-500", textColor: "text-red-500", icon: "🚫" },
    { name: "Beaten", color: "bg-green-500", textColor: "text-green-500", icon: "✅" },
    { name: "Completed", color: "bg-yellow-500", textColor: "text-yellow-500", icon: "🌟" },
    { name: "Endless", color: "bg-purple-500", textColor: "text-purple-500", icon: "♾️" }
  ];

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
                    <span className="text-white text-xs font-bold">U</span>
                  </div>
                </th>
                <th className="text-center py-3 px-2 w-1/6">
                  <div className="bg-green-500 w-6 h-6 rounded-md mx-auto flex items-center justify-center">
                    <span className="text-white text-xs font-bold">B</span>
                  </div>
                </th>
                <th className="text-center py-3 px-2 w-1/6">
                  <div className="bg-yellow-500 w-6 h-6 rounded-md mx-auto flex items-center justify-center">
                    <span className="text-white text-xs font-bold">C</span>
                  </div>
                </th>
                <th className="text-center py-3 px-2 w-1/6">
                  <div className="bg-purple-500 w-6 h-6 rounded-md mx-auto flex items-center justify-center">
                    <span className="text-white text-xs font-bold">E</span>
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
                      {platform.unfinished}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-center">
                    <span className="inline-block px-2 py-1 bg-green-500/10 text-green-400 rounded-md font-medium">
                      {platform.beaten}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-center">
                    <span className="inline-block px-2 py-1 bg-yellow-500/10 text-yellow-400 rounded-md font-medium">
                      {platform.completed}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-center">
                    <span className="inline-block px-2 py-1 bg-purple-500/10 text-purple-400 rounded-md font-medium">
                      {platform.endless}
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
                  {platform.unfinished > 0 && (
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(platform.unfinished / platform.total) * 100}%` }}
                      className="h-full bg-red-500"
                    ></motion.div>
                  )}
                  {platform.beaten > 0 && (
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(platform.beaten / platform.total) * 100}%` }}
                      className="h-full bg-green-500"
                    ></motion.div>
                  )}
                  {platform.completed > 0 && (
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(platform.completed / platform.total) * 100}%` }}
                      className="h-full bg-yellow-500"
                    ></motion.div>
                  )}
                  {platform.endless > 0 && (
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(platform.endless / platform.total) * 100}%` }}
                      className="h-full bg-purple-500"
                    ></motion.div>
                  )}
                </div>
                <div className="mt-2 grid grid-cols-4 gap-2 text-xs text-center">
                  <div>
                    <span className="text-red-400 font-medium">{((platform.unfinished / platform.total) * 100).toFixed(1)}%</span> Unfinished
                  </div>
                  <div>
                    <span className="text-green-400 font-medium">{((platform.beaten / platform.total) * 100).toFixed(1)}%</span> Beaten
                  </div>
                  <div>
                    <span className="text-yellow-400 font-medium">{((platform.completed / platform.total) * 100).toFixed(1)}%</span> Completed
                  </div>
                  <div>
                    <span className="text-purple-400 font-medium">{((platform.endless / platform.total) * 100).toFixed(1)}%</span> Endless
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
            {((platformData.reduce((sum, platform) => sum + platform.completed, 0) / 
               platformData.reduce((sum, platform) => sum + platform.total, 0)) * 100).toFixed(1)}%
          </div>
        </div>
        <div className="bg-[#1E2A45]/60 p-3 rounded-lg border border-[#3A4B72]/20">
          <div className="text-xs text-gray-400">Backlog</div>
          <div className="text-xl font-bold text-red-400">
            {platformData.reduce((sum, platform) => sum + platform.unfinished, 0)}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PlatformSummary;