import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Heart, MessageCircle, Calendar, AtSign, Settings, Check, CheckCheck, Trash2, BellOff, Users, Star, Award } from 'lucide-react';

const TABS = [
  { label: 'All', icon: Bell },
  { label: 'Mentions', icon: AtSign },
  { label: 'Likes', icon: Heart },
  { label: 'Comments', icon: MessageCircle },
  { label: 'Events', icon: Calendar },
  { label: 'System', icon: Settings },
];

const NOTIFICATION_ICONS = {
  like: { icon: Heart, bg: 'bg-rose-100', color: 'text-rose-500' },
  comment: { icon: MessageCircle, bg: 'bg-blue-100', color: 'text-blue-500' },
  mention: { icon: AtSign, bg: 'bg-violet-100', color: 'text-violet-500' },
  event: { icon: Calendar, bg: 'bg-amber-100', color: 'text-amber-600' },
  system: { icon: Settings, bg: 'bg-slate-100', color: 'text-slate-500' },
  follow: { icon: Users, bg: 'bg-emerald-100', color: 'text-emerald-500' },
  achievement: { icon: Award, bg: 'bg-indigo-100', color: 'text-indigo-500' },
};

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'like',
    tab: 'Likes',
    user: { name: 'Sarah Jenkins', avatar: 'https://i.pravatar.cc/150?img=47' },
    action: 'liked your post about React Spring Boot integration',
    time: '2 minutes ago',
    timeGroup: 'Today',
    read: false,
  },
  {
    id: 2,
    type: 'comment',
    tab: 'Comments',
    user: { name: 'Raj Patel', avatar: 'https://i.pravatar.cc/150?img=52' },
    action: 'commented on your post: "Great work! The deployment setup is very clean."',
    time: '15 minutes ago',
    timeGroup: 'Today',
    read: false,
  },
  {
    id: 3,
    type: 'mention',
    tab: 'Mentions',
    user: { name: 'Emily Chen', avatar: 'https://i.pravatar.cc/150?img=23' },
    action: 'mentioned you in a comment: "@Alex check out this library for the project!"',
    time: '1 hour ago',
    timeGroup: 'Today',
    read: false,
  },
  {
    id: 4,
    type: 'event',
    tab: 'Events',
    user: { name: 'Robotics Club', avatar: 'https://i.pravatar.cc/150?img=33' },
    action: 'posted a new event: RoboWars — Clash of Bots. Registration is now open!',
    time: '2 hours ago',
    timeGroup: 'Today',
    read: false,
  },
  {
    id: 5,
    type: 'follow',
    tab: 'All',
    user: { name: 'Marcus Johnson', avatar: 'https://i.pravatar.cc/150?img=60' },
    action: 'started following you',
    time: '3 hours ago',
    timeGroup: 'Today',
    read: true,
  },
  {
    id: 6,
    type: 'like',
    tab: 'Likes',
    user: { name: 'Priya Sharma', avatar: 'https://i.pravatar.cc/150?img=44' },
    action: 'liked your comment on "ML Assignment 3" discussion',
    time: '5 hours ago',
    timeGroup: 'Today',
    read: true,
  },
  {
    id: 7,
    type: 'system',
    tab: 'System',
    user: { name: 'CampusConnect', avatar: 'https://i.pravatar.cc/150?img=65' },
    action: 'Your profile has been verified. You now have a blue badge! ✅',
    time: 'Yesterday',
    timeGroup: 'Yesterday',
    read: true,
  },
  {
    id: 8,
    type: 'comment',
    tab: 'Comments',
    user: { name: 'David Kim', avatar: 'https://i.pravatar.cc/150?img=14' },
    action: 'replied to your comment: "I agree, PyTorch is much more intuitive."',
    time: 'Yesterday',
    timeGroup: 'Yesterday',
    read: true,
  },
  {
    id: 9,
    type: 'event',
    tab: 'Events',
    user: { name: 'E-Cell', avatar: 'https://i.pravatar.cc/150?img=22' },
    action: 'Reminder: Startup Pitch Deck Workshop is tomorrow at 4 PM, Seminar Hall 1.',
    time: 'Yesterday',
    timeGroup: 'Yesterday',
    read: true,
  },
  {
    id: 10,
    type: 'achievement',
    tab: 'System',
    user: { name: 'CampusConnect', avatar: 'https://i.pravatar.cc/150?img=65' },
    action: 'Congratulations! You earned the "Rising Star" badge for 100+ likes on your posts. 🌟',
    time: '3 days ago',
    timeGroup: 'Earlier',
    read: true,
  },
  {
    id: 11,
    type: 'mention',
    tab: 'Mentions',
    user: { name: 'Prof. Alan Turing', avatar: 'https://i.pravatar.cc/150?img=11' },
    action: 'mentioned you in a post: "Shoutout to @Alex for the excellent capstone demo!"',
    time: '4 days ago',
    timeGroup: 'Earlier',
    read: true,
  },
  {
    id: 12,
    type: 'like',
    tab: 'Likes',
    user: { name: 'Sarah Jenkins', avatar: 'https://i.pravatar.cc/150?img=47' },
    action: 'liked your resource upload "Graph Algorithms Cheat Sheet"',
    time: '5 days ago',
    timeGroup: 'Earlier',
    read: true,
  },
];

export default function Notifications() {
  const [activeTab, setActiveTab] = useState('All');
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Likes') return n.type === 'like';
    if (activeTab === 'Comments') return n.type === 'comment';
    if (activeTab === 'Mentions') return n.type === 'mention';
    if (activeTab === 'Events') return n.type === 'event';
    if (activeTab === 'System') return n.type === 'system' || n.type === 'achievement';
    return true;
  });

  const groups = ['Today', 'Yesterday', 'Earlier'];
  const groupedNotifications = groups
    .map((group) => ({
      label: group,
      items: filteredNotifications.filter((n) => n.timeGroup === group),
    }))
    .filter((g) => g.items.length > 0);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />

      <main className="flex-1 max-w-3xl mx-auto py-8 px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-brand-500 to-indigo-600 rounded-xl shadow-lg shadow-brand-500/25">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold text-slate-900">Notifications</h1>
                <p className="text-slate-500 text-sm mt-0.5">
                  {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'You\'re all caught up! 🎉'}
                </p>
              </div>
            </div>

            {unreadCount > 0 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand-700 bg-brand-50 rounded-xl hover:bg-brand-100 transition-colors"
              >
                <CheckCheck className="w-4 h-4" />
                Mark all as read
              </motion.button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 overflow-x-auto pb-1 bg-white rounded-2xl border border-slate-200/60 p-1.5 shadow-sm">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const count = tab.label === 'All'
                ? notifications.filter((n) => !n.read).length
                : notifications.filter(
                    (n) =>
                      !n.read &&
                      (tab.label === 'Likes' ? n.type === 'like' :
                       tab.label === 'Comments' ? n.type === 'comment' :
                       tab.label === 'Mentions' ? n.type === 'mention' :
                       tab.label === 'Events' ? n.type === 'event' :
                       tab.label === 'System' ? (n.type === 'system' || n.type === 'achievement') :
                       false)
                  ).length;

              return (
                <button
                  key={tab.label}
                  onClick={() => setActiveTab(tab.label)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-1 justify-center ${
                    activeTab === tab.label
                      ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-md shadow-brand-500/20'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  {count > 0 && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${
                      activeTab === tab.label ? 'bg-white/25 text-white' : 'bg-brand-100 text-brand-700'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Notification Groups */}
          {groupedNotifications.length > 0 ? (
            <div className="space-y-6">
              {groupedNotifications.map((group) => (
                <div key={group.label}>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-1">
                    {group.label}
                  </h3>

                  <div className="space-y-2">
                    <AnimatePresence mode="popLayout">
                      {group.items.map((notification, index) => {
                        const iconConfig = NOTIFICATION_ICONS[notification.type];
                        const IconComponent = iconConfig.icon;

                        return (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20, height: 0 }}
                            transition={{ delay: index * 0.04, duration: 0.3 }}
                            layout
                            className={`group relative flex items-start gap-4 p-4 rounded-2xl transition-all duration-200 hover:shadow-md ${
                              notification.read
                                ? 'bg-white border border-slate-200/60'
                                : 'bg-white border-l-[3px] border-l-brand-500 border border-slate-200/60 shadow-sm'
                            }`}
                          >
                            {/* Icon */}
                            <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${iconConfig.bg} flex items-center justify-center`}>
                              <IconComponent className={`w-5 h-5 ${iconConfig.color}`} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start gap-3">
                                <img
                                  src={notification.user.avatar}
                                  alt={notification.user.name}
                                  className="w-8 h-8 rounded-full ring-2 ring-white shadow-sm flex-shrink-0 mt-0.5"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-slate-700 leading-relaxed">
                                    <span className="font-semibold text-slate-900">{notification.user.name}</span>{' '}
                                    {notification.action}
                                  </p>
                                  <p className="text-xs text-slate-400 mt-1">{notification.time}</p>
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                              {!notification.read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  title="Mark as read"
                                  className="p-1.5 rounded-lg hover:bg-brand-50 text-slate-400 hover:text-brand-600 transition-colors"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => deleteNotification(notification.id)}
                                title="Delete"
                                className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Unread dot */}
                            {!notification.read && (
                              <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-brand-500 rounded-full group-hover:hidden" />
                            )}
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mb-5">
                <BellOff className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-lg font-display font-bold text-slate-900 mb-1">No notifications</h3>
              <p className="text-sm text-slate-500 max-w-xs">
                {activeTab === 'All'
                  ? "You're all caught up! No new notifications right now."
                  : `No ${activeTab.toLowerCase()} notifications yet.`}
              </p>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
