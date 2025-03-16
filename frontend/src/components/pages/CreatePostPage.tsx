import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { NavButton } from '@/components/buttons/NavButton';
import { Image } from '@/data/Image';
import { SubmitButton } from '@/components/buttons/SubmitButton';
import { env } from '@/config/env';
interface FieldError {
  message: string;
  timestamp: number;
}

export function CreatePostPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [imageError, setImageError] = useState<FieldError | null>(null);
  const [descriptionError, setDescriptionError] = useState<FieldError | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (imageError) {
      const timer = setTimeout(() => { setImageError(null); }, 3000);
      return () => { clearTimeout(timer); };
    }
  }, [imageError]);

  useEffect(() => {
    if (descriptionError) {
      const timer = setTimeout(() => { setDescriptionError(null); }, 3000);
      return () => { clearTimeout(timer); };
    }
  }, [descriptionError]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'image/jpeg') {
        setImageError({ 
          message: 'Please select a JPEG image file (.jpg or .jpeg)', 
          timestamp: Date.now() 
        });
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;

    if (!selectedFile) {
      setImageError({ message: 'Please select an image', timestamp: Date.now() });
      isValid = false;
    }

    if (!description.trim()) {
      setDescriptionError({ message: 'Please add a description', timestamp: Date.now() });
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (!user) {
        throw new Error('User must be logged in');
      }

      const formData = new FormData();
      
      if (!selectedFile) {
        throw new Error('No file selected');
      }
      formData.append('image', selectedFile);

      const imageResponse = await fetch(`${env.VITE_MOCKSTORE_API_URL}/images`, {
        method: 'POST',
        body: formData,
      });

      if (!imageResponse.ok) {
        throw new Error('Failed to upload image');
      }

      const imageData = await imageResponse.json() as Image;
      
      const postResponse = await fetch(`${env.VITE_MOCKAGRAM_API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userId: user._id,
          userComment: description,
          imageId: imageData.imageId,
        }),
      });

      if (!postResponse.ok) {
        throw new Error('Failed to create post');
      }

      void navigate(`/profile/${user.username}`);

    } catch (error) {
      setSubmitError(
        error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center gap-6 p-8">
        <h2 className="text-2xl font-bold text-gray-800">Create a New Post</h2>
        <p className="text-gray-600 text-center max-w-md">
          You need to be signed in to create new posts. 
          Please log in to continue.
        </p>
        <NavButton to="/login" >Log In</NavButton>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create a New Post</h2>
      
      <form onSubmit={(event) => { void handleSubmit(event); }} className="space-y-6">
        {/* Image upload section */}
        <div>
          <label className="block text-gray-700 mb-2">Upload Image</label>
          <div className="space-y-4">
            {previewUrl && (
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="max-h-96 object-contain rounded-lg border border-gray-200"
              />
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg"
              className="hidden"
            />
            {/* Not turning this into a component since it is a one-off use case; did however copy styles from SubmitButton */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="py-2 px-4 rounded font-medium text-sm bg-blue-600 text-white border border-white hover:bg-blue-700"
            >
              {previewUrl ? 'Change Image' : 'Select Image'}
            </button>
            {imageError && (
              <p className="text-red-600 text-sm">{imageError.message}</p>
            )}
          </div>
        </div>

        {/* Description section */}
        <div>
          <label className="block text-gray-700 mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => { setDescription(e.target.value); }}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            placeholder="Write a description for your post..."
          />
          {descriptionError && (
            <p className="text-red-600 text-sm">{descriptionError.message}</p>
          )}
        </div>

        {/* Submit button and error message */}
        {submitError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{submitError}</p>
          </div>
        )}

        <div className="w-full">
          <SubmitButton
            isSubmitting={isSubmitting}
            loadingText="Creating Post..."
            styleDark
          >
            Create Post
          </SubmitButton>
        </div>

      </form>
    </div>
  );
}
