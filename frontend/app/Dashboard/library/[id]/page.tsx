// app/Dashboard/library/[id]/page.tsx
import { notFound } from 'next/navigation';
import { mockGames } from '../../../mocks/games';
import GameDetail from '../../../../app/components/GameDetails';

export default function GameDetailPage({ params }: { params: { id: string } }) {
  const game = mockGames.find(game => game.id === params.id);

  if (!game) {
    return notFound();
  }

  return <GameDetail game={game} />;
}