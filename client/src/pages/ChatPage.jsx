import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import API from '../api/axios';
import { FiChevronLeft, FiSend, FiImage, FiSmile, FiMoreVertical } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

export default function ChatPage() {
  const { userId } = useParams();
  const { dark } = useTheme();
  const { user } = useAuth();
  const { socket, isUserOnline } = useSocket();
  const [otherUser, setOtherUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const conversationId = [user?._id, userId].sort().join('_');
  const online = isUserOnline(userId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, messagesRes] = await Promise.all([
          API.get(`/auth/profile/${userId}`),
          API.get(`/chat/messages/${userId}`),
        ]);
        setOtherUser(profileRes.data);
        setMessages(messagesRes.data.messages || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [userId]);

  useEffect(() => {
    if (!socket) return;
    socket.emit('chat:join', conversationId);
    socket.emit('chat:read', { conversationId, userId: user._id });

    const handleMessage = (msg) => {
      setMessages(prev => [...prev, msg]);
      socket.emit('chat:read', { conversationId, userId: user._id });
    };
    const handleTyping = ({ userId: typerId, isTyping: typing }) => {
      if (typerId === userId) setIsTyping(typing);
    };

    socket.on('chat:message', handleMessage);
    socket.on('chat:typing', handleTyping);

    return () => {
      socket.emit('chat:leave', conversationId);
      socket.off('chat:message', handleMessage);
      socket.off('chat:typing', handleTyping);
    };
  }, [socket, conversationId, userId, user._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleTypingEmit = () => {
    if (!socket) return;
    socket.emit('chat:typing', { conversationId, userId: user._id, isTyping: true });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('chat:typing', { conversationId, userId: user._id, isTyping: false });
    }, 2000);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const msgText = text.trim();
    setText('');

    if (socket) {
      socket.emit('chat:message', { senderId: user._id, receiverId: userId, text: msgText });
      socket.emit('chat:typing', { conversationId, userId: user._id, isTyping: false });
    } else {
      try {
        const { data } = await API.post('/chat/send', { receiverId: userId, text: msgText });
        setMessages(prev => [...prev, data]);
      } catch (err) { console.error(err); }
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className={`flex items-center gap-3 px-4 py-3 glass ${dark ? 'border-b border-white/5' : 'border-b border-black/5'}`}>
        <Link to="/chat" className={`p-1.5 rounded-lg ${dark ? 'hover:bg-dark-700' : 'hover:bg-gray-100'}`}>
          <FiChevronLeft size={22} className={dark ? 'text-white' : 'text-gray-900'} />
        </Link>
        <Link to={`/profile/${userId}`} className="flex items-center gap-3 flex-1">
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              {otherUser?.avatar ? <img src={otherUser.avatar} alt="" className="w-full h-full object-cover" /> : (
                <div className="w-full h-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm">
                  {otherUser?.username?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
            {online && <div className="online-dot w-3 h-3" />}
          </div>
          <div>
            <p className={`font-semibold text-sm ${dark ? 'text-white' : 'text-gray-900'}`}>
              {otherUser?.fullName || otherUser?.username}
            </p>
            <p className={`text-xs ${online ? 'text-neon-green' : dark ? 'text-dark-400' : 'text-gray-400'}`}>
              {isTyping ? 'typing...' : online ? 'Online' : otherUser?.lastSeen ? `Last seen ${formatDistanceToNow(new Date(otherUser.lastSeen), { addSuffix: true })}` : 'Offline'}
            </p>
          </div>
        </Link>
      </div>

      {/* Messages */}
      <div className={`flex-1 overflow-y-auto px-4 py-4 space-y-3 ${dark ? 'bg-dark-900' : 'bg-gray-50'}`}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className={`w-8 h-8 border-3 ${dark ? 'border-dark-600 border-t-primary-500' : 'border-gray-200 border-t-primary-500'} rounded-full`} />
          </div>
        ) : (
          <>
            {messages.map((msg, i) => {
              const isMine = msg.sender?._id === user._id || msg.sender === user._id;
              const showAvatar = i === 0 || (messages[i - 1]?.sender?._id || messages[i - 1]?.sender) !== (msg.sender?._id || msg.sender);
              return (
                <motion.div
                  key={msg._id || i}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[75%] ${isMine ? 'order-2' : ''}`}>
                    <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                      ${isMine
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-br-md'
                        : dark ? 'bg-dark-700 text-white rounded-bl-md' : 'bg-white text-gray-900 rounded-bl-md shadow-sm'
                      }`}>
                      {msg.text}
                    </div>
                    <p className={`text-[10px] mt-1 ${isMine ? 'text-right' : ''} ${dark ? 'text-dark-500' : 'text-gray-400'}`}>
                      {msg.createdAt && formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </motion.div>
              );
            })}

            {/* Typing Indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-2">
                  <div className={`px-4 py-3 rounded-2xl rounded-bl-md ${dark ? 'bg-dark-700' : 'bg-white shadow-sm'}`}>
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <div key={i} className={`w-2 h-2 rounded-full typing-dot ${dark ? 'bg-dark-300' : 'bg-gray-400'}`} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <form onSubmit={sendMessage}
        className={`flex items-center gap-2 px-4 py-3 safe-bottom ${dark ? 'bg-dark-800 border-t border-white/5' : 'bg-white border-t border-gray-200'}`}>
        <input
          type="text" value={text}
          onChange={(e) => { setText(e.target.value); handleTypingEmit(); }}
          placeholder="Type a message..."
          className={`flex-1 px-4 py-2.5 rounded-full text-sm outline-none
            ${dark ? 'bg-dark-700 text-white placeholder-dark-400' : 'bg-gray-100 text-gray-900 placeholder-gray-400'}`}
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          disabled={!text.trim()}
          className="p-2.5 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white disabled:opacity-40"
        >
          <FiSend size={18} />
        </motion.button>
      </form>
    </div>
  );
}
