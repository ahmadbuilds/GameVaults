// components/GameEditForm/index.tsx
'use client';

import { useState } from 'react';
import { Game } from '../../mocks/games';

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

const platformOptions = ['PC', 'PlayStation', 'Xbox', 'Switch', 'Mobile', 'Other'];

export default function GameEditForm({ game, onSave, onCancel }: GameEditFormProps) {
  const [formData, setFormData] = useState<Game>({ ...game });

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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-[#1E2A45] rounded-xl p-6 border border-[#3A4B72]/30">
      <h2 className="text-2xl font-bold text-white mb-6">Edit Game Details</h2>
      
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
              {platformOptions.map(platform => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
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
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
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

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Rating (1-5)</label>
            <input
              type="number"
              name="rating"
              min="1"
              max="5"
              value={formData.rating || ''}
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
            value={formData.personalNotes || ''}
            onChange={handleChange}
            rows={3}
            className="w-full bg-[#2B3654] border border-[#3A4B72]/50 rounded-lg py-2 px-3 text-white outline-none focus:border-purple-400"
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-[#2B3654] hover:bg-[#3A4B72] text-gray-300 rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-200"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}