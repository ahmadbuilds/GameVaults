// mocks/games.ts
export interface Game {
  id: string;
  title: string;
  platform: string;
  status: 'completed' | 'playing' | 'backlog' | 'abandoned';
  progress: number;
  hoursPlayed: number;
  rating?: number;
  coverImage?: string;
  lastPlayed?: string;
}

export const mockGames: Game[] = [
  {
    id: '1',
    title: 'Elden Ring',
    platform: 'PC',
    status: 'completed',
    progress: 100,
    hoursPlayed: 87,
    rating: 5,
    coverImage: '/images/elden-ring.jpg',
    lastPlayed: '2023-05-15'
  },
  {
    id: '2',
    title: 'The Legend of Zelda: Tears of the Kingdom',
    platform: 'Switch',
    status: 'playing',
    progress: 45,
    hoursPlayed: 32,
    rating: 4,
    coverImage: '/images/zelda.jpg',
    lastPlayed: '2023-06-20'
  },
  {
    id: '3',
    title: 'Baldur\'s Gate 3',
    platform: 'PS5',
    status: 'playing',
    progress: 28,
    hoursPlayed: 42,
    rating: 5,
    coverImage: '/images/baldurs-gate.jpg',
    lastPlayed: '2023-08-10'
  },
  {
    id: '4',
    title: 'Starfield',
    platform: 'Xbox',
    status: 'backlog',
    progress: 0,
    hoursPlayed: 0,
    coverImage: '/images/starfield.jpg'
  },
  {
    id: '5',
    title: 'Cyberpunk 2077',
    platform: 'PC',
    status: 'completed',
    progress: 100,
    hoursPlayed: 65,
    rating: 4,
    coverImage: '/images/cyberpunk.jpg',
    lastPlayed: '2023-02-28'
  },
  {
    id: '6',
    title: 'Hogwarts Legacy',
    platform: 'PS5',
    status: 'abandoned',
    progress: 32,
    hoursPlayed: 18,
    rating: 3,
    coverImage: '/images/hogwarts.jpg',
    lastPlayed: '2023-04-05'
  }
];