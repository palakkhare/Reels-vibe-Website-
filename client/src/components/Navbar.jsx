import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useState, useEffect, useRef } from 'react';
import {
  FiHome, FiCompass, FiPlusCircle, FiMessageCircle, FiBell,
  FiUser, FiSun, FiMoon, FiLogOut, FiMenu, FiX, FiSearch
} from 'react-icons/fi';

/* ─── Sound Wave Mini Component ─── */
function SoundWaveMini() {
  return (
    <div className="flex items-end gap-[2px] h-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="sound-bar" style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  );
}

export default function Navbar() {
  const { dark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { unreadMessages, unreadNotifications } = useSocket();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [bellAnimating, setBellAnimating] = useState(false);
  const searchRef = useRef(null);

  // Hide navbar on reels player and chat page
  if (location.pathname === '/reels' || location.pathname.startsWith('/chat/')) return null;

  // Animate bell when new notifications arrive
  useEffect(() => {
    if (unreadNotifications > 0) {
      setBellAnimating(true);
      const timer = setTimeout(() => setBellAnimating(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [unreadNotifications]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchFocused(false);
      searchRef.current?.blur();
    }
  };

  const navLinks = [
    { path: '/', icon: FiHome, label: 'Home' },
    { path: '/explore', icon: FiCompass, label: 'Explore' },
    ...(user ? [
      { path: '/upload', icon: FiPlusCircle, label: 'Upload', special: true },
      { path: '/chat', icon: FiMessageCircle, label: 'Chat', badge: unreadMessages },
      { path: '/notifications', icon: FiBell, label: 'Alerts', badge: unreadNotifications, bell: true },
      { path: `/profile/${user._id}`, icon: FiUser, label: 'Profile' },
    ] : []),
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 glass ${dark ? 'border-b border-white/[0.04]' : 'border-b border-black/[0.04]'}`}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 via-accent-500 to-neon-orange flex items-center justify-center shadow-lg glow-primary relative"
          >
            <span className="text-white font-bold text-lg">R</span>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-500 via-accent-500 to-neon-orange opacity-0 group-hover:opacity-50 blur-lg transition-opacity" />
          </motion.div>
          <span className="font-display font-bold text-xl hidden sm:block gradient-text">
            ReelVibe
          </span>
        </Link>

        {/* ── Search Bar ── */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center relative max-w-sm w-full mx-8">
          <motion.div
            animate={searchFocused ? { scale: 1.02 } : { scale: 1 }}
            className="relative w-full"
          >
            <FiSearch className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${
              searchFocused ? 'text-primary-400' : dark ? 'text-dark-400' : 'text-gray-400'
            }`} size={16} />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search users, reels, hashtags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-full text-sm transition-all duration-300 outline-none
                ${dark
                  ? 'bg-dark-700/80 text-white placeholder-dark-400'
                  : 'bg-gray-100 text-gray-900 placeholder-gray-400'
                }
                ${searchFocused
                  ? 'ring-2 ring-primary-500/50 shadow-lg shadow-primary-500/10 ' + (dark ? 'bg-dark-600' : 'bg-white')
                  : ''
                }
              `}
            />
            {/* Glow line when focused */}
            {searchFocused && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                className="absolute bottom-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-primary-500 to-transparent"
              />
            )}
          </motion.div>
        </form>

        {/* ── Nav Links ── */}
        <div className="hidden md:flex items-center gap-0.5">
          {navLinks.map(({ path, icon: Icon, label, badge, special, bell }) => {
            const isActive = location.pathname === path;
            return (
              <Link key={path} to={path} className="relative">
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-2.5 rounded-xl transition-all duration-200 relative
                    ${special
                      ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white mx-1 glow-primary'
                      : isActive
                        ? 'text-primary-400 bg-primary-500/10'
                        : dark ? 'text-dark-300 hover:text-white hover:bg-white/[0.04]' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  title={label}
                >
                  <Icon size={20} className={bell && bellAnimating ? 'animate-bell' : ''} />
                  {/* Badge */}
                  {badge > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-gradient-to-r from-accent-500 to-neon-pink text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-lg shadow-accent-500/30"
                    >
                      {badge > 9 ? '9+' : badge}
                    </motion.span>
                  )}
                  {/* Active dot */}
                  {isActive && !special && (
                    <motion.div
                      layoutId="navActive"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary-400 rounded-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  {/* Hover glow */}
                  {special && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 opacity-0 hover:opacity-40 blur-xl transition-opacity pointer-events-none" />
                  )}
                </motion.div>
              </Link>
            );
          })}

          {/* Divider */}
          <div className={`w-px h-6 mx-2 ${dark ? 'bg-white/[0.06]' : 'bg-black/[0.06]'}`} />

          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.15, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className={`p-2.5 rounded-xl transition-all duration-200 ${
              dark ? 'text-dark-300 hover:text-yellow-400 hover:bg-yellow-500/10' : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'
            }`}
          >
            <motion.div
              key={dark ? 'moon' : 'sun'}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {dark ? <FiSun size={18} /> : <FiMoon size={18} />}
            </motion.div>
          </motion.button>

          {/* Auth */}
          {user ? (
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={logout}
              className={`p-2.5 rounded-xl transition-colors ${
                dark ? 'text-dark-300 hover:text-red-400 hover:bg-red-500/10' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
              }`}
              title="Logout"
            >
              <FiLogOut size={18} />
            </motion.button>
          ) : (
            <Link to="/auth">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(108, 92, 231, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-semibold shadow-lg shadow-primary-500/20 btn-ripple"
              >
                Sign In
              </motion.button>
            </Link>
          )}
        </div>

        {/* ── Mobile Menu Toggle ── */}
        <div className="md:hidden flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className={`p-2 rounded-lg ${dark ? 'text-dark-300' : 'text-gray-400'}`}
          >
            {dark ? <FiSun size={18} /> : <FiMoon size={18} />}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMenuOpen(!menuOpen)}
            className={`p-2 rounded-lg ${dark ? 'text-white' : 'text-gray-900'}`}
          >
            <AnimatePresence mode="wait">
              <motion.div key={menuOpen ? 'close' : 'open'} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={`md:hidden overflow-hidden ${dark ? 'bg-dark-800/95 backdrop-blur-xl' : 'bg-white/95 backdrop-blur-xl'} border-t ${dark ? 'border-white/[0.04]' : 'border-black/[0.04]'}`}
          >
            <form onSubmit={handleSearch} className="px-4 pt-4">
              <div className="relative">
                <FiSearch className={`absolute left-3 top-2.5 ${dark ? 'text-dark-400' : 'text-gray-400'}`} size={16} />
                <input
                  type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-full text-sm outline-none ${dark ? 'bg-dark-700 text-white placeholder-dark-400' : 'bg-gray-100 text-gray-900 placeholder-gray-400'}`}
                />
              </div>
            </form>
            <div className="p-4 space-y-1">
              {navLinks.map(({ path, icon: Icon, label, badge }, i) => (
                <motion.div key={path} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link
                    to={path} onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      location.pathname === path ? 'text-primary-400 bg-primary-500/10' : dark ? 'text-dark-100 hover:bg-white/[0.04]' : 'text-gray-700 hover:bg-gray-50'
                    }`}>
                    <Icon size={20} />
                    <span className="font-medium">{label}</span>
                    {badge > 0 && (
                      <span className="ml-auto bg-gradient-to-r from-accent-500 to-neon-pink text-white text-xs px-2 py-0.5 rounded-full">{badge}</span>
                    )}
                  </Link>
                </motion.div>
              ))}
              <div className={`pt-3 mt-2 border-t ${dark ? 'border-white/[0.04]' : 'border-black/[0.04]'}`}>
                {user ? (
                  <button onClick={() => { logout(); setMenuOpen(false); }}
                    className="w-full py-3 rounded-xl text-sm font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                    <FiLogOut className="inline mr-2" /> Logout
                  </button>
                ) : (
                  <Link to="/auth" onClick={() => setMenuOpen(false)}
                    className="block w-full py-3 rounded-xl text-sm font-semibold text-center bg-gradient-to-r from-primary-500 to-accent-500 text-white">
                    Sign In ✨
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
