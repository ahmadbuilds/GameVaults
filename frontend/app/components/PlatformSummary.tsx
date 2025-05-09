"use client";

import React from "react";

// This would normally come from your API or service
const platformData = [
  {
    platform: "Epic Games Launcher",
    unfinished: 9,
    beaten: 7,
    completed: 8,
    endless: 4,
    total: 29
  }
  // You would add more platforms here
];

const PlatformSummary: React.FC = () => {
  return (
    <div className="bg-[#2B3654] rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Platform Summary</h2>
        <button className="text-gray-300 hover:text-white">
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
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-gray-400 text-xs">
              <th className="text-left pb-3">Platform</th>
              <th className="text-center pb-3 w-1/6">
                <div className="bg-red-500 w-6 h-6 rounded-full mx-auto"></div>
              </th>
              <th className="text-center pb-3 w-1/6">
                <div className="bg-gray-600 w-6 h-6 rounded-full mx-auto"></div>
              </th>
              <th className="text-center pb-3 w-1/6">
                <div className="bg-yellow-700 w-6 h-6 rounded-full mx-auto"></div>
              </th>
              <th className="text-center pb-3 w-1/6">
                <div className="bg-purple-500 w-6 h-6 rounded-full mx-auto"></div>
              </th>
              <th className="text-right pb-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {platformData.map((platform, index) => (
              <tr key={index} className="text-white border-t border-[#3A4B72]">
                <td className="py-3 text-left">{platform.platform}</td>
                <td className="py-3 text-center">{platform.unfinished}</td>
                <td className="py-3 text-center">{platform.beaten}</td>
                <td className="py-3 text-center">{platform.completed}</td>
                <td className="py-3 text-center">{platform.endless}</td>
                <td className="py-3 text-right font-bold">{platform.total} Total</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlatformSummary;