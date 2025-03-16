import { NavButton } from '@/components/buttons/NavButton';

export function NotFound() {
  return (
    <div className="text-center mt-8">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <div className="mt-4">
        <NavButton to="/" styleDark>
          Return to Home Page
        </NavButton>
      </div>
    </div>
  );
} 
