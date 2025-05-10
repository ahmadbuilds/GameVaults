// app/Dashboard/library/page.tsx
"use client";

import { motion } from "framer-motion";
import GameList from "../../../app/components/GameList";

export default function LibraryPage() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-6"
    >
      <motion.h1 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-3xl font-bold text-white"
      >
        Game Library
        <div className="mt-1 h-1 w-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"></div>
      </motion.h1>
      
      <GameList />
    </motion.div>
  );
}