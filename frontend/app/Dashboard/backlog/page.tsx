"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import BacklogBreakdown from "../../../app/components/BacklogBreakdown";
import PlatformSummary from "../../../app/components/PlatformSummary";
import PlatformsList from "../../../app/components/PlatformsList";

export default function BacklogPage() {
  const [activeTab, setActiveTab] = useState("summary");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = [
    { id: "summary", label: "Summary", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    )},
    { id: "platforms", label: "Platforms", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
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
        
        {activeTab === "platforms" && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`${isSearchFocused ? 'w-full' : 'w-full md:w-1/3'} transition-all duration-300`}
          >
            <form onSubmit={handleSearchSubmit} className="relative">
              <input 
                type="text" 
                placeholder="Search your Platform..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full bg-[#1E2A45] border border-[#3A4B72]/50 focus:border-blue-400 rounded-lg py-2 px-4 text-white outline-none transition-all duration-300"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              <button 
                type="submit"
                title="submit"
                className="cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </button>
            </form>
          </motion.div>
        )}
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
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer ${
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
      
      {activeTab === "summary" && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BacklogBreakdown />
            <PlatformSummary />
          </div>
        </>
      )}

      {activeTab === "platforms" && (
        <PlatformsList searchQuery={searchQuery} />
      )}

      {!["summary", "platforms"].includes(activeTab) && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#2B3654] to-[#1E2A45] rounded-xl p-8 text-center border border-[#3A4B72]/30"
        >
         
        </motion.div>
      )}
    </motion.div>
  );
}