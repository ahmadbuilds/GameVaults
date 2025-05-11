// app/Dashboard/library/add/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Game } from '../../../../app/mocks/games';
import { mockGames } from '../../../../app/mocks/games';

export default function AddGamePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Omit<Game, 'id' | 'media' | 'achievements'>>({
    title: '',
    platform: 'PC',
    status: 'backlog',
    progress: 0,
    hoursPlayed: 0,
    description: '',
    developer: '',
    publisher: '',
    releaseDate: new Date().toISOString().split('T')[0],
    genres: [],
    playMode: ['Single-player'],
    personalNotes: ''
  });

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
      [name]: value === '' ? 0 : Number(value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Create new game object
    const newGame: Game = {
      ...formData,
      id: Math.random().toString(36).substring(2, 9), // Simple ID generation
      media: [],
      achievements: []
    };

    // In a real app, you would save to your database here
    mockGames.push(newGame);
    console.log('Added new game:', newGame);

    // Redirect to library or new game's page
    router.push('/Dashboard/library');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-[#1E2A45] rounded-xl p-6 border border-[#3A4B72]/30 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Add New Game</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Title*</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-[#2B3654] border border-[#3A4B72]/50 rounded-lg py-2 px-3 text-white outline-none focus:border-purple-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Platform*</label>
              <select
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                className="w-full bg-[#2B3654] border border-[#3A4B72]/50 rounded-lg py-2 px-3 text-white outline-none focus:border-purple-400"
                required
              >
                <option value="PC">PC</option>
                <option value="PlayStation">PlayStation</option>
                <option value="Xbox">Xbox</option>
                <option value="Switch">Switch</option>
                <option value="Mobile">Mobile</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Status*</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-[#2B3654] border border-[#3A4B72]/50 rounded-lg py-2 px-3 text-white outline-none focus:border-purple-400"
                required
              >
                <option value="playing">Playing</option>
                <option value="completed">Completed</option>
                <option value="backlog">Backlog</option>
                <option value="abandoned">Abandoned</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Progress (%)</label>
              <input
                type="number"
                name="progress"
                min="0"
                max="100"
                value={formData.progress}
                onChange={handleNumberChange}
                className="w-full bg-[#2B3654] border border-[#3A4B72]/50 rounded-lg py-2 px-3 text-white outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Hours Played</label>
              <input
                type="number"
                name="hoursPlayed"
                min="0"
                value={formData.hoursPlayed}
                onChange={handleNumberChange}
                className="w-full bg-[#2B3654] border border-[#3A4B72]/50 rounded-lg py-2 px-3 text-white outline-none focus:border-purple-400"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full bg-[#2B3654] border border-[#3A4B72]/50 rounded-lg py-2 px-3 text-white outline-none focus:border-purple-400"
            />
          </div>

          {/* Developer/Publisher */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Developer</label>
              <input
                type="text"
                name="developer"
                value={formData.developer}
                onChange={handleChange}
                className="w-full bg-[#2B3654] border border-[#3A4B72]/50 rounded-lg py-2 px-3 text-white outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Publisher</label>
              <input
                type="text"
                name="publisher"
                value={formData.publisher}
                onChange={handleChange}
                className="w-full bg-[#2B3654] border border-[#3A4B72]/50 rounded-lg py-2 px-3 text-white outline-none focus:border-purple-400"
              />
            </div>
          </div>

          {/* Release Date */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Release Date</label>
            <input
              type="date"
              name="releaseDate"
              value={formData.releaseDate}
              onChange={handleChange}
              className="w-full bg-[#2B3654] border border-[#3A4B72]/50 rounded-lg py-2 px-3 text-white outline-none focus:border-purple-400"
            />
          </div>

          {/* Personal Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Personal Notes</label>
            <textarea
              name="personalNotes"
              value={formData.personalNotes}
              onChange={handleChange}
              rows={3}
              className="w-full bg-[#2B3654] border border-[#3A4B72]/50 rounded-lg py-2 px-3 text-white outline-none focus:border-purple-400"
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.push('/Dashboard/library')}
              className="px-4 py-2 bg-[#2B3654] hover:bg-[#3A4B72] text-gray-300 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-200 disabled:opacity-70"
            >
              {isSubmitting ? 'Adding...' : 'Add Game'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}