import cameraIcon from '/camera.svg'
import { Link, useLocation } from 'react-router-dom'
import { NavButton } from '@/components/buttons/NavButton'
import { ClickActionButton } from '@/components/buttons/ClickActionButton'
import { useAuth } from '@/contexts/AuthContext'

export function GlobalHeader() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  const headerContent = (
    <header className="bg-blue-50 p-4 w-full m-0 flex justify-between items-center">
      <Link 
        to="/"
        className="no-underline text-inherit ml-4"
      >
        <h1 className="m-0 text-4xl font-bold text-blue-600 flex items-center font-['Space_Grotesk'] tracking-wide">
          <img 
            src={cameraIcon} 
            alt="Camera icon" 
            className="w-12 h-12 mr-3"
          />
          Mockagram
        </h1>
      </Link>
      <div className="mr-4 flex items-center gap-4">
        {user ? (
          <>
            <span className="text-lg text-blue-600">Hello, {user.username}!</span>
            <NavButton to="/post/create" >
              Create Post
            </NavButton>
            <NavButton to={`/profile/${user.username}`} >
              My Profile
            </NavButton>
            <ClickActionButton onClick={logout}>
              Logout
            </ClickActionButton>
          </>
        ) : (
          !isLoginPage && <NavButton to="/login">Log In</NavButton>
        )}
      </div>
    </header>
  );

  return headerContent;
} 
