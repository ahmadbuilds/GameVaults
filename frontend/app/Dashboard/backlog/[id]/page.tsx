// app/Dashboard/backlog/platforms/[id]/page.tsx
'use client';

import { notFound } from 'next/navigation';
import { mockGames } from '../../../../app/mocks/games';
import GameCard from '../../../../app/components/GameCard';

export default function PlatformDetailPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch platforms from your data
  const mockPlatforms = [
    { id: '1', name: 'PC' },
    { id: '2', name: 'PlayStation 5' },
    { id: '3', name: 'Xbox Series X' },
    { id: '4', name: 'Nintendo Switch' },
  ];
  
  const platform = mockPlatforms.find(p => p.id === params.id);
  
  if (!platform) {
    return notFound();
  }

  // Filter games for this platform
  const platformGames = mockGames.filter(game => game.platform === platform.name);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => window.history.back()} className="bg-[#1E2A45] hover:bg-[#2F3B5C] p-2 rounded-lg transition-all duration-300">
          {/* Back icon */}
        </button>
        <h1 className="text-2xl font-bold text-white">{platform.name} Games</h1>
      </div>

      {platformGames.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {platformGames.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          No games found for this platform
        </div>
      )}
    </div>
  );
}