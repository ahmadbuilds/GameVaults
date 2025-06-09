'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';

interface MediaUploadProps {
  gameId?: string; 
  collectionId?: string; 
  onClose: () => void;
  onUploadSuccess: () => void;
  uploadType?: 'game' | 'collection'; 
}

export default function MediaUpload({ 
  gameId, 
  collectionId, 
  onClose, 
  onUploadSuccess, 
  uploadType 
}: MediaUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [captions, setCaptions] = useState<{ [key: string]: string }>({});
  const { user } = useUser();

 
  const detectedUploadType = uploadType || (collectionId ? 'collection' : 'game');
  
  
  const targetId = detectedUploadType === 'collection' ? collectionId : gameId;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    const validFiles = selectedFiles.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type.startsWith('video/');
      const isValidSize = file.size <= 50 * 1024 * 1024; 
      return isValidType && isValidSize;
    });
    
    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const updateCaption = (index: number, caption: string) => {
    setCaptions(prev => ({ ...prev, [index]: caption }));
  };

  const uploadToCloudinary = async (file: File): Promise<{ url: string; publicId: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
    
    const resourceType = file.type.startsWith('video/') ? 'video' : 'image';
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;

    const response = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload to Cloudinary');
    }

    const data = await response.json();
    return {
      url: data.secure_url,
      publicId: data.public_id
    };
  };

  const handleUpload = async () => {
    if (!user?.primaryEmailAddress?.emailAddress || files.length === 0 || !targetId) return;

    setUploading(true);
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress(prev => ({ ...prev, [i]: 0 }));

        
        const { url, publicId } = await uploadToCloudinary(file);
        setUploadProgress(prev => ({ ...prev, [i]: 50 }));

        let mediaData;
       
        if(uploadType === 'collection') {
          mediaData = {
            file:url,
            type: file.type.startsWith('video/') ? 'video' : 'image',
            publicId,
            caption: captions[i] || ''
          };
        }else{
          mediaData = {
            url,
            type: file.type.startsWith('video/') ? 'video' : 'image',
            publicId,
            caption: captions[i] || ''
          };
        }
      

        
        let apiUrl: string;
        if (detectedUploadType === 'collection') {
          apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/collections/AddMedia/${targetId}/${encodeURIComponent(user.primaryEmailAddress.emailAddress)}`;
        } else {
          apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/AddGame/AddMedia/${targetId}/${encodeURIComponent(user.primaryEmailAddress.emailAddress)}`;
        }

        console.log('Upload type:', detectedUploadType);
        console.log('Target ID:', targetId);
        console.log('API URL:', apiUrl);
        console.log('Media data:', mediaData);

       
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mediaData),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Response:', response.status, errorText);
          throw new Error(`Failed to save media to database: ${response.status} ${errorText}`);
        }

        const result = await response.json();
        console.log('Upload result:', result);

        setUploadProgress(prev => ({ ...prev, [i]: 100 }));
      }

      onUploadSuccess();
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again. Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#1E2A45] border border-[#3A4B72]/30 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            Add Media {detectedUploadType === 'collection' ? 'to Collection' : 'to Game'}
          </h2>
          <button
            title='Add Media'
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* File Upload Area */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select Images or Videos
          </label>
          <div className="border-2 border-dashed border-[#3A4B72] rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
              id="media-upload"
              disabled={uploading}
            />
            <label
              htmlFor="media-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <svg 
                className="w-12 h-12 text-gray-400 mb-3" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                />
              </svg>
              <p className="text-lg font-medium text-gray-300 mb-1">
                Click to upload files
              </p>
              <p className="text-sm text-gray-400">
                Images and videos up to 50MB each
              </p>
            </label>
          </div>
        </div>

        {/* File Preview */}
        {files.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">
              Selected Files ({files.length})
            </h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {files.map((file, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#2A3B5A] rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-[#3A4B72] rounded-lg flex items-center justify-center">
                        {file.type.startsWith('video/') ? (
                          <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium truncate max-w-xs">
                          {file.name}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    
                    <button
                      title='Remove'
                      onClick={() => removeFile(index)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                      disabled={uploading}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  {/* Caption Input */}
                  <div className="mb-3">
                    <input
                      type="text"
                      placeholder="Add a caption (optional)"
                      value={captions[index] || ''}
                      onChange={(e) => updateCaption(index, e.target.value)}
                      className="w-full bg-[#1E2A45] border border-[#3A4B72] rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                      disabled={uploading}
                    />
                  </div>

                  {/* Upload Progress */}
                  {uploading && uploadProgress[index] !== undefined && (
                    <div className="w-full bg-[#1E2A45] rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress[index]}%` }}
                      />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-300 hover:text-white transition-colors"
            disabled={uploading}
          >
            Cancel
          </button>
          
          <button
            onClick={handleUpload}
            disabled={files.length === 0 || uploading || !targetId}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center space-x-2"
          >
            {uploading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span>Upload {files.length} {files.length === 1 ? 'File' : 'Files'}</span>
              </>
            )}
          </button>
        </div>

        {/* Upload Info */}
        <div className="mt-4 p-3 bg-[#2A3B5A]/50 rounded-lg">
          <p className="text-sm text-gray-400">
            <span className="text-yellow-400">📝 Note:</span> Supported formats: Images (JPEG, PNG, GIF, WebP) and Videos (MP4, MOV, AVI). Maximum file size: 50MB per file.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}