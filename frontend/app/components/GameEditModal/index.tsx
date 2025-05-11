// components/GameEditModal/index.tsx
'use client';

import { useState } from 'react';
import { Game } from '../../mocks/games';
import GameEditForm from '../GameEditForm';
import { motion } from 'framer-motion';

interface GameEditModalProps {
  game: Game;
  onClose: () => void;
  onSave: (updatedGame: Game) => void;
}

export default function GameEditModal({ game, onClose, onSave }: GameEditModalProps) {
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