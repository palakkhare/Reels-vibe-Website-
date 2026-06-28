import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Calendar, BookOpen, MessageSquare, ShoppingBag, Bell, User, LogOut, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { icon: Home, label: 'Feed', path: '/feed' },
  { icon: Users, label: 'Clubs & Groups', path: '/clubs' },
  { icon: Calendar, label: 'Events', path: '/events' },
  { icon: BookOpen, label: 'Resources', path: '/resources' },
  { icon: MessageSquare, label: 'Messages', path: '/messages', badge: '3' },
  { icon: ShoppingBag, label: 'Marketplace', path: '/marketplace' },
  { icon: Bell, label: 'Notifications', path: '/notifications', badge: '5' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 h-screen hidden lg:flex flex-col justify-between sticky top-0 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 z-40">
      <div className="p-6">
        <Link to="/feed" className="flex items-center gap-3 mb-8">
          <div className="bg-brand-600 p-1.5 rounded-lg">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-display font-bold text-slate-900 tracking-tight">CampusConnect</span>
        </Link>

        {/* Global Search */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search campus..." 
            className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none"
          />
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={`relative flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-brand-50 text-brand-700 font-medium' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-brand-50 rounded-xl"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <div className="relative flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-brand-600' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="relative bg-brand-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-6 border-t border-slate-200/60">
        <Link to="/profile" className="flex items-center gap-3 mb-6 p-2 rounded-xl hover:bg-slate-100 transition-colors">
          <img src="https://i.pravatar.cc/100?img=11" alt="User" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">Alex Student</p>
            <p className="text-xs text-slate-500 truncate">Computer Science '26</p>
          </div>
        </Link>
        <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
