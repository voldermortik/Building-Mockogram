import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'

import { HomePage } from '@/components/pages/HomePage'
import { ProfilePage } from '@/components/pages/ProfilePage'
import { LoginPage } from '@/components/pages/LoginPage'
import { CreatePostPage } from '@/components/pages/CreatePostPage'
import { GlobalHeader } from '@/components/GlobalHeader'
import { NotFound } from '@/components/NotFound'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="w-full">
          <GlobalHeader />
          <main className="mt-4 px-4">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/profile/:username" element={<ProfilePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/post/create" element={<CreatePostPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App
