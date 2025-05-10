"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import BacklogBreakdown from "../../../app/components/BacklogBreakdown";
import PlatformSummary from "../../../app/components/PlatformSummary";

export default function BacklogPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    )},
    { id: "priorities", label: "Priorities", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z" clipRule="evenodd" />
      </svg>
    )},
    { id: "wishlist", label: "Wishlist", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
      </svg>
    )},
    { id: "reviews", label: "Reviews", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
      </svg>
    )},
    { id: "roulette", label: "Backlog Roulette", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
      </svg>
    )}
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-6"
    >
      {/* Header with Search Integration */}
      <div className={`flex flex-col ${isSearchFocused ? 'md:flex-col' : 'md:flex-row'} gap-4 justify-between items-start md:items-center transition-all duration-300`}>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold text-white"
        >
          Backlog Dashboard
          <div className="mt-1 h-1 w-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`${isSearchFocused ? 'w-full' : 'w-full md:w-1/3'} transition-all duration-300`}
        >
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search your backlog..."
              className="w-full bg-[#1E2A45] border border-[#3A4B72]/50 focus:border-blue-400 rounded-lg py-2 px-4 text-white outline-none transition-all duration-300"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </motion.div>
      </div>
      
      {/* Tab Navigation */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-wrap gap-2"
      >
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            variants={item}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
              activeTab === tab.id 
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium shadow-lg shadow-blue-500/20' 
                : 'bg-[#1E2A45] hover:bg-[#2F3B5C] text-gray-300 hover:text-white'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span>{tab.label}</span>
          </motion.button>
        ))}
      </motion.div>
      
      {activeTab === "dashboard" && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Backlog Breakdown */}
            <BacklogBreakdown />
            
            {/* Platform Summary */}
            <PlatformSummary />
          </div>
          
         
        </>
      )}
      
      {activeTab !== "dashboard" && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#2B3654] to-[#1E2A45] rounded-xl p-8 text-center border border-[#3A4B72]/30"
        >
          <div className="inline-flex items-center justify-center p-4 bg-purple-500/10 rounded-full mb-4">
            {tabs.find(tab => tab.id === activeTab)?.icon}
          </div>
          <h2 className="text-xl font-bold text-white mb-2">{tabs.find(tab => tab.id === activeTab)?.label}</h2>
          <p className="text-gray-400 mb-4">
            This section is under development. The {tabs.find(tab => tab.id === activeTab)?.label.toLowerCase()} feature will be available soon!
          </p>
          <button className="bg-[#1E2A45] hover:bg-[#2F3B5C] text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-all duration-300">
            Return to Dashboard
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};