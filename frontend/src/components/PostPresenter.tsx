import { useState, useEffect } from 'react';
import { env } from '@/config/env';

type MaxImageSize = 'normal' | 'small';

interface PostProps {
  username: string;
  userComment: string | null;
  createDate: string;
  imageId: string;
  maxImageSize?: MaxImageSize;
}

export function PostPresenter({ 
  username, 
  userComment, 
  createDate, 
  imageId,
  maxImageSize = 'normal',
}: PostProps) {
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const MAX_DIMENSIONS = maxImageSize === 'small' ? '600' : '900';

  useEffect(() => {
    const fetchImageData = async () => {
      try {
        const response = await fetch(`${env.VITE_MOCKSTORE_API_URL}/images/${imageId}`);
        if (!response.ok) throw new Error('Failed to fetch image data');
        const imageData = await response.json() as { filename: string };
        setImageUrl(`${env.VITE_MOCKSTORE_FILE_LOCATION}/${imageData.filename}`);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setError('Failed to load image data');
      }
    };

    void fetchImageData();
  }, [imageId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="flex justify-center mb-6">
      <div className="border border-gray-200 p-4 w-full" style={{ maxWidth: `${MAX_DIMENSIONS}px` }}>
        {error && <p className="text-red-600">{error}</p>}
        <div className="relative">
          {imageUrl && (
            <img 
              src={imageUrl}
              alt={`Post by ${username}`} 
              className="w-full h-auto object-contain transition-opacity duration-300"
              style={{ 
                maxWidth: `${MAX_DIMENSIONS}px`, 
                maxHeight: `${MAX_DIMENSIONS}px`,
              }}
              onError={() => { setError('Failed to load image'); }}
            />
          )}
        </div>
        <p className="mb-0 text-xl">
          <a 
            href={`/profile/${username}`}
            className="text-blue-600 hover:underline"
          >
            {username}
          </a>
          <span className="text-xl">{userComment ? ` ${userComment}` : ''}</span>
          <br />
          <span className="italic text-gray-500 text-sm">
            {formatDate(createDate)}
          </span>
        </p>
      </div>
    </div>
  );
} 
