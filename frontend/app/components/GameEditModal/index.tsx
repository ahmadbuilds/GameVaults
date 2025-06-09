// components/GameEditModal/index.tsx
'use client';

import { useState } from 'react';
import { Game } from '../../mocks/games';
import GameEditForm from '../GameEditForm';
import { motion } from 'framer-motion';
import { redirect } from 'next/navigation';

interface GameEditModalProps {
  game: Game;
  onSave: (updatedGame: Game) => void;
}

export default function GameEditModal({ game, onSave }: GameEditModalProps) {


  const onClose=()=>{
    redirect('/dashboard/library');
  }
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <GameEditForm 
          game={game} 
          onSave={onSave}
          onCancel={onClose}
        />
      </motion.div>
    </div>
  );
}