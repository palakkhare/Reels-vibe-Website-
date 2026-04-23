import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import API from '../api/axios';
import { FiSearch, FiTrendingUp, FiHash, FiUsers, FiPlay, FiHeart } from 'react-icons/fi';

export default function Explore() {
  const { dark } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [activeTab, setActiveTab] = useState('reels');
  const [reels, setReels] = useState([]);
  const [users, setUsers] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    API.get('/reels/hashtags/trending').then(r => setTrending(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) { setQuery(q); performSearch(q); }
    else { fetchTrending(); }
  }, [searchParams]);

  const fetchTrending = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/reels/trending');
      setReels(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const performSearch = async (q) => {
    if (!q.trim()) return;
    setLoading(true);
    try {
      const [reelsRes, usersRes] = await Promise.all([
        API.get(`/reels/search?q=${q}`),
        API.get(`/auth/search?q=${q}`),
      ]);
      setReels(reelsRes.data);
      setUsers(usersRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Search */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative max-w-xl mx-auto">
            <FiSearch className={`absolute left-4 top-3.5 ${dark ? 'text-dark-300' : 'text-gray-400'}`} />
            <input
              type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search users, reels, hashtags..."
              className={`w-full pl-11 pr-4 py-3 rounded-2xl text-sm outline-none transition-all
                ${dark ? 'bg-dark-700 text-white placeholder-dark-300 focus:ring-2 focus:ring-primary-500/40' : 'bg-gray-100 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary-500/40'}`}
            />
          </div>
        </form>

        {/* Trending Tags */}
        {trending.length > 0 && !searchParams.get('q') && (
          <div className="mb-8">
            <h2 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${dark ? 'text-dark-200' : 'text-gray-600'}`}>
              <FiTrendingUp /> Trending Hashtags
            </h2>
            <div className="flex flex-wrap gap-2">
              {trending.map(({ tag, count }) => (
                <motion.button key={tag} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setSearchParams({ q: tag })}
                  className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors
                    ${dark ? 'bg-dark-700 text-dark-100 hover:bg-dark-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  <FiHash size={14} /> {tag} <span className={`text-xs ${dark ? 'text-dark-400' : 'text-gray-400'}`}>{count}</span>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Results Tabs */}
        {searchParams.get('q') && (
          <div className={`flex gap-1 mb-6 p-1 rounded-xl ${dark ? 'bg-dark-800' : 'bg-gray-100'}`}>
            {[
              { key: 'reels', icon: FiPlay, label: `Reels (${reels.length})` },
              { key: 'users', icon: FiUsers, label: `Users (${users.length})` },
            ].map(({ key, icon: Icon, label }) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition-colors
                  ${activeTab === key ? 'bg-primary-500 text-white' : dark ? 'text-dark-300' : 'text-gray-500'}`}>
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>
        )}

        {/* Users Results */}
        {activeTab === 'users' && searchParams.get('q') && (
          <div className="space-y-2 max-w-xl mx-auto">
            {users.map((u) => (
              <Link key={u._id} to={`/profile/${u._id}`}>
                <motion.div whileHover={{ x: 4 }}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${dark ? 'hover:bg-dark-700' : 'hover:bg-gray-50'}`}>
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    {u.avatar ? <img src={u.avatar} alt="" className="w-full h-full object-cover" /> : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold">
                        {u.username[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm ${dark ? 'text-white' : 'text-gray-900'}`}>
                      {u.fullName} {u.isVerified && <span className="text-blue-400">✓</span>}
                    </p>
                    <p className={`text-xs ${dark ? 'text-dark-300' : 'text-gray-500'}`}>@{u.username}</p>
                  </div>
                  <span className={`text-xs ${dark ? 'text-dark-400' : 'text-gray-400'}`}>{u.followers?.length || 0} followers</span>
                </motion.div>
              </Link>
            ))}
          </div>
        )}

        {/* Reels Grid */}
        {(activeTab === 'reels' || !searchParams.get('q')) && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className={`aspect-[9/16] rounded-2xl skeleton ${dark ? 'bg-dark-700' : 'bg-gray-200'}`} />
              ))
            ) : reels.map((reel, i) => (
              <motion.div key={reel._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}>
                <Link to={`/reels?id=${reel._id}`} className="block aspect-[9/16] relative group rounded-2xl overflow-hidden">
                  <div className={`w-full h-full ${dark ? 'bg-dark-700' : 'bg-gray-200'}`}>
                    {reel.thumbnailUrl ? <img src={reel.thumbnailUrl} alt="" className="w-full h-full object-cover" /> :
                      <video src={reel.videoUrl} className="w-full h-full object-cover" muted preload="metadata" />}
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition flex items-center gap-3 text-white text-xs">
                      <span className="flex items-center gap-1"><FiHeart />{reel.likes?.length}</span>
                      <span className="flex items-center gap-1"><FiPlay />{reel.views}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && reels.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">🔍</div>
            <p className={dark ? 'text-dark-300' : 'text-gray-500'}>
              {searchParams.get('q') ? 'No results found' : 'No trending reels yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
