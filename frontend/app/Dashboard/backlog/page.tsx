"use client";

import React from "react";
import BacklogBreakdown from "../../../app/components/BacklogBreakdown";
import PlatformSummary from "../../../app/components/PlatformSummary";
import BacklogSearch from "../../../app/components/BacklogSearch";

export default function BacklogPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-white mb-2">Backlog Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Backlog Breakdown */}
        <BacklogBreakdown />
        
        {/* Platform Summary */}
        <PlatformSummary />
      </div>
      
      {/* Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <button className="bg-[#202020] hover:bg-[#303030] transition-colors text-white py-3 px-4 rounded text-center">
          Priorities
        </button>
        <button className="bg-[#202020] hover:bg-[#303030] transition-colors text-white py-3 px-4 rounded text-center">
          Wishlist
        </button>
        <button className="bg-[#202020] hover:bg-[#303030] transition-colors text-white py-3 px-4 rounded text-center">
          Reviews
        </button>
        <button className="bg-[#202020] hover:bg-[#303030] transition-colors text-white py-3 px-4 rounded text-center">
          Backlog Roulette
        </button>
      </div>
      
      {/* Search Area */}
      <div className="w-full">
        <BacklogSearch />
      </div>
      
      {/* Game List would go here */}
      <div className="bg-[#202020] p-4 rounded">
        <h2 className="text-lg font-semibold mb-4">Your Backlog Games</h2>
        <p className="text-gray-400">
          Your game list will appear here. This component would be populated with 
          your backlog games.
        </p>
      </div>
    </div>
  );
}