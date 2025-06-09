export interface GameCollection {
  id: string;
  name: string;
  description?: string;
  games: string[]; 
  tags: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  coverImage?: string;
}

export const mockCollections: GameCollection[] = [
  {
    id: '1',
    name: 'Open World Masterpieces',
    description: 'The best expansive open world games',
    games: ['1', '2', '5'],
    tags: ['open-world', 'rpg', 'adventure'],
    isPublic: true,
    createdAt: '2023-01-15',
    updatedAt: '2023-06-20',
    coverImage: '/images/open-world.jpg'
  },
  {
    id: '2',
    name: '2023 Playthroughs',
    description: 'Games I plan to complete this year',
    games: ['2', '3', '4'],
    tags: ['current', 'priority'],
    isPublic: false,
    createdAt: '2023-01-01',
    updatedAt: '2023-08-15'
  },
  {
    id: '3',
    name: 'Co-op Games',
    description: 'Great games to play with friends',
    games: ['3', '5'],
    tags: ['multiplayer', 'coop'],
    isPublic: true,
    createdAt: '2022-11-10',
    updatedAt: '2023-07-05',
    coverImage: '/images/coop-games.jpg'
  },
  {
    id: '4',
    name: 'Retro Classics',
    description: 'Old but gold games',
    games: [],
    tags: ['retro', 'classic'],
    isPublic: true,
    createdAt: '2022-09-22',
    updatedAt: '2022-12-10'
  },
  {
    id: '5',
    name: 'Hidden Gems',
    description: 'Underrated games worth playing',
    games: ['6'],
    tags: ['indie', 'underrated'],
    isPublic: true,
    createdAt: '2023-03-05',
    updatedAt: '2023-08-01',
    coverImage: '/images/hidden-gems.jpg'
  }
];