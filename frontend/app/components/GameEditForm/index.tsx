// components/GameEditForm/index.tsx
'use client';

import { useState, useEffect } from 'react';
import { Game } from '../../types/game';
import { useUser } from '@clerk/nextjs';

interface GameEditFormProps {
  game: Game;
  onSave: (updatedGame: Game) => void;
  onCancel: () => void;
}

const statusOptions = [
  { value: 'playing', label: 'Playing' },
  { value: 'completed', label: 'Completed' },
  { value: 'backlog', label: 'Backlog' },
  { value: 'abandoned', label: 'Abandoned' }
];

export default function GameEditForm({ game, onSave, onCancel }: GameEditFormProps) {
  const { user } = useUser();
  const [platformOptions, setPlatformOptions] = useState<string[]>([]);
  const [isLoadingPlatforms, setIsLoadingPlatforms] = useState(false);
  const [platformError, setPlatformError] = useState<string>('');
  
  const [formData, setFormData] = useState<Game>(() => {
    const formatDateForInput = (dateString?: string) => {
      if (!dateString) return '';
      try {
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
      } catch {
        return '';
      }
    };

    return {
      ...game,
      releaseDate: formatDateForInput(game.releaseDate)
    };
  });

 
  useEffect(() => {
    const fetchUserPlatforms = async () => {
      
      if (!user?.primaryEmailAddress?.emailAddress && !user?.emailAddresses?.[0]?.emailAddress) {
        return;
      }

    
      const userEmail = user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress;
      
      if (!userEmail) return;

      setIsLoadingPlatforms(true);
      setPlatformError('');

      try {
        console.log('Fetching platforms for user:', userEmail);
        
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/platform/email?email=${encodeURIComponent(userEmail)}`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Platform response:', data);

        
        let platforms: string[] = [];
        
        if (Array.isArray(data)) {
          
          platforms = data.map((p: any) => typeof p === 'string' ? p : p.name || p.platformName || '').filter(Boolean);
        } else if (data.data && Array.isArray(data.data)) {
          
          platforms = data.data.map((p: any) => typeof p === 'string' ? p : p.name || p.platformName || '').filter(Boolean);
        } else if (data.platforms && Array.isArray(data.platforms)) {
          
          platforms = data.platforms.map((p: any) => typeof p === 'string' ? p : p.name || p.platformName || '').filter(Boolean);
        }

        console.log('Processed platforms:', platforms);
        
        setPlatformOptions(platforms);

       
        if (formData.platform && !platforms.includes(formData.platform)) {
          setPlatformOptions(prev => [...prev, formData.platform]);
        }

      } catch (error) {
        console.error('Error fetching user platforms:', error);
        setPlatformError('Failed to load platforms');
        setPlatformOptions([]);
        
        
        if (formData.platform) {
          setPlatformOptions([formData.platform]);
        }
      } finally {
        setIsLoadingPlatforms(false);
      }
    };

    fetchUserPlatforms();
  }, [user, formData.platform]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? undefined : Number(value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formattedData = {
      ...formData,
      updatedAt: new Date().toISOString()
    };
    onSave(formattedData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1419] to-[#1A1F2E] p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={onCancel}
            className="bg-[#1E2A45] hover:bg-[#2F3B5C] p-3 rounded-lg transition-all duration-300 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Edit {game.title}
          </h1>
        </div>

        <div className="bg-[#1E2A45]/80 backdrop-blur-sm rounded-xl p-8 border border-[#3A4B72]/30">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Cover Image Preview */}
            {formData.imageUrl && (
              <div className="flex justify-center">
                <div className="w-48 h-64 rounded-lg overflow-hidden bg-[#2B3654] border border-[#3A4B72]/50">
                  <img 
                    src={formData.imageUrl} 
                    alt={formData.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Basic Info Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white border-b border-[#3A4B72]/30 pb-2">
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full bg-[#2B3654] border border-[#3A4B72]/50 rounded-lg py-3 px-4 text-white placeholder-gray-400 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                    placeholder="Enter game title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Platform *
                  </label>
                  <select
                    name="platform"
                    value={formData.platform}
                    onChange={handleChange}
                    className="w-full bg-[#2B3654] border border-[#3A4B72]/50 rounded-lg py-3 px-4 text-white outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                    required
                    disabled={isLoadingPlatforms}
                  >
                    {isLoadingPlatforms ? (
                      <option>Loading platforms...</option>
                    ) : platformOptions.length > 0 ? (
                      platformOptions.map(platform => (
                        <option key={platform} value={platform}>{platform}</option>
                      ))
                    ) : (
                      <option disabled>No platforms available</option>
                    )}
                  </select>
                  {isLoadingPlatforms && (
                    <div className="mt-1 text-xs text-gray-400">
                      Loading your platforms...
                    </div>
                  )}
                  {!isLoadingPlatforms && platformError && (
                    <div className="mt-1 text-xs text-red-400">
                      {platformError}
                    </div>
                  )}
                  {!isLoadingPlatforms && !platformError && platformOptions.length === 0 && (
                    <div className="mt-1 text-xs text-red-400">
                      No platforms found. Please add some platforms first.
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Status *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full bg-[#2B3654] border border-[#3A4B72]/50 rounded-lg py-3 px-4 text-white outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                    required
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

              </div>
            </div>

            {/* Progress Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white border-b border-[#3A4B72]/30 pb-2">
                Progress & Rating
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Progress (%)
                  </label>
                  <input
                    type="number"
                    name="progress"
                    min="0"
                    max="100"
                    value={formData.progress}
                    onChange={handleNumberChange}
                    className="w-full bg-[#2B3654] border border-[#3A4B72]/50 rounded-lg py-3 px-4 text-white placeholder-gray-400 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Hours Played
                  </label>
                  <input
                    type="number"
                    name="hoursPlayed"
                    min="0"
                    step="0.1"
                    value={formData.hoursPlayed}
                    onChange={handleNumberChange}
                    className="w-full bg-[#2B3654] border border-[#3A4B72]/50 rounded-lg py-3 px-4 text-white placeholder-gray-400 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Rating (1-5)
                  </label>
                  <input
                    type="number"
                    name="rating"
                    min="1"
                    max="5"
                    value={formData.rating || ''}
                    onChange={handleNumberChange}
                    className="w-full bg-[#2B3654] border border-[#3A4B72]/50 rounded-lg py-3 px-4 text-white placeholder-gray-400 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                    placeholder="1-5"
                  />
                </div>
              </div>
            </div>

            {/* Game Details Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white border-b border-[#3A4B72]/30 pb-2">
                Game Details
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-[#2B3654] border border-[#3A4B72]/50 rounded-lg py-3 px-4 text-white placeholder-gray-400 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all resize-vertical"
                  placeholder="Enter game description..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Developer
                  </label>
                  <input
                    type="text"
                    name="developer"
                    value={formData.developer || ''}
                    onChange={handleChange}
                    className="w-full bg-[#2B3654] border border-[#3A4B72]/50 rounded-lg py-3 px-4 text-white placeholder-gray-400 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                    placeholder="Enter developer name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Publisher
                  </label>
                  <input
                    type="text"
                    name="publisher"
                    value={formData.publisher || ''}
                    onChange={handleChange}
                    className="w-full bg-[#2B3654] border border-[#3A4B72]/50 rounded-lg py-3 px-4 text-white placeholder-gray-400 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                    placeholder="Enter publisher name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Release Date
                  </label>
                  <input
                    type="date"
                    name="releaseDate"
                    value={formData.releaseDate || ''}
                    onChange={handleChange}
                    className="w-full bg-[#2B3654] border border-[#3A4B72]/50 rounded-lg py-3 px-4 text-white outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all [color-scheme:dark]"
                  />
                </div>
              </div>
            </div>

            {/* Personal Notes Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white border-b border-[#3A4B72]/30 pb-2">
                Personal Notes
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Notes
                </label>
                <textarea
                  name="personalNotes"
                  value={formData.personalNotes || ''}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-[#2B3654] border border-[#3A4B72]/50 rounded-lg py-3 px-4 text-white placeholder-gray-400 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all resize-vertical"
                  placeholder="Add your personal notes about this game..."
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-[#3A4B72]/30">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 bg-[#2B3654] hover:bg-[#3A4B72] cursor-pointer text-gray-300 rounded-lg transition-all duration-200 font-medium border border-[#3A4B72]/50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r cursor-pointer from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200 font-medium hover:scale-105"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}