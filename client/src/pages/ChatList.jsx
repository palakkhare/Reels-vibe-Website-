import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useSocket } from '../context/SocketContext';
import API from '../api/axios';
import { FiSearch, FiEdit, FiCheck } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

export default function ChatList() {
  const { dark } = useTheme();
  const { isUserOnline } = useSocket();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchConvos = async () => {
      try {
        const { data } = await API.get('/chat/conversations');
        setConversations(data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchConvos();
  }, []);

  const handleSearch = async (q) => {
    setSearch(q);
    if (q.trim().length > 1) {
      try {
        const { data } = await API.get(`/auth/search?q=${q}`);
        setSearchResults(data);
      } catch (err) { console.error(err); }
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8 px-4">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className={`text-2xl font-display font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>Messages</h1>
          <button className={`p-2 rounded-xl ${dark ? 'bg-dark-700 text-white' : 'bg-gray-100 text-gray-900'}`}>
            <FiEdit size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <FiSearch className={`absolute left-3 top-3 ${dark ? 'text-dark-300' : 'text-gray-400'}`} size={16} />
          <input type="text" value={search} onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search users to chat..."
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none
              ${dark ? 'bg-dark-700 text-white placeholder-dark-400' : 'bg-gray-100 text-gray-900 placeholder-gray-400'}`} />
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className={`mb-4 rounded-xl overflow-hidden ${dark ? 'bg-dark-800' : 'bg-white shadow'}`}>
            {searchResults.map(u => (
              <Link key={u._id} to={`/chat/${u._id}`}
                className={`flex items-center gap-3 p-3 transition-colors ${dark ? 'hover:bg-dark-700' : 'hover:bg-gray-50'}`}>
                <div className="w-10 h-10 rounded-full overflow-hidden relative flex-shrink-0">
                  {u.avatar ? <img src={u.avatar} alt="" className="w-full h-full object-cover" /> : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm">
                      {u.username[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <p className={`text-sm font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>{u.fullName || u.username}</p>
                  <p className={`text-xs ${dark ? 'text-dark-400' : 'text-gray-400'}`}>@{u.username}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Conversations */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3">
                <div className={`w-12 h-12 rounded-full skeleton ${dark ? 'bg-dark-700' : 'bg-gray-200'}`} />
                <div className="flex-1 space-y-2">
                  <div className={`h-3.5 w-24 rounded skeleton ${dark ? 'bg-dark-700' : 'bg-gray-200'}`} />
                  <div className={`h-3 w-40 rounded skeleton ${dark ? 'bg-dark-700' : 'bg-gray-200'}`} />
                </div>
              </div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">💬</div>
            <h3 className={`text-lg font-bold mb-1 ${dark ? 'text-white' : 'text-gray-900'}`}>No Conversations</h3>
            <p className={`text-sm ${dark ? 'text-dark-300' : 'text-gray-500'}`}>Search for users to start chatting</p>
          </div>
        ) : (
          <div className="space-y-1">
            {conversations.map((conv, i) => {
              const online = isUserOnline(conv.otherUser?._id);
              return (
                <motion.div key={conv.conversationId} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                  <Link to={`/chat/${conv.otherUser?._id}`}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${dark ? 'hover:bg-dark-700' : 'hover:bg-gray-50'}`}>
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        {conv.otherUser?.avatar ? <img src={conv.otherUser.avatar} alt="" className="w-full h-full object-cover" /> : (
                          <div className="w-full h-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold">
                            {conv.otherUser?.username?.[0]?.toUpperCase()}
                          </div>
                        )}
                      </div>
                      {online && <div className="online-dot" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`font-semibold text-sm ${dark ? 'text-white' : 'text-gray-900'}`}>
                          {conv.otherUser?.fullName || conv.otherUser?.username}
                        </p>
                        <span className={`text-xs ${dark ? 'text-dark-400' : 'text-gray-400'}`}>
                          {conv.lastMessage?.createdAt && formatDistanceToNow(new Date(conv.lastMessage.createdAt), { addSuffix: false })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className={`text-xs truncate ${conv.unreadCount > 0 ? (dark ? 'text-white font-semibold' : 'text-gray-900 font-semibold') : (dark ? 'text-dark-400' : 'text-gray-400')}`}>
                          {conv.lastMessage?.text || '📎 Media'}
                        </p>
                        {conv.unreadCount > 0 && (
                          <span className="w-5 h-5 bg-primary-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
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
