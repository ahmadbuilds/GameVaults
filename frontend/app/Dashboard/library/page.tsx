"use client";

import { motion } from "framer-motion";
import GameList from "../../components/GameList";
import Link from 'next/link';
import { useUser } from "@clerk/nextjs";

export default function ListPage() {
  const { user } = useUser();
  const userEmail = user?.emailAddresses?.[0]?.emailAddress;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-6"
    >
      <div className="flex justify-between items-center">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold text-white"
        >
          Your Game Library
          <div className="mt-1 h-1 w-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"></div>
        </motion.h1>
        
        <Link
          href="/Dashboard/library/add"
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Game
        </Link>
      </div>
      
      {userEmail && <GameList userEmail={userEmail} />}
    </motion.div>
  );
}