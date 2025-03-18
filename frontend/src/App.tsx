import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { HomePage } from '@/components/pages/HomePage'
import { ProfilePage } from '@/components/pages/ProfilePage'
import { LoginPage } from '@/components/pages/LoginPage'
import { CreatePostPage } from '@/components/pages/CreatePostPage'
import { NotFound } from '@/components/NotFound'

function App() {
  return (
    <BrowserRouter>
        <div className="w-full">
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
    </BrowserRouter>
  );
}

export default App
