// app/api/upload/route.js
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import cloudinary from '../../lib/cloudinary';

export async function POST(request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const gameId = formData.get('gameId');
    const mediaType = formData.get('mediaType'); 

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

   
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: mediaType === 'video' ? 'video' : 'image',
          folder: `game-library/${userId}/${gameId}`,
          transformation: mediaType === 'image' ? [
            { width: 1920, height: 1080, crop: 'limit', quality: 'auto' }
          ] : [
            { width: 1920, height: 1080, crop: 'limit', quality: 'auto', format: 'mp4' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      mediaType: result.resource_type
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed', details: error.message },
      { status: 500 }
    );
  }
}