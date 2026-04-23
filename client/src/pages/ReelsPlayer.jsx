import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import API from '../api/axios';
import {
  FiHeart, FiMessageCircle, FiShare2, FiBookmark,
  FiMoreVertical, FiVolume2, FiVolumeX, FiChevronLeft,
  FiSend, FiX, FiMusic
} from 'react-icons/fi';
import toast from 'react-hot-toast';

/* ─── Sound Wave Visualizer ─── */
function SoundWave() {
  return (
    <div className="flex items-end gap-[3px] h-6 px-1">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="sound-bar w-[4px]" style={{ animationDelay: `${i * 0.1}s` }} />
      ))}
    </div>
  );
}

function SingleReel({ reel, isActive, onLike, onSave, onShare }) {
  const { user } = useAuth();
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [liked, setLiked] = useState(reel.likes?.includes(user?._id));
  const [likeCount, setLikeCount] = useState(reel.likes?.length || 0);
  const [saved, setSaved] = useState(reel.saves?.includes(user?._id));
  const [showHeart, setShowHeart] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isActive) {
      videoRef.current.play().catch(() => {});
      setPlaying(true);
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setPlaying(false);
    }
  }, [isActive]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) { videoRef.current.pause(); setPlaying(false); }
    else { videoRef.current.play(); setPlaying(true); }
  };

  const handleDoubleTap = () => {
    if (!user) return;
    if (!liked) handleLike();
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  };

  const handleLike = async () => {
    if (!user) return toast.error('Login to like');
    try {
      const { data } = await API.post(`/reels/${reel._id}/like`);
      setLiked(data.isLiked);
      setLikeCount(data.likeCount);
      onLike?.(reel._id, data);
    } catch (err) { console.error(err); }
  };

  const handleSave = async () => {
    if (!user) return toast.error('Login to save');
    try {
      const { data } = await API.post(`/reels/${reel._id}/save`);
      setSaved(data.isSaved);
      toast.success(data.isSaved ? 'Saved to collection' : 'Removed from collection');
      onSave?.(reel._id, data);
    } catch (err) { console.error(err); }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/reels?id=${reel._id}`);
      toast.success('Link copied to clipboard!');
      API.post(`/reels/${reel._id}/share`);
      onShare?.(reel._id);
    } catch (err) { toast.error('Failed to copy'); }
  };

  return (
    <div className="relative w-full h-full snap-start snap-always bg-black overflow-hidden">
      {/* Video with subtle zoom effect when playing */}
      <motion.video
        ref={videoRef}
        src={reel.videoUrl}
        autoPlay={isActive}
        animate={{ scale: playing ? 1.05 : 1 }}
        transition={{ duration: 10, ease: "linear" }}
        className="w-full h-full object-cover"
        loop
        muted={muted}
        playsInline
        crossOrigin="anonymous"
        onClick={togglePlay}
        onDoubleClick={handleDoubleTap}
        onWaiting={() => setVideoLoading(true)}
        onPlaying={() => {
          setVideoLoading(false);
          setPlaying(true);
        }}
        onLoadedData={() => {
          if (isActive) {
            videoRef.current.play().catch(() => {});
          }
        }}
        onCanPlay={() => {
          if (isActive) {
            videoRef.current.play().catch(() => {});
          }
        }}
        preload="auto"
      />

      {/* Loading Spinner */}
      <AnimatePresence>
        {videoLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glassy Play/Pause Overlay */}
      <AnimatePresence>
        {!playing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px]"
            onClick={togglePlay}
          >
            <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center glow-primary">
              <div className="w-0 h-0 border-l-[24px] border-l-white border-t-[16px] border-t-transparent border-b-[16px] border-b-transparent ml-2" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Double Tap Heart Burst */}
      <AnimatePresence>
        {showHeart && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 0 }}
            animate={{ scale: [0, 1.5, 1.2], opacity: [0, 1, 0], y: -50 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
          >
            <div className="relative">
              <FiHeart size={100} className="text-red-500 fill-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]" />
              {/* Particles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, scale: 1 }}
                  animate={{ x: (i % 2 === 0 ? 1 : -1) * (Math.random() * 60 + 20), y: (Math.random() * -100 - 20), scale: 0 }}
                  className="absolute top-1/2 left-1/2 w-3 h-3 bg-red-400 rounded-full"
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Side Actions (Premium Vertical Bar) */}
      <div className="absolute right-3 bottom-24 flex flex-col items-center gap-6 z-20">
        <div className="flex flex-col items-center gap-1 group">
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
            onClick={handleLike}
            className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 transition-all ${liked ? 'bg-red-500/20 border-red-500/50' : 'bg-white/10'}`}
          >
            <FiHeart size={26} className={`${liked ? 'text-red-500 fill-red-500' : 'text-white'}`} />
          </motion.button>
          <span className="text-white text-[11px] font-bold drop-shadow-md">{likeCount > 999 ? (likeCount/1000).toFixed(1)+'k' : likeCount}</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
            onClick={() => document.getElementById(`comments-${reel._id}`)?.showModal()}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center"
          >
            <FiMessageCircle size={26} className="text-white" />
          </motion.button>
          <span className="text-white text-[11px] font-bold drop-shadow-md">{reel.comments?.length || 0}</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
            onClick={handleShare}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center"
          >
            <FiShare2 size={24} className="text-white" />
          </motion.button>
          <span className="text-white text-[11px] font-bold drop-shadow-md">{reel.shares || 0}</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
          onClick={handleSave}
          className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 transition-all ${saved ? 'bg-yellow-500/20 border-yellow-500/50' : 'bg-white/10'}`}
        >
          <FiBookmark size={24} className={`${saved ? 'text-yellow-400 fill-yellow-400' : 'text-white'}`} />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={() => setMuted(!muted)}
          className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center"
        >
          {muted ? <FiVolumeX size={20} className="text-white/80" /> : <FiVolume2 size={20} className="text-white/80" />}
        </motion.button>
      </div>

      {/* Bottom Info Overlay (Glassmorphic) */}
      <div className="absolute bottom-0 left-0 right-16 p-5 z-20">
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent -z-10" />
        
        <div className="flex items-center gap-3 mb-4">
          <Link to={`/profile/${reel.user?._id || ''}`} className="relative group">
            <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-primary-500 via-accent-500 to-neon-orange animate-glow-rotate">
              <div className="w-full h-full rounded-full border-2 border-black overflow-hidden bg-dark-800 flex items-center justify-center">
                {reel.user?.avatar ? (
                  <img src={reel.user.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-bold">{reel.user?.username?.[0]?.toUpperCase() || '?'}</span>
                )}
              </div>
            </div>
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <Link to={`/profile/${reel.user?._id || ''}`} className="text-white font-bold text-base hover:underline drop-shadow-md">
                @{reel.user?.username || 'unknown'}
              </Link>
              {reel.user?.isVerified && <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-[10px] text-white">✓</div>}
              <span className="mx-1 text-white/60">·</span>
              <button className="text-sm font-bold text-primary-400 hover:text-primary-300 transition-colors">Follow</button>
            </div>
          </div>
        </div>

        <p className="text-white text-sm mb-3 line-clamp-3 leading-relaxed drop-shadow-md">
          {reel.caption}
        </p>

        {reel.hashtags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {reel.hashtags.map(tag => (
              <Link key={tag} to={`/explore?q=${tag}`} className="px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-sm text-primary-300 text-[11px] font-bold hover:bg-white/20 transition-all border border-white/5">
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Animated Music Bar */}
        <div className="flex items-center gap-3 py-2 px-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 w-fit max-w-full">
          <FiMusic className="text-primary-400 animate-pulse" size={14} />
          <div className="overflow-hidden">
            <motion.p 
              animate={{ x: [0, -100, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="text-white/90 text-xs font-medium whitespace-nowrap"
            >
              {reel.music?.title || 'Original Audio'} — {reel.music?.artist || reel.user?.username}
            </motion.p>
          </div>
          <SoundWave />
        </div>
      </div>
    </div>
  );
}

export default function ReelsPlayer() {
  const [reels, setReels] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const [searchParams] = useSearchParams();
  const reelId = searchParams.get('id');

  useEffect(() => {
    const fetchReels = async () => {
      try {
        setLoading(true);
        const { data } = await API.get('/reels/feed?limit=50');
        const allReels = data.reels || [];
        setReels(allReels);
        
        if (reelId) {
          const index = allReels.findIndex(r => r._id === reelId);
          if (index !== -1) {
            setActiveIndex(index);
          }
        }
      } catch (err) {
        console.error('Fetch reels failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReels();
  }, [reelId]);

  // Sync scroll position when activeIndex or reels change
  useEffect(() => {
    if (containerRef.current && reels.length > 0) {
      containerRef.current.scrollTo({
        top: activeIndex * containerRef.current.clientHeight,
        behavior: 'auto'
      });
    }
  }, [reels.length, activeIndex]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const scrollPos = containerRef.current.scrollTop;
    const itemHeight = containerRef.current.clientHeight;
    if (itemHeight === 0) return;
    const newIndex = Math.round(scrollPos / itemHeight);
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < reels.length) {
      setActiveIndex(newIndex);
    }
  };

  if (loading) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center">
      <div className="relative w-20 h-20 mb-4">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 border-4 border-primary-500/20 border-t-primary-500 rounded-full" 
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-2 border-4 border-accent-500/20 border-t-accent-500 rounded-full" 
        />
      </div>
      <p className="text-white/40 text-sm font-display tracking-widest uppercase animate-pulse">Loading Vibes</p>
    </div>
  );

  return (
    <div className="h-screen bg-black relative">
      <Link to="/" className="absolute top-6 left-6 z-50 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-all glow-primary">
        <FiChevronLeft size={24} />
      </Link>
      
      <div className="absolute top-7 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <h2 className="text-white font-display font-bold text-xl tracking-tight drop-shadow-lg">
          Reel<span className="gradient-text">Vibe</span>
        </h2>
      </div>

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar"
      >
        {reels.map((reel, i) => (
          <div key={reel._id} className="h-screen w-full">
            <SingleReel reel={reel} isActive={i === activeIndex} />
          </div>
        ))}
        {reels.length === 0 && (
          <div className="h-screen flex flex-col items-center justify-center text-center px-6">
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-8xl mb-8"
            >
              🎬
            </motion.div>
            <h3 className="text-3xl font-display font-bold text-white mb-4">No Reels Found</h3>
            <p className="text-dark-300 mb-8 max-w-xs mx-auto">It looks like there aren't any reels here yet. Why not be the first?</p>
            <Link to="/upload">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-bold shadow-lg shadow-primary-500/20"
              >
                Create a Reel
              </motion.button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
