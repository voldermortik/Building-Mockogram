import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { PostPresenter } from '@/components/PostPresenter'
import { NotFound } from '@/components/NotFound'
import { useAuth } from '@/contexts/AuthContext'
import { Post } from '@/data/Post'
import { NavButton } from '@/components/buttons/NavButton'
import { env } from '@/config/env'

export function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string>('');
  const [userExists, setUserExists] = useState<boolean>(true);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const loadedPostCount = useRef(0);

  useEffect(() => {
    if (!username) return;

    const fetchPosts = async () => {
      setIsLoadingPosts(true);
      setPosts([]);
      setUserExists(true);
      setError('');
      loadedPostCount.current = 0;

      try {
        const postsResponse = await fetch(`${env.VITE_MOCKAGRAM_API_URL}/posts/user/${username}`);
        if (!postsResponse.ok) {
          if (postsResponse.status === 404) {
            const errorData = await postsResponse.json() as { error: string };
            if (errorData.error === 'User not found') {
              setUserExists(false);
              return;
            }
          }
          throw new Error('Failed to fetch posts');
        }
        const postsData = await postsResponse.json() as Post[];       
        setPosts(postsData);
        setIsLoadingPosts(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setIsLoadingPosts(false);
      }
    };

    void fetchPosts();
  }, [username]);

  if (!username) {
    return <NotFound />;
  }

  if (!userExists) {
    return <NotFound />;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  if (isLoadingPosts) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div>Loading...</div>
      </div>
    );
  }

  if (posts.length === 0) {
    const isOwnProfile = user?.username === username;
    
    return (
      <div className="text-center py-8">
        {isOwnProfile ? (
          <>
            <p className="text-gray-600 mb-4">You haven't created any posts yet.</p>
            <NavButton 
              to="/post/create"
              styleDark
            >
              Create Your First Post
            </NavButton>
          </>
        ) : (
          <>
            <p className="text-gray-600 mb-4">This user hasn't posted anything yet.</p>
            <NavButton 
              to="/"
              styleDark
            >
              Explore Other Posts
            </NavButton>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="pt-8">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center pb-4">{username}'s Posts</h2>
          {posts.map(post => (
            <PostPresenter
              key={post._id}
              username={post.user.username}
              userComment={post.userComment}
              createDate={post.createDate}
              imageId={post.imageId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
