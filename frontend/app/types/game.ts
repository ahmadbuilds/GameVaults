export interface Game {
  _id: string;
  title: string;
  platform: string;
  status: 'playing' | 'completed' | 'backlog' | 'abandoned';
  progress: number;
  hoursPlayed: number;
  rating?: number;
  description?: string;
  developer?: string;
  publisher?: string;
  releaseDate?: string;
  genres?: string[];
  playMode?: string[];
  personalNotes?: string;
  owned?: boolean;
  userEmail: string;
  imageUrl?: string;
  displayImageUrl?: string; 
  mediaUrls?: Array<{ type: string; url: string }>;
  videoUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}