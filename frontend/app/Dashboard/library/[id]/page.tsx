import GameDetail from '../../../components/GameDetails';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function GameDetailPage({ params }: PageProps) {
  return <GameDetail params={params} />;
}