// services/searchService.ts
import { mockGames, mockBacklogGames } from '../mocks/gameData';

// Flag to switch between mock and real API
const USE_MOCK_API = true;

// Base URL for your real API (change when available)
const API_BASE_URL = 'https://your-api-url.com/api';

interface Game {
  id: number;
  title: string;
  platform: string;
  [key: string]: any; // For other properties
}

// Search across all games (both library and backlog)
export const searchGames = async (searchTerm: string): Promise<Game[]> => {
  if (USE_MOCK_API) {
    // Combine library and backlog games for search
    const allGames = [...mockGames, ...mockBacklogGames];
    
    // Filter games that match the search term
    const results = allGames.filter(game => 
      game.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Simulate API delay
    return new Promise(resolve => {
      setTimeout(() => resolve(results), 300);
    });
  }
  
  // Real API implementation for when backend is ready
  try {
    const response = await fetch(`${API_BASE_URL}/search?term=${encodeURIComponent(searchTerm)}`);
    if (!response.ok) {
      throw new Error('Search request failed');
    }
    return response.json();
  } catch (error) {
    console.error('Error searching games:', error);
    return [];
  }
};

// Get game details by ID
export const getGameById = async (gameId: number): Promise<Game | null> => {
  if (USE_MOCK_API) {
    // Search in both libraries
    const allGames = [...mockGames, ...mockBacklogGames];
    const game = allGames.find(g => g.id === gameId) || null;
    
    // Simulate API delay
    return new Promise(resolve => {
      setTimeout(() => resolve(game), 200);
    });
  }
  
  // Real API implementation
  try {
    const response = await fetch(`${API_BASE_URL}/games/${gameId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch game details');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching game details:', error);
    return null;
  }
};