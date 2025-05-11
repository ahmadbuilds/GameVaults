// utils/gameUtils.ts
import { Game, mockGames } from '../games'; // Adjust path as needed

/**
 * Updates a game in the mockGames array
 * @param id - ID of the game to update
 * @param updatedData - Partial game object with updated fields
 * @returns boolean indicating if update was successful
 */
export const updateGame = (id: string, updatedData: Partial<Game>): boolean => {
  const index = mockGames.findIndex(game => game.id === id);
  if (index !== -1) {
    mockGames[index] = { ...mockGames[index], ...updatedData };
    return true;
  }
  return false;
};

/**
 * Finds a game by ID
 * @param id - ID of the game to find
 * @returns Game object or undefined if not found
 */
export const getGameById = (id: string): Game | undefined => {
  return mockGames.find(game => game.id === id);
};

/**
 * Gets all games
 * @returns Array of all games
 */
export const getAllGames = (): Game[] => {
  return [...mockGames]; // Return a copy to prevent direct mutation
};