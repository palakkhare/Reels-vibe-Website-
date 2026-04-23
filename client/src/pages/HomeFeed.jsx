import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { FiPlay, FiHeart, FiMessageCircle, FiTrendingUp, FiPlusCircle, FiUserPlus, FiHash } from 'react-icons/fi';

/* ─── Ambient Background Orbs ─── */
function AmbientBackground() {
  return (
    <div className="ambient-bg">
      <div className="ambient-orb" style={{ width: 500, height: 500, top: '-10%', left: '-10%', background: 'var(--color-primary-500)' }} />
      <div className="ambient-orb" style={{ width: 400, height: 400, bottom: '-5%', right: '-5%', background: 'var(--color-accent-500)', animationDelay: '-7s' }} />
      <div className="ambient-orb" style={{ width: 300, height: 300, top: '40%', right: '20%', background: 'var(--color-neon-cyan)', animationDelay: '-13s' }} />
    </div>
  );
}

/* ─── Floating Video Card (3D-style) ─── */
function FloatingCard({ delay, x, y, rotation, scale = 1 }) {
  const gradients = [
    'from-primary-500 to-accent-500',
    'from-accent-500 to-neon-orange',
    'from-neon-blue to-primary-500',
    'from-neon-cyan to-neon-blue',
    'from-neon-pink to-primary-400',
  ];
  const gradient = gradients[Math.floor(Math.random() * gradients.length)];

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0, y: 40, rotate: rotation - 5 }}
      animate={{ opacity: 1, y: 0, rotate: rotation }}
      transition={{ delay, duration: 0.8, type: 'spring' }}
    >
      <motion.div
        animate={{ y: [-8, 8, -8], rotate: [rotation, rotation + 3, rotation] }}
        transition={{ duration: 4 + delay, repeat: Infinity, ease: 'easeInOut' }}
        className={`w-20 h-32 sm:w-24 sm:h-40 rounded-2xl bg-gradient-to-br ${gradient} opacity-20 shadow-xl`}
        style={{ transform: `scale(${scale})` }}
      >
        <div className="w-full h-full rounded-2xl border border-white/10 flex items-center justify-center">
          <FiPlay className="text-white/40" size={20} />
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Clapperboard Animation ─── */
function ClapperboardAnim() {
  return (
    <motion.div
      className="relative mb-6"
      initial={{ scale: 0, rotate: -20 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      <motion.div
        animate={{ rotateZ: [0, -3, 0, 3, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="relative"
      >
        {/* Board */}
        <div className="w-28 h-24 rounded-xl bg-gradient-to-br from-dark-700 to-dark-600 border border-white/10 relative overflow-hidden">
          {/* Stripes on top */}
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-between px-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-1.5 h-5 bg-dark-900/40 rounded-sm transform -skew-x-12" />
            ))}
          </div>
          {/* Play icon */}
          <div className="absolute inset-0 flex items-center justify-center pt-4">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <FiPlay size={24} className="text-primary-400/60 ml-1" />
            </motion.div>
          </div>
        </div>
        {/* Glow underneath */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-4 rounded-full bg-primary-500/20 blur-lg" />
      </motion.div>
    </motion.div>
  );
}

/* ─── Suggested Creator Card ─── */
function CreatorCard({ name, username, delay }) {
  const { dark } = useTheme();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`flex-shrink-0 w-40 p-4 rounded-2xl neon-card cursor-pointer text-center`}
    >
      <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-primary-500 via-accent-500 to-neon-orange p-[2px] mb-3">
        <div className={`w-full h-full rounded-full ${dark ? 'bg-dark-800' : 'bg-white'} flex items-center justify-center`}>
          <span className="text-lg font-bold gradient-text">{name[0]}</span>
        </div>
      </div>
      <p className={`text-sm font-semibold truncate ${dark ? 'text-white' : 'text-gray-900'}`}>{name}</p>
      <p className={`text-xs truncate ${dark ? 'text-dark-300' : 'text-gray-500'}`}>@{username}</p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-3 w-full py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-primary-500 to-accent-500 text-white btn-ripple"
      >
        <FiUserPlus className="inline mr-1" size={12} /> Follow
      </motion.button>
    </motion.div>
  );
}

/* ─── Reel Card ─── */
function ReelCard({ reel, index }) {
  const { dark } = useTheme();
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.06, type: 'spring', stiffness: 200 }}
      whileHover={{ y: -6, scale: 1.03 }}
      className="group cursor-pointer"
    >
      <Link to={`/reels?id=${reel._id}`}>
        <div className="relative aspect-[9/16] rounded-2xl overflow-hidden neon-card">
          <div className={`absolute inset-0 ${dark ? 'bg-dark-800' : 'bg-gray-100'}`}>
            {reel.thumbnailUrl ? (
              <img src={reel.thumbnailUrl} alt={reel.caption} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            ) : (
              <video 
                src={reel.videoUrl} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100" 
                muted 
                autoPlay 
                loop 
                playsInline
                crossOrigin="anonymous"
                preload="auto" 
              />
            )}
          </div>
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
          <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <p className="text-white text-xs font-medium truncate">{reel.caption || 'Untitled'}</p>
            <div className="flex items-center gap-3 mt-1.5 text-white/80 text-[11px]">
              <span className="flex items-center gap-1"><FiHeart size={12} /> {reel.likes?.length || 0}</span>
              <span className="flex items-center gap-1"><FiMessageCircle size={12} /> {reel.comments?.length || 0}</span>
              <span className="flex items-center gap-1"><FiPlay size={12} /> {reel.views || 0}</span>
            </div>
          </div>
          {/* Play button center */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <motion.div whileHover={{ scale: 1.1 }}
              className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center glow-primary">
              <FiPlay size={22} className="text-white ml-0.5" />
            </motion.div>
          </div>
        </div>
      </Link>
      {/* User info */}
      <div className="mt-2.5 flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 overflow-hidden flex-shrink-0 p-[1.5px]">
          <div className={`w-full h-full rounded-full ${dark ? 'bg-dark-800' : 'bg-white'} flex items-center justify-center overflow-hidden`}>
            {reel.user?.avatar ? (
              <img src={reel.user.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-[10px] font-bold gradient-text">{reel.user?.username?.[0]?.toUpperCase()}</span>
            )}
          </div>
        </div>
        <span className={`text-xs font-medium truncate ${dark ? 'text-dark-200' : 'text-gray-600'}`}>
          @{reel.user?.username}
        </span>
      </div>
    </motion.div>
  );
}

/* ─── Skeleton Grid ─── */
function SkeletonGrid() {
  const { dark } = useTheme();
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.08 }}
          className="space-y-2.5"
        >
          <div className={`aspect-[9/16] rounded-2xl skeleton ${dark ? 'bg-dark-700' : 'bg-gray-200'}`} />
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full skeleton ${dark ? 'bg-dark-700' : 'bg-gray-200'}`} />
            <div className={`h-3 w-20 rounded-full skeleton ${dark ? 'bg-dark-700' : 'bg-gray-200'}`} />
          </div>
        </motion.div>
      ))}
    </>
  );
}

/* ─── Trending Hashtag Chip ─── */
function HashtagChip({ tag, count, delay }) {
  const { dark } = useTheme();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      whileHover={{ scale: 1.08, y: -2 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link to={`/explore?q=${tag}`}
        className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 neon-card transition-all
          ${dark ? 'text-primary-300' : 'text-primary-600'}`}>
        <FiHash size={12} className="text-primary-400" />
        {tag}
        {count && <span className={`ml-1 ${dark ? 'text-dark-400' : 'text-gray-400'}`}>· {count}</span>}
      </Link>
    </motion.div>
  );
}

/* ═══════════════ MAIN COMPONENT ═══════════════ */
export default function HomeFeed() {
  const { dark } = useTheme();
  const { user } = useAuth();
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [feedRes, trendRes] = await Promise.all([
          API.get('/reels/feed?limit=20'),
          API.get('/reels/hashtags/trending'),
        ]);
        setReels(feedRes.data.reels || []);
        setTrending(trendRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const suggestedCreators = [
    { name: 'Sarah Creates', username: 'sarah_creates' },
    { name: 'Alex Vibes', username: 'alex_vibes' },
    { name: 'Mia Fitness', username: 'mia_fitness' },
    { name: 'Foodie Jay', username: 'foodie_jay' },
    { name: 'Tech Guru', username: 'tech_guru' },
  ];

  const trendingTags = trending.length > 0 ? trending : [
    { tag: 'viral', count: 1240 }, { tag: 'trending', count: 980 },
    { tag: 'dance', count: 856 }, { tag: 'comedy', count: 743 },
    { tag: 'music', count: 692 }, { tag: 'art', count: 534 },
    { tag: 'food', count: 487 }, { tag: 'travel', count: 412 },
  ];

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8 px-4 relative">
      <AmbientBackground />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-6 mb-8 glass-strong relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-primary-500/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-accent-500/10 blur-3xl" />
          <div className="relative">
            <h1 className={`text-2xl sm:text-3xl font-display font-bold mb-1 ${dark ? 'text-white' : 'text-gray-900'}`}>
              {user ? (
                <>Welcome, <span className="gradient-text">{user.fullName || user.username}</span> 👋</>
              ) : (
                <>Discover <span className="gradient-text">Reels</span> 🎬</>
              )}
            </h1>
            <p className={`text-sm ${dark ? 'text-dark-300' : 'text-gray-500'}`}>
              Watch the latest short videos from creators worldwide
            </p>
          </div>
        </motion.div>

        {/* Trending Hashtags */}
        <div className="mb-8">
          <h2 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${dark ? 'text-dark-200' : 'text-gray-600'}`}>
            <FiTrendingUp className="text-primary-400" /> Trending Now
          </h2>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {trendingTags.map(({ tag, count }, i) => (
              <HashtagChip key={tag} tag={tag} count={count} delay={i * 0.05} />
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <SkeletonGrid />
          </div>
        ) : reels.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {reels.map((reel, i) => (
              <ReelCard key={reel._id} reel={reel} index={i} />
            ))}
          </div>
        ) : (
          /* ═══ STUNNING EMPTY STATE ═══ */
          <div className="relative">
            {/* Floating Video Cards Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ height: 400 }}>
              <FloatingCard delay={0.2} x={5} y={10} rotation={-12} scale={0.9} />
              <FloatingCard delay={0.4} x={75} y={5} rotation={8} scale={1.1} />
              <FloatingCard delay={0.6} x={20} y={55} rotation={-5} scale={0.7} />
              <FloatingCard delay={0.8} x={85} y={50} rotation={15} scale={0.8} />
              <FloatingCard delay={1.0} x={50} y={15} rotation={-8} scale={1} />
              <FloatingCard delay={0.3} x={40} y={60} rotation={10} scale={0.6} />
            </div>

            {/* Main Empty State Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative z-10 text-center py-16"
            >
              <ClapperboardAnim />

              <h3 className={`text-2xl sm:text-3xl font-display font-bold mb-3 ${dark ? 'text-white' : 'text-gray-900'}`}>
                Be the first to share your <span className="gradient-text">vibe</span> 🎥
              </h3>
              <p className={`text-sm max-w-md mx-auto mb-8 ${dark ? 'text-dark-300' : 'text-gray-500'}`}>
                The stage is set and the spotlight is yours. Upload a reel and start your creative journey!
              </p>

              {/* CTA Button */}
              {user ? (
                <Link to="/upload">
                  <motion.button
                    whileHover={{ scale: 1.06, boxShadow: '0 0 40px rgba(108, 92, 231, 0.5)' }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-primary-500 via-accent-500 to-neon-orange text-white font-bold text-base animate-pulse-glow btn-ripple"
                  >
                    <FiPlusCircle className="inline mr-2" size={20} />
                    Upload Your First Reel
                  </motion.button>
                </Link>
              ) : (
                <Link to="/auth">
                  <motion.button
                    whileHover={{ scale: 1.06, boxShadow: '0 0 40px rgba(108, 92, 231, 0.5)' }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-primary-500 via-accent-500 to-neon-orange text-white font-bold text-base animate-pulse-glow btn-ripple"
                  >
                    Join ReelVibe — It's Free ✨
                  </motion.button>
                </Link>
              )}
            </motion.div>

            {/* Suggested Creators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8"
            >
              <h3 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${dark ? 'text-dark-200' : 'text-gray-600'}`}>
                <FiUserPlus className="text-accent-500" /> Suggested Creators
              </h3>
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-3">
                {suggestedCreators.map((c, i) => (
                  <CreatorCard key={c.username} name={c.name} username={c.username} delay={0.7 + i * 0.08} />
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Floating Upload Button */}
      {user && (
        <Link to="/upload">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, type: 'spring' }}
            className="fab"
            title="Upload Reel"
          >
            <FiPlusCircle size={26} />
          </motion.div>
        </Link>
      )}
    </div>
  );
}
