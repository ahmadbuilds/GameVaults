'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';


interface GameCollection {
  _id: string;
  name: string;
  description?: string;
  userEmail: string;
  isPublic: boolean;
  tags: string[];
}

export default function EditCollectionPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  
  const [collection, setCollection] = useState<GameCollection | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: false,
    tags: [] as string[]
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const collectionId = params.id as string;
  const userEmail = user?.emailAddresses[0]?.emailAddress;

  
  const fetchCollection = async () => {
    try {
      setLoading(true);
      setError(null);

      const url = `${process.env.NEXT_PUBLIC_API_URL}/collections/GetCollection/${collectionId}${userEmail ? `?userEmail=${encodeURIComponent(userEmail)}` : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch collection: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        const collectionData = data.data;
        setCollection(collectionData);
        setFormData({
          name: collectionData.name,
          description: collectionData.description || '',
          isPublic: collectionData.isPublic,
          tags: collectionData.tags || []
        });
      } else {
        throw new Error(data.message || 'Failed to fetch collection');
      }
    } catch (err) {
      console.error('Error fetching collection:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userEmail || !collection) return;

    try {
      setSaving(true);
      setError(null);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/collections/UpdateCollection/${collectionId}/${encodeURIComponent(userEmail)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
       
        router.push(`/Dashboard/list/${collectionId}`);
      } else {
        throw new Error(data.message || 'Failed to update collection');
      }
    } catch (err) {
      console.error('Error updating collection:', err);
      setError(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

 
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  
  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedTag]
      }));
      setTagInput('');
    }
  };

  
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  
  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  useEffect(() => {
    fetchCollection();
  }, [collectionId, userEmail]);

 
  const isOwner = collection?.userEmail === userEmail;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F1419] p-6">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-[#1E2A45] rounded mb-6"></div>
            <div className="bg-[#1E2A45] rounded-xl p-6">
              <div className="h-6 w-32 bg-[#2B3654] rounded mb-4"></div>
              <div className="h-10 bg-[#2B3654] rounded mb-6"></div>
              <div className="h-6 w-48 bg-[#2B3654] rounded mb-4"></div>
              <div className="h-24 bg-[#2B3654] rounded mb-6"></div>
              <div className="flex gap-3">
                <div className="h-10 w-20 bg-[#2B3654] rounded"></div>
                <div className="h-10 w-20 bg-[#2B3654] rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !collection || !isOwner) {
    return (
      <div className="min-h-screen bg-[#0F1419] p-6 flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 text-center max-w-md">
          <h3 className="text-lg font-medium text-white mb-2">
            {!isOwner ? 'Access Denied' : 'Error Loading Collection'}
          </h3>
          <p className="text-red-400 mb-4">
            {!isOwner ? 'You can only edit your own collections.' : error || 'Collection not found'}
          </p>
          <Link
            href={`/Dashboard/list/${collectionId}`}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-300"
          >
            Back to Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1419] p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href={`/Dashboard/list/${collectionId}`}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
          <h1 className="text-3xl font-bold text-white">Edit Collection</h1>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Edit Form */}
        <div className="bg-[#1E2A45]/80 rounded-xl p-6">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Collection Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Collection Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full bg-[#2B3654] border border-[#3A4B72] rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-300"
                placeholder="Enter collection name"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                Additional Information
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full bg-[#2B3654] border border-[#3A4B72] rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-300 resize-vertical"
                placeholder="Describe your collection (optional)"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagKeyPress}
                  className="flex-1 bg-[#2B3654] border border-[#3A4B72] rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-300"
                  placeholder="Add a tag"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-300"
                >
                  Add
                </button>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <span
                      key={tag}
                      className="bg-[#2B3654] text-gray-300 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Privacy Setting */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 bg-[#2B3654] border-[#3A4B72] rounded focus:ring-blue-500 focus:ring-2"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-300">Public Collection</span>
                  <span className="text-xs text-gray-400">
                    Make this collection visible to other users
                  </span>
                </div>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={saving || !formData.name.trim()}
                className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
              
              <Link
                href={`/Dashboard/list/${collectionId}`}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}