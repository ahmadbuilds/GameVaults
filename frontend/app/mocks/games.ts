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
  description: string;
  developer: string;
  publisher: string;
  releaseDate: string;
  genres: string[];
  playMode: string[];
  personalNotes?: string;
  media: {
    type: 'image' | 'video';
    url: string;
    caption?: string;
    uploadedAt: string;
  }[];
  achievements?: {
    name: string;
    description: string;
    unlocked: boolean;
    unlockedAt?: string;
    icon?: string;
  }[];
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
    lastPlayed: '2023-05-15',
    description: 'A fantasy action-RPG adventure set in a world co-created by Hidetaka Miyazaki and George R.R. Martin.',
    developer: 'FromSoftware',
    publisher: 'Bandai Namco',
    releaseDate: '2022-02-25',
    genres: ['Action RPG', 'Open World', 'Souls-like'],
    playMode: ['Single-player', 'Online Co-op'],
    personalNotes: 'Incredible open world design with rewarding exploration. The combat system is deep and satisfying.',
    media: [
      {
        type: 'image',
        url: '/media/elden-ring/screenshot1.jpg',
        caption: 'Exploring Limgrave',
        uploadedAt: '2023-03-10'
      },
      {
        type: 'video',
        url: '/media/elden-ring/gameplay1.mp4',
        caption: 'Boss fight against Margit',
        uploadedAt: '2023-03-15'
      },
      {
        type: 'image',
        url: '/media/elden-ring/screenshot2.jpg',
        caption: 'Raya Lucaria Academy',
        uploadedAt: '2023-04-02'
      }
    ],
    achievements: [
      {
        name: 'Elden Lord',
        description: 'Achieve the "Elden Lord" ending',
        unlocked: true,
        unlockedAt: '2023-05-12',
        icon: '/achievements/elden-lord.png'
      },
      {
        name: 'Legendary Armaments',
        description: 'Acquire all legendary armaments',
        unlocked: true,
        unlockedAt: '2023-05-10',
        icon: '/achievements/legendary-armaments.png'
      },
      {
        name: 'Legendary Ashen Remains',
        description: 'Acquire all legendary ashen remains',
        unlocked: false,
        icon: '/achievements/legendary-remains.png'
      }
    ]
  },
];