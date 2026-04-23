import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { FiHome, FiCompass, FiPlusCircle, FiMessageCircle, FiUser } from 'react-icons/fi';

export default function BottomNav() {
  const { dark } = useTheme();
  const { user } = useAuth();
  const { unreadMessages } = useSocket();
  const location = useLocation();

  // Hide on reels player and desktop
  if (location.pathname === '/reels') return null;
  if (!user) return null;

  const tabs = [
    { path: '/', icon: FiHome, label: 'Home' },
    { path: '/explore', icon: FiCompass, label: 'Explore' },
    { path: '/upload', icon: FiPlusCircle, label: 'Create', special: true },
    { path: '/chat', icon: FiMessageCircle, label: 'Chat', badge: unreadMessages },
    { path: `/profile/${user._id}`, icon: FiUser, label: 'Profile' },
  ];

  return (
    <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-50 safe-bottom glass ${dark ? 'border-t border-white/5' : 'border-t border-black/5'}`}>
      <div className="flex items-center justify-around py-2 px-2">
        {tabs.map(({ path, icon: Icon, label, badge, special }) => {
          const isActive = location.pathname === path;
          return (
            <Link key={path} to={path} className="relative flex flex-col items-center">
              {special ? (
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="w-11 h-11 -mt-4 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg glow-primary"
                >
                  <Icon size={22} className="text-white" />
                </motion.div>
              ) : (
                <motion.div whileTap={{ scale: 0.9 }} className="relative p-1.5">
                  <Icon
                    size={24}
                    className={`transition-colors ${isActive ? 'text-primary-500' : dark ? 'text-dark-300' : 'text-gray-400'}`}
                  />
                  {badge > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {badge > 9 ? '9+' : badge}
                    </span>
                  )}
                </motion.div>
              )}
              <span className={`text-[10px] mt-0.5 ${isActive ? 'text-primary-500 font-semibold' : dark ? 'text-dark-400' : 'text-gray-400'}`}>
                {label}
              </span>
              {isActive && !special && (
                <motion.div
                  layoutId="bottomNav"
                  className="absolute -bottom-2 w-5 h-0.5 bg-primary-500 rounded-full"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
