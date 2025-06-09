'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';


interface Platform {
  _id: string;
  name: string;
  gamesCount: number;
}

interface FormData {
  title: string;
  platform: string;
  status: string;
  progress: string | number;
  hoursPlayed: string | number;
  rating: string | number;
  description: string;
  developer: string;
  publisher: string;
  releaseDate: string;
  genres: string[];
  playMode: string[];
  personalNotes: string;
  owned: boolean;
  userEmail: string;
}

export default function AddGamePage() {
  const router = useRouter();
  const { user } = useUser();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [platformOptions, setPlatformOptions] = useState<string[]>([]);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    platform: '',
    status: 'backlog',
    progress: '',
    hoursPlayed: '',
    rating: '', 
    description: '',
    developer: '',
    publisher: '',
    releaseDate: new Date().toISOString().split('T')[0],
    genres: [],
    playMode: ['Single-player'],
    personalNotes: '',
    owned: true,
    userEmail: ''
  });

  useEffect(() => {
    const fetchPlatforms = async () => {
      if (user?.emailAddresses?.[0]?.emailAddress) {
        const userEmail = user.emailAddresses[0].emailAddress;

        setFormData(prev => ({
          ...prev,
          userEmail,
        }));

        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/platform/email?email=${encodeURIComponent(userEmail)}`
          );
          if (!response.ok) throw new Error('Failed to fetch platforms');

          const data = await response.json();
          const names = data.data.map((p: Platform) => p.name);
          setPlatformOptions(names);

          if (names.length > 0) {
            setFormData(prev => ({
              ...prev,
              platform: names[0],
            }));
          }
        } catch (err) {
          console.error('Error fetching platforms:', err);
          setPlatformOptions([]);
        }
      }
    };

    fetchPlatforms();
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      // Handle boolean conversion for owned field
      let processedValue: string | boolean = value;
      if (name === 'owned') {
        processedValue = value === 'true';
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: processedValue
      }));
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (value === '') {
      setFormData(prev => ({
        ...prev,
        [name]: ''
      }));
      return;
    }

    const numValue = Number(value);

    if (name === 'progress' && (numValue < 0 || numValue > 100)) {
      setError('Progress must be between 0 and 100');
      return;
    }

    if (name === 'hoursPlayed' && numValue < 0) {
      setError('Hours played must be greater than 0');
      return;
    }

    if (name === 'rating') {
      const roundedValue = Math.round(numValue);
      if (roundedValue < 1 || roundedValue > 5) {
        setError('Rating must be between 1 and 5');
        return;
      }
      setError('');
      setFormData(prev => ({
        ...prev,
        [name]: roundedValue
      }));
      return;
    }

    setError('');
    setFormData(prev => ({
      ...prev,
      [name]: numValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    if (!formData.title || !formData.platform || !formData.status || !formData.userEmail) {
      setError('Title, platform, and status are required');
      setIsSubmitting(false);
      return;
    }

    try {
      const gameResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/AddGame/GameRegister`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!gameResponse.ok) {
        const errorData = await gameResponse.json();
        throw new Error(errorData.error || 'Failed to add game');
      }

      const platformResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/platform/update-count/${encodeURIComponent(formData.platform)}/${encodeURIComponent(formData.userEmail)}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!platformResponse.ok) {
        const errorData = await platformResponse.json();
        throw new Error(errorData.error || 'Failed to update platform game count');
      }

      setSuccess('Game added successfully!');
      setTimeout(() => {
        router.push('/Dashboard/library');
      }, 1500);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while adding the game';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-[#1E2A45] rounded-xl p-6 border border-[#3A4B72]/30 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Add New Game</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-300 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500 text-green-300 rounded-lg">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
               <label className="block text-sm font-medium text-gray-400 mb-1">Title*</label>
               <input
                title='title'
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
                title='platform'
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                className="w-full bg-[#2B3654] border border-[#3A4B72]/50 rounded-lg py-2 px-3 text-white outline-none focus:border-purple-400"
                required
              >
                {platformOptions.length === 0 ? (
                  <option value="" disabled>
                    No platforms available
                  </option>
                ) : (
                  platformOptions.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Status*</label>
              <select
                title='status'
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
                title='progress'
                type="number"
                name="progress"
                min="0"
                max="100"
                value={formData.progress || ''}
                onChange={handleNumberChange}
                className="w-full bg-[#2B3654] border border-[#3A4B72]/50 rounded-lg py-2 px-3 text-white outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Hours Played</label>
              <input
                title='Hours Played'
                type="number"
                name="hoursPlayed"
                min="0"
                step="0.1"
                value={formData.hoursPlayed || ''}
                onChange={handleNumberChange}
                className="w-full bg-[#2B3654] border border-[#3A4B72]/50 rounded-lg py-2 px-3 text-white outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Rating (1-5)</label>
              <input
                title='rating'
                type="number"
                name="rating"
                min="1"
                max="5"
                value={formData.rating}
                onChange={handleNumberChange}
                className="w-full bg-[#2B3654] border border-[#3A4B72]/50 rounded-lg py-2 px-3 text-white outline-none focus:border-purple-400"
              />
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-400 mb-1">Ownership Status</label>
               <select
                title='Games Owned'
                name="owned"
                value={formData.owned.toString()}
                onChange={handleChange}
                className="w-full bg-[#2B3654] border border-[#3A4B72]/50 rounded-lg py-2 px-3 text-white outline-none focus:border-purple-400"
              >
                <option value="true">Owned</option>
                <option value="false">Not Owned</option>
              </select>
            </div>
          </div>

         <div>
             <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
             <textarea
              title='description'
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full bg-[#2B3654] border border-[#3A4B72]/50 rounded-lg py-2 px-3 text-white outline-none focus:border-purple-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Developer</label>
              <input
                title='Developer'
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
                title='Publisher'
                type="text"
                name="publisher"
                value={formData.publisher}
                onChange={handleChange}
                className="w-full bg-[#2B3654] border border-[#3A4B72]/50 rounded-lg py-2 px-3 text-white outline-none focus:border-purple-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Release Date</label>
            <input
              title='Date'
              type="date"
              name="releaseDate"
              value={formData.releaseDate}
              onChange={handleChange}
              className="w-full bg-[#2B3654] border border-[#3A4B72]/50 rounded-lg py-2 px-3 text-white outline-none focus:border-purple-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Personal Notes</label>
            <textarea
              title='Personal Notes'
              name="personalNotes"
              value={formData.personalNotes}
              onChange={handleChange}
              rows={3}
              className="w-full bg-[#2B3654] border border-[#3A4B72]/50 rounded-lg py-2 px-3 text-white outline-none focus:border-purple-400"
            />
          </div>

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