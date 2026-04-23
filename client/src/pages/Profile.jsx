import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import API from '../api/axios';
import { FiSettings, FiGrid, FiBookmark, FiHeart, FiPlay, FiMessageCircle, FiUserPlus, FiUserCheck, FiEdit2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Profile() {
  const { userId } = useParams();
  const { dark } = useTheme();
  const { user: currentUser, updateUser } = useAuth();
  const { isUserOnline } = useSocket();
  const [profile, setProfile] = useState(null);
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('reels');
  const [isFollowing, setIsFollowing] = useState(false);

  const isOwnProfile = currentUser?._id === userId;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [profileRes, reelsRes] = await Promise.all([
          API.get(`/auth/profile/${userId}`),
          API.get(`/reels/user/${userId}`),
        ]);
        setProfile(profileRes.data);
        setReels(reelsRes.data);
        setIsFollowing(profileRes.data.followers?.some(f => f._id === currentUser?._id));
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchProfile();
  }, [userId, currentUser?._id]);

  const handleFollow = async () => {
    if (!currentUser) return toast.error('Login first');
    try {
      const { data } = await API.post(`/auth/follow/${userId}`);
      setIsFollowing(data.isFollowing);
      setProfile(prev => ({
        ...prev,
        followers: data.isFollowing
          ? [...prev.followers, { _id: currentUser._id }]
          : prev.followers.filter(f => f._id !== currentUser._id),
      }));
      toast.success(data.message);
    } catch (err) { toast.error('Failed'); }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className={`w-8 h-8 border-3 ${dark ? 'border-dark-600 border-t-primary-500' : 'border-gray-200 border-t-primary-500'} rounded-full`} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <p className={dark ? 'text-dark-300' : 'text-gray-500'}>User not found</p>
      </div>
    );
  }

  const online = isUserOnline(userId);

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Profile Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          {/* Avatar */}
          <div className="relative inline-block mb-4">
            <div className={`w-24 h-24 rounded-full overflow-hidden border-4 ${online ? 'border-neon-green' : dark ? 'border-dark-600' : 'border-gray-200'}`}>
              {profile.avatar ? (
                <img src={profile.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-3xl font-bold">
                  {profile.username[0].toUpperCase()}
                </div>
              )}
            </div>
            {online && <div className="online-dot w-4 h-4 border-[3px]" style={{ bottom: '2px', right: '2px' }} />}
          </div>

          <h1 className={`text-xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
            {profile.fullName || profile.username}
            {profile.isVerified && <span className="ml-1 text-blue-400">✓</span>}
          </h1>
          <p className={`text-sm ${dark ? 'text-dark-300' : 'text-gray-500'}`}>@{profile.username}</p>
          {profile.bio && <p className={`text-sm mt-2 max-w-xs mx-auto ${dark ? 'text-dark-200' : 'text-gray-600'}`}>{profile.bio}</p>}
          {profile.website && (
            <a href={profile.website} target="_blank" rel="noreferrer" className="text-primary-500 text-sm mt-1 inline-block">{profile.website}</a>
          )}

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-5">
            {[
              { value: reels.length, label: 'Reels' },
              { value: profile.followers?.length || 0, label: 'Followers' },
              { value: profile.following?.length || 0, label: 'Following' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className={`text-lg font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>{value}</div>
                <div className={`text-xs ${dark ? 'text-dark-300' : 'text-gray-500'}`}>{label}</div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3 mt-5">
            {isOwnProfile ? (
              <>
                <Link to="/settings">
                  <motion.button whileTap={{ scale: 0.95 }}
                    className={`px-6 py-2.5 rounded-xl text-sm font-semibold ${dark ? 'bg-dark-700 text-white hover:bg-dark-600' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}>
                    <FiEdit2 className="inline mr-1" size={14} /> Edit Profile
                  </motion.button>
                </Link>
                <Link to="/settings">
                  <motion.button whileTap={{ scale: 0.95 }}
                    className={`p-2.5 rounded-xl ${dark ? 'bg-dark-700 text-white' : 'bg-gray-100 text-gray-900'}`}>
                    <FiSettings size={18} />
                  </motion.button>
                </Link>
              </>
            ) : (
              <>
                <motion.button whileTap={{ scale: 0.95 }} onClick={handleFollow}
                  className={`px-6 py-2.5 rounded-xl text-sm font-semibold ${isFollowing
                    ? (dark ? 'bg-dark-700 text-white' : 'bg-gray-100 text-gray-900')
                    : 'bg-gradient-to-r from-primary-500 to-accent-500 text-white'}`}>
                  {isFollowing ? <><FiUserCheck className="inline mr-1" /> Following</> : <><FiUserPlus className="inline mr-1" /> Follow</>}
                </motion.button>
                <Link to={`/chat/${userId}`}>
                  <motion.button whileTap={{ scale: 0.95 }}
                    className={`p-2.5 rounded-xl ${dark ? 'bg-dark-700 text-white' : 'bg-gray-100 text-gray-900'}`}>
                    <FiMessageCircle size={18} />
                  </motion.button>
                </Link>
              </>
            )}
          </div>
        </motion.div>

        {/* Tabs */}
        <div className={`flex border-b mb-4 ${dark ? 'border-dark-600' : 'border-gray-200'}`}>
          {[
            { key: 'reels', icon: FiGrid, label: 'Reels' },
            { key: 'liked', icon: FiHeart, label: 'Liked' },
            ...(isOwnProfile ? [{ key: 'saved', icon: FiBookmark, label: 'Saved' }] : []),
          ].map(({ key, icon: Icon, label }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-1.5 border-b-2 transition-colors
                ${activeTab === key ? 'border-primary-500 text-primary-500' : `border-transparent ${dark ? 'text-dark-300' : 'text-gray-400'}`}`}>
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>

        {/* Reels Grid */}
        <div className="grid grid-cols-3 gap-1">
          {reels.map((reel, i) => (
            <motion.div key={reel._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
              <Link to={`/reels?id=${reel._id}`} className="block aspect-[9/16] relative group rounded-lg overflow-hidden">
                <div className={`w-full h-full ${dark ? 'bg-dark-700' : 'bg-gray-200'}`}>
                  {reel.thumbnailUrl ? (
                    <img src={reel.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <video src={reel.videoUrl} className="w-full h-full object-cover" muted preload="metadata" />
                  )}
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-3 text-white text-xs font-medium">
                    <span className="flex items-center gap-1"><FiPlay size={14} />{reel.views}</span>
                    <span className="flex items-center gap-1"><FiHeart size={14} />{reel.likes?.length}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {reels.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">📹</div>
            <p className={dark ? 'text-dark-300' : 'text-gray-500'}>No reels yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
