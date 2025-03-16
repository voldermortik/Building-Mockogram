import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { SubmitButton } from '@/components/buttons/SubmitButton';

export function LoginPage() {
  const { user, login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      void navigate(`/profile/${user.username}`);
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await login(username, password);
    }
    catch (error) {
      console.error('Login failed:', error);
      setErrorMessage('Invalid username / password');
    }
    finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-8">
      <h2 className="mb-8">Login to Mockagram</h2>
      
      <form 
        onSubmit={(event) => { void handleSubmit(event); }} 
        className="flex flex-col gap-4 w-full max-w-[400px]"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => { setUsername(e.target.value); }}
            required
            className="p-2 rounded border border-gray-300 text-base"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); }}
            required
            className="p-2 rounded border border-gray-300 text-base"
          />
        </div>

        {errorMessage && (
          <p className="text-red-700 my-2">
            {errorMessage}
          </p>
        )}

        <SubmitButton 
          isSubmitting={isSubmitting} 
          loadingText="Logging in..."
          styleDark
        >
          Log In
        </SubmitButton>
      </form>
    </div>
  );
} 
