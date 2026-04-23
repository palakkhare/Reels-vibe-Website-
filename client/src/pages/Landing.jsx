import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { FiPlay, FiMessageCircle, FiTrendingUp, FiUsers, FiZap, FiArrowRight } from 'react-icons/fi';

const floatingEmojis = ['🎬', '🔥', '💬', '❤️', '🎵', '✨', '🚀', '🎥'];

export default function Landing() {
  const { dark } = useTheme();
  const { user } = useAuth();
  const [currentWord, setCurrentWord] = useState(0);
  const words = ['Create.', 'Share.', 'Connect.', 'Inspire.'];

  useEffect(() => {
    const interval = setInterval(() => setCurrentWord(i => (i + 1) % words.length), 2000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: FiPlay, title: 'Short Video Reels', desc: 'Create and share 60-second videos with music, effects, and filters', color: 'from-primary-500 to-primary-700' },
    { icon: FiMessageCircle, title: 'Real-time Chat', desc: 'Instant messaging with typing indicators, read receipts, and media sharing', color: 'from-accent-500 to-accent-600' },
    { icon: FiTrendingUp, title: 'Discover Trends', desc: 'Explore trending reels, hashtags, and connect with creators worldwide', color: 'from-neon-green to-neon-blue' },
    { icon: FiUsers, title: 'Build Community', desc: 'Follow creators, engage with content, and grow your audience', color: 'from-neon-orange to-neon-pink' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className={`absolute inset-0 ${dark ? 'bg-dark-900' : 'bg-gray-50'}`} />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            className="absolute top-1/4 -left-32 w-96 h-96 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, var(--color-primary-500), transparent 70%)' }}
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
            className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, var(--color-accent-500), transparent 70%)' }}
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 100, repeat: Infinity, ease: 'linear' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, var(--color-neon-blue), transparent 70%)' }}
          />
        </div>

        {/* Floating Emojis */}
        {floatingEmojis.map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl select-none pointer-events-none"
            initial={{ opacity: 0, y: 100 }}
            animate={{
              opacity: [0, 0.6, 0],
              y: [-20, -200],
              x: Math.sin(i * 0.8) * 50,
            }}
            transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: i * 0.8 }}
            style={{ left: `${10 + i * 11}%`, top: `${60 + Math.sin(i) * 10}%` }}
          >
            {emoji}
          </motion.div>
        ))}

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          {/* Logo Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
          >
            <FiZap className="text-primary-500" />
            <span className={`text-sm font-medium ${dark ? 'text-dark-100' : 'text-gray-700'}`}>
              The Next Generation Social Platform
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-5xl sm:text-7xl lg:text-8xl font-display font-bold leading-tight mb-6"
          >
            <span className={dark ? 'text-white' : 'text-gray-900'}>Reel</span>
            <span className="gradient-text">Vibe</span>
          </motion.h1>

          {/* Animated Words */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="h-16 flex items-center justify-center mb-6"
          >
            <motion.span
              key={currentWord}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-3xl sm:text-5xl font-display font-bold gradient-text"
            >
              {words[currentWord]}
            </motion.span>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className={`text-lg sm:text-xl max-w-2xl mx-auto mb-10 ${dark ? 'text-dark-200' : 'text-gray-600'}`}
          >
            Share short videos, connect with friends through real-time chat,
            and discover trending content from creators worldwide.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to={user ? '/reels' : '/auth'}>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(108, 92, 231, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-primary-500 via-accent-500 to-neon-orange text-white font-bold text-lg flex items-center gap-2 glow-primary"
              >
                <FiPlay /> Start Watching
              </motion.button>
            </Link>
            <Link to="/explore">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-2 glass ${dark ? 'text-white' : 'text-gray-900'}`}
              >
                Explore <FiArrowRight />
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex items-center justify-center gap-8 sm:gap-16 mt-16"
          >
            {[
              { value: '10K+', label: 'Creators' },
              { value: '500K+', label: 'Reels' },
              { value: '1M+', label: 'Likes' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold gradient-text">{value}</div>
                <div className={`text-sm ${dark ? 'text-dark-300' : 'text-gray-500'}`}>{label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className={`w-6 h-10 rounded-full border-2 ${dark ? 'border-dark-400' : 'border-gray-400'} flex justify-center pt-2`}>
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`w-1.5 h-1.5 rounded-full ${dark ? 'bg-dark-300' : 'bg-gray-400'}`}
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className={`py-24 px-4 ${dark ? 'bg-dark-800/50' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-3xl sm:text-5xl font-display font-bold mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>
              Everything You Need
            </h2>
            <p className={`text-lg max-w-xl mx-auto ${dark ? 'text-dark-200' : 'text-gray-600'}`}>
              A complete social experience — from short-form video to real-time messaging.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`p-6 rounded-2xl glass cursor-default`}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4`}>
                  <Icon size={26} className="text-white" />
                </div>
                <h3 className={`text-lg font-bold mb-2 ${dark ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
                <p className={`text-sm leading-relaxed ${dark ? 'text-dark-200' : 'text-gray-600'}`}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-accent-500/10 to-neon-orange/10" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative max-w-3xl mx-auto text-center"
        >
          <h2 className={`text-3xl sm:text-5xl font-display font-bold mb-6 ${dark ? 'text-white' : 'text-gray-900'}`}>
            Ready to Go <span className="gradient-text">Viral</span>?
          </h2>
          <p className={`text-lg mb-8 ${dark ? 'text-dark-200' : 'text-gray-600'}`}>
            Join thousands of creators sharing their stories through short videos.
          </p>
          <Link to={user ? '/reels' : '/auth'}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-bold text-lg glow-primary"
            >
              Get Started — It's Free
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className={`py-8 px-4 text-center ${dark ? 'border-t border-white/5 text-dark-400' : 'border-t border-black/5 text-gray-400'}`}>
        <p className="text-sm">© 2024 ReelVibe. Built with ❤️</p>
      </footer>
    </div>
  );
}
