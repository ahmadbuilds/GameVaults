'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Game } from '../../../../types/game';
import GameEditForm from '../../../../components/GameEditForm';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function GameEditPage({ params }: PageProps) {
  
  const { id: gameId } = use(params);
  
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    const fetchGame = async () => {
      if (!user?.primaryEmailAddress?.emailAddress) return;
      
      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/AddGame/GetGamesByEmail?email=${encodeURIComponent(user.primaryEmailAddress.emailAddress)}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch games');
        }
        
        const data = await response.json();
        if (data.success) {
          const foundGame = data.data.find((g: Game) => g._id === gameId);
          if (foundGame) {
            setGame(foundGame);
          } else {
            throw new Error('Game not found');
          }
        } else {
          throw new Error(data.error || 'Unknown error');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGame();
  }, [gameId, user]);

  const handleSave = async (updatedGame: Game) => {
    if (!user?.primaryEmailAddress?.emailAddress || !game) return;
    
    try {
      setIsSaving(true);
      
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/AddGame/UpdateGame/${encodeURIComponent(game.title)}/${encodeURIComponent(user.primaryEmailAddress.emailAddress)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedGame),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update game');
      }

      const data = await response.json();
      
      
      setGame(data);
      
      
      router.push(`/Dashboard/library/${gameId}`);
      
    } catch (err) {
      console.error('Error updating game:', err);
      alert(`Failed to update game: ${err instanceof Error ? err.message : 'Please try again.'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/Dashboard/library/${gameId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F1419] to-[#1A1F2E] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <div className="text-white">Loading game data...</div>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F1419] to-[#1A1F2E] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Error: {error || 'Game not found'}</div>
          <button
            onClick={() => router.push('/Dashboard/library')}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {isSaving && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1E2A45] rounded-lg p-6 flex items-center gap-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
            <span className="text-white">Saving changes...</span>
          </div>
        </div>
      )}
      
      <GameEditForm
        game={game}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}