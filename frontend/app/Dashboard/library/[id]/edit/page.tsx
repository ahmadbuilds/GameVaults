// app/Dashboard/library/[id]/edit/page.tsx
'use client';

import { useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { Game } from '../../../../../app/mocks/games';
import { mockGames } from '../../../../../app/mocks/games';
import GameEditForm from '../../../../../app/components/GameEditForm';

export default function GameEditPage({ params }: { params: { id: string } }) {
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const game = mockGames.find(g => g.id === params.id);

  if (!game) {
    return notFound();
  }

  const handleSave = (updatedGame: Game) => {
    setIsSaving(true);
    // In a real app, you would save to your database here
    console.log('Saved:', updatedGame);
    
    // For mock data, find and update the game
    const index = mockGames.findIndex(g => g.id === params.id);
    if (index !== -1) {
      mockGames[index] = updatedGame;
    }
    
    // Redirect back to the game page
    router.push(`/Dashboard/library/${game.id}`);
  };

  const handleCancel = () => {
    router.push(`/Dashboard/library/${game.id}`);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <GameEditForm 
        game={game}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}