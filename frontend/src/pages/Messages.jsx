import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Search, Phone, Video, MoreVertical, Smile, Paperclip, ImageIcon, MessageSquare, ArrowLeft } from 'lucide-react';

const MOCK_CONTACTS = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    avatar: 'https://i.pravatar.cc/150?img=47',
    lastMessage: 'Hey! Did you finish the ML assignment?',
    time: '2m ago',
    unread: 3,
    online: true,
  },
  {
    id: 2,
    name: 'Raj Patel',
    avatar: 'https://i.pravatar.cc/150?img=52',
    lastMessage: 'The hackathon starts at 9 AM tomorrow 🚀',
    time: '15m ago',
    unread: 1,
    online: true,
  },
  {
    id: 3,
    name: 'Emily Chen',
    avatar: 'https://i.pravatar.cc/150?img=23',
    lastMessage: 'Thanks for the notes! Really helpful.',
    time: '1h ago',
    unread: 0,
    online: false,
  },
  {
    id: 4,
    name: 'Marcus Johnson',
    avatar: 'https://i.pravatar.cc/150?img=60',
    lastMessage: 'Are you coming to the robotics meeting?',
    time: '3h ago',
    unread: 0,
    online: true,
  },
  {
    id: 5,
    name: 'Priya Sharma',
    avatar: 'https://i.pravatar.cc/150?img=44',
    lastMessage: 'Let me know when you submit the report.',
    time: '5h ago',
    unread: 0,
    online: false,
  },
  {
    id: 6,
    name: 'David Kim',
    avatar: 'https://i.pravatar.cc/150?img=14',
    lastMessage: 'Great presentation today! 👏',
    time: 'Yesterday',
    unread: 0,
    online: false,
  },
];

const MOCK_MESSAGES = {
  1: [
    { id: 1, senderId: 1, text: 'Hey Alex! How are you doing?', time: '10:00 AM', type: 'received' },
    { id: 2, senderId: 'me', text: 'Hey Sarah! I\'m good, just working on the project. You?', time: '10:02 AM', type: 'sent' },
    { id: 3, senderId: 1, text: 'Same here! The ML assignment is really tricky this time 😩', time: '10:05 AM', type: 'received' },
    { id: 4, senderId: 'me', text: 'Yeah, especially the backpropagation section. Have you tried using PyTorch for it?', time: '10:08 AM', type: 'sent' },
    { id: 5, senderId: 1, text: 'Not yet! That\'s a good idea. Can you share your notebook?', time: '10:10 AM', type: 'received' },
    { id: 6, senderId: 'me', text: 'Sure, I\'ll push it to GitHub and share the link tonight.', time: '10:12 AM', type: 'sent' },
    { id: 7, senderId: 1, text: 'You\'re the best! 🙌', time: '10:13 AM', type: 'received' },
    { id: 8, senderId: 1, text: 'Hey! Did you finish the ML assignment?', time: '2:30 PM', type: 'received' },
  ],
  2: [
    { id: 1, senderId: 2, text: 'Yo! You signed up for the hackathon yet?', time: '9:00 AM', type: 'received' },
    { id: 2, senderId: 'me', text: 'Just did! Team CodeCrafters is locked in 💪', time: '9:05 AM', type: 'sent' },
    { id: 3, senderId: 2, text: 'Awesome! We need to finalize the tech stack tonight.', time: '9:10 AM', type: 'received' },
    { id: 4, senderId: 'me', text: 'I\'m thinking React + FastAPI + PostgreSQL. What do you think?', time: '9:15 AM', type: 'sent' },
    { id: 5, senderId: 2, text: 'Perfect combo! I\'ll set up the backend repo.', time: '9:20 AM', type: 'received' },
    { id: 6, senderId: 2, text: 'The hackathon starts at 9 AM tomorrow 🚀', time: '11:00 AM', type: 'received' },
  ],
  3: [
    { id: 1, senderId: 'me', text: 'Hey Emily! Here are the Data Structures notes from today.', time: '3:00 PM', type: 'sent' },
    { id: 2, senderId: 3, text: 'Oh my god, thank you so much! I missed the lecture due to the dentist appointment 😅', time: '3:30 PM', type: 'received' },
    { id: 3, senderId: 'me', text: 'No worries! The professor covered AVL trees and Red-Black trees.', time: '3:32 PM', type: 'sent' },
    { id: 4, senderId: 3, text: 'Thanks for the notes! Really helpful.', time: '3:45 PM', type: 'received' },
  ],
  4: [
    { id: 1, senderId: 4, text: 'Hey, the robotics club meeting got moved to Lab 3.', time: '1:00 PM', type: 'received' },
    { id: 2, senderId: 'me', text: 'Got it! What time?', time: '1:05 PM', type: 'sent' },
    { id: 3, senderId: 4, text: '4 PM. We\'re testing the new Arduino prototypes.', time: '1:06 PM', type: 'received' },
    { id: 4, senderId: 4, text: 'Are you coming to the robotics meeting?', time: '2:00 PM', type: 'received' },
  ],
  5: [
    { id: 1, senderId: 5, text: 'Hi Alex! The group project report is due Friday.', time: '11:00 AM', type: 'received' },
    { id: 2, senderId: 'me', text: 'Yes, I\'m working on the introduction section today.', time: '11:15 AM', type: 'sent' },
    { id: 3, senderId: 5, text: 'Great! I\'ll handle the methodology.', time: '11:20 AM', type: 'received' },
    { id: 4, senderId: 5, text: 'Let me know when you submit the report.', time: '11:30 AM', type: 'received' },
  ],
  6: [
    { id: 1, senderId: 6, text: 'Hey, your capstone presentation was fire today! 🔥', time: '5:00 PM', type: 'received' },
    { id: 2, senderId: 'me', text: 'Thanks David! I was so nervous 😂', time: '5:10 PM', type: 'sent' },
    { id: 3, senderId: 6, text: 'Great presentation today! 👏', time: '5:15 PM', type: 'received' },
  ],
};

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 px-4 py-2">
      <div className="bg-white border border-slate-200/60 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
        <div className="flex gap-1.5 items-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-slate-400 rounded-full"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Messages() {
  const [selectedContact, setSelectedContact] = useState(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTyping, setShowTyping] = useState(false);
  const [conversations, setConversations] = useState(MOCK_MESSAGES);

  const filteredContacts = MOCK_CONTACTS.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeContact = MOCK_CONTACTS.find((c) => c.id === selectedContact);
  const activeMessages = conversations[selectedContact] || [];

  const handleSend = () => {
    if (!message.trim() || !selectedContact) return;

    const newMessage = {
      id: Date.now(),
      senderId: 'me',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'sent',
    };

    setConversations((prev) => ({
      ...prev,
      [selectedContact]: [...(prev[selectedContact] || []), newMessage],
    }));
    setMessage('');

    // Simulate typing indicator and reply
    setShowTyping(true);
    setTimeout(() => {
      setShowTyping(false);
      const replies = [
        'Sounds good! 👍', 'Let me check and get back to you.',
        'That\'s awesome!', 'I\'ll be there!', 'Sure, no problem! 😊',
      ];
      const reply = {
        id: Date.now() + 1,
        senderId: selectedContact,
        text: replies[Math.floor(Math.random() * replies.length)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'received',
      };
      setConversations((prev) => ({
        ...prev,
        [selectedContact]: [...(prev[selectedContact] || []), reply],
      }));
    }, 2000);
  };

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />

      <main className="flex-1 flex h-screen overflow-hidden">
        {/* Conversation List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className={`${selectedContact ? 'hidden md:flex' : 'flex'} w-full md:w-96 flex-col bg-white/80 backdrop-blur-xl border-r border-slate-200/60`}
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-200/60">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-display font-bold text-slate-900">Messages</h1>
              <div className="flex items-center gap-1">
                <button className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-500">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none"
              />
            </div>
          </div>

          {/* Contact List */}
          <div className="flex-1 overflow-y-auto">
            {filteredContacts.map((contact, index) => (
              <motion.button
                key={contact.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                onClick={() => setSelectedContact(contact.id)}
                className={`w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-all duration-200 border-b border-slate-100/60 text-left ${
                  selectedContact === contact.id
                    ? 'bg-brand-50/60 border-l-2 border-l-brand-500'
                    : ''
                }`}
              >
                {/* Avatar with online status */}
                <div className="relative flex-shrink-0">
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
                  />
                  {contact.online && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                  )}
                </div>

                {/* Contact Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-semibold text-sm text-slate-900 truncate">{contact.name}</span>
                    <span className="text-xs text-slate-400 flex-shrink-0 ml-2">{contact.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{contact.lastMessage}</p>
                </div>

                {/* Unread Badge */}
                {contact.unread > 0 && (
                  <span className="flex-shrink-0 bg-brand-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {contact.unread}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Chat Panel */}
        <div className={`${selectedContact ? 'flex' : 'hidden md:flex'} flex-1 flex-col bg-gradient-to-b from-slate-50 to-slate-100/50`}>
          {selectedContact && activeContact ? (
            <>
              {/* Chat Header */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-xl border-b border-slate-200/60"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedContact(null)}
                    className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 mr-1"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="relative">
                    <img
                      src={activeContact.avatar}
                      alt={activeContact.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
                    />
                    {activeContact.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">{activeContact.name}</h3>
                    <p className="text-xs text-emerald-600 font-medium">
                      {activeContact.online ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button className="p-2.5 rounded-xl hover:bg-slate-100 transition-colors text-slate-500">
                    <Phone className="w-4.5 h-4.5" />
                  </button>
                  <button className="p-2.5 rounded-xl hover:bg-slate-100 transition-colors text-slate-500">
                    <Video className="w-4.5 h-4.5" />
                  </button>
                  <button className="p-2.5 rounded-xl hover:bg-slate-100 transition-colors text-slate-500">
                    <MoreVertical className="w-4.5 h-4.5" />
                  </button>
                </div>
              </motion.div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-1">
                <AnimatePresence initial={false}>
                  {activeMessages.map((msg, index) => {
                    const isSent = msg.type === 'sent';
                    const showAvatar = !isSent && (index === 0 || activeMessages[index - 1]?.type === 'sent');
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className={`flex items-end gap-2 ${isSent ? 'justify-end' : 'justify-start'}`}
                      >
                        {!isSent && showAvatar && (
                          <img
                            src={activeContact.avatar}
                            alt=""
                            className="w-7 h-7 rounded-full flex-shrink-0 mb-5"
                          />
                        )}
                        {!isSent && !showAvatar && <div className="w-7 flex-shrink-0" />}
                        <div className={`max-w-[70%] ${isSent ? 'items-end' : 'items-start'}`}>
                          <div
                            className={`px-4 py-2.5 text-sm leading-relaxed ${
                              isSent
                                ? 'bg-gradient-to-br from-brand-500 to-brand-600 text-white rounded-2xl rounded-br-md shadow-md shadow-brand-500/20'
                                : 'bg-white text-slate-800 rounded-2xl rounded-bl-md shadow-sm border border-slate-200/60'
                            }`}
                          >
                            {msg.text}
                          </div>
                          <p className={`text-[10px] text-slate-400 mt-1 px-1 ${isSent ? 'text-right' : 'text-left'}`}>
                            {msg.time}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                {showTyping && <TypingIndicator />}
              </div>

              {/* Message Input */}
              <div className="px-6 py-4 bg-white/80 backdrop-blur-xl border-t border-slate-200/60">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <button className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600">
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <button className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600">
                      <ImageIcon className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Type a message..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all pr-12"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors text-slate-400">
                      <Smile className="w-5 h-5" />
                    </button>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSend}
                    disabled={!message.trim()}
                    className="p-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-2xl shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 transition-all disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="relative"
              >
                <div className="w-28 h-28 bg-gradient-to-br from-brand-100 to-indigo-100 rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-lg shadow-brand-200/30">
                  <MessageSquare className="w-14 h-14 text-brand-500" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-brand-400 to-indigo-500 rounded-lg opacity-60 animate-pulse" />
                <div className="absolute -bottom-1 -left-3 w-6 h-6 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-md opacity-40 animate-pulse" style={{ animationDelay: '0.5s' }} />
              </motion.div>
              <h2 className="text-xl font-display font-bold text-slate-900 mb-2">Your Messages</h2>
              <p className="text-sm text-slate-500 max-w-xs">
                Select a conversation from the list to start chatting with your campus friends.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
