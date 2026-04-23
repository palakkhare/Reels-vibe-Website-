import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import HomeFeed from './pages/HomeFeed';
import ReelsPlayer from './pages/ReelsPlayer';
import Profile from './pages/Profile';
import Upload from './pages/Upload';
import Explore from './pages/Explore';
import ChatList from './pages/ChatList';
import ChatPage from './pages/ChatPage';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';

function AppContent() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomeFeed />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/reels" element={<ReelsPlayer />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><ChatList /></ProtectedRoute>} />
        <Route path="/chat/:userId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      </Routes>
      <BottomNav />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--color-dark-700)',
            color: '#fff',
            borderRadius: '12px',
            fontSize: '14px',
          },
        }}
      />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <SocketProvider>
            <AppContent />
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
