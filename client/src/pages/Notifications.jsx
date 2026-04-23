import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useSocket } from '../context/SocketContext';
import API from '../api/axios';
import { FiHeart, FiMessageCircle, FiUserPlus, FiAtSign, FiBell, FiCheck } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

const ICONS = {
  like: { icon: FiHeart, color: 'text-red-500', bg: 'bg-red-500/10' },
  comment: { icon: FiMessageCircle, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  follow: { icon: FiUserPlus, color: 'text-neon-green', bg: 'bg-green-500/10' },
  mention: { icon: FiAtSign, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  message: { icon: FiMessageCircle, color: 'text-primary-500', bg: 'bg-primary-500/10' },
};

export default function Notifications() {
  const { dark } = useTheme();
  const { resetUnreadNotifications } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get('/notifications');
        setNotifications(data.notifications);
        resetUnreadNotifications();
        API.put('/notifications/read-all');
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const getNotifText = (n) => {
    switch (n.type) {
      case 'like': return 'liked your reel';
      case 'comment': return `commented: "${n.message}"`;
      case 'follow': return 'started following you';
      case 'mention': return 'mentioned you';
      case 'message': return `sent you a message`;
      default: return 'interacted with you';
    }
  };

  const getNotifLink = (n) => {
    switch (n.type) {
      case 'like':
      case 'comment': return n.reel ? `/reels?id=${n.reel._id || n.reel}` : '#';
      case 'follow': return `/profile/${n.sender?._id}`;
      case 'message': return `/chat/${n.sender?._id}`;
      default: return '#';
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8 px-4">
      <div className="max-w-xl mx-auto">
        <h1 className={`text-2xl font-display font-bold mb-6 ${dark ? 'text-white' : 'text-gray-900'}`}>
          <FiBell className="inline mr-2" /> Notifications
        </h1>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3">
                <div className={`w-11 h-11 rounded-full skeleton ${dark ? 'bg-dark-700' : 'bg-gray-200'}`} />
                <div className="flex-1 space-y-2">
                  <div className={`h-3.5 w-48 rounded skeleton ${dark ? 'bg-dark-700' : 'bg-gray-200'}`} />
                  <div className={`h-3 w-24 rounded skeleton ${dark ? 'bg-dark-700' : 'bg-gray-200'}`} />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-3">🔔</div>
            <h3 className={`text-lg font-bold mb-1 ${dark ? 'text-white' : 'text-gray-900'}`}>No Notifications</h3>
            <p className={`text-sm ${dark ? 'text-dark-300' : 'text-gray-500'}`}>You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-1">
            {notifications.map((n, i) => {
              const config = ICONS[n.type] || ICONS.like;
              const Icon = config.icon;
              return (
                <motion.div key={n._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                  <Link to={getNotifLink(n)}
                    className={`flex items-start gap-3 p-3 rounded-xl transition-colors
                      ${!n.isRead ? (dark ? 'bg-primary-500/5' : 'bg-primary-50') : ''}
                      ${dark ? 'hover:bg-dark-700' : 'hover:bg-gray-50'}`}>
                    <div className="relative flex-shrink-0">
                      <div className="w-11 h-11 rounded-full overflow-hidden">
                        {n.sender?.avatar ? <img src={n.sender.avatar} alt="" className="w-full h-full object-cover" /> : (
                          <div className="w-full h-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm">
                            {n.sender?.username?.[0]?.toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center ${config.bg}`}>
                        <Icon size={10} className={config.color} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${dark ? 'text-white' : 'text-gray-900'}`}>
                        <span className="font-semibold">@{n.sender?.username}</span>{' '}
                        <span className={dark ? 'text-dark-200' : 'text-gray-600'}>{getNotifText(n)}</span>
                      </p>
                      <p className={`text-xs mt-0.5 ${dark ? 'text-dark-400' : 'text-gray-400'}`}>
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    {n.reel?.thumbnailUrl && (
                      <div className="w-10 h-14 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={n.reel.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
