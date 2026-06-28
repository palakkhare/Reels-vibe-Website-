import Sidebar from '../components/layout/Sidebar';
import CreatePost from '../components/feed/CreatePost';
import PostCard from '../components/feed/PostCard';
import { motion } from 'framer-motion';

// Mock Data for the Feed
const MOCK_POSTS = [
  {
    id: 1,
    author: {
      name: "Sarah Jenkins",
      headline: "Computer Science '25 | ML Enthusiast",
      avatar: "https://i.pravatar.cc/150?img=47"
    },
    timeAgo: "2 hours ago",
    content: "Just finished building my first full-stack application using React and Spring Boot! The integration was smoother than I expected. Does anyone have recommendations for deployment platforms? Thinking about Vercel + Railway. 🚀💻\n\n#webdev #springboot #reactjs",
    image: null,
    likes: 124,
    comments: 18,
    shares: 5,
    isLikedByMe: true
  },
  {
    id: 2,
    author: {
      name: "Robotics Club",
      headline: "Official University Club",
      avatar: "https://i.pravatar.cc/150?img=33"
    },
    timeAgo: "5 hours ago",
    content: "Our annual RoboWars event is happening next month! Registrations are now open. Build your bot, form a team, and compete for the $1000 prize pool. Check out last year's highlights below! 🤖⚡️",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    likes: 342,
    comments: 45,
    shares: 89,
    isLikedByMe: false
  },
  {
    id: 3,
    author: {
      name: "Prof. Alan Turing",
      headline: "Head of AI Department",
      avatar: "https://i.pravatar.cc/150?img=11"
    },
    timeAgo: "1 day ago",
    content: "Important Announcement: The deadline for submitting the final year project proposals has been extended to Friday. Please ensure all documents are uploaded to the department portal.",
    image: null,
    likes: 89,
    comments: 12,
    shares: 2,
    isLikedByMe: false
  }
];

export default function Feed() {
  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      
      <main className="flex-1 max-w-3xl mx-auto py-8 px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <CreatePost />
          
          <div className="space-y-6">
            {MOCK_POSTS.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          
          {/* Loading Indicator for Infinite Scroll */}
          <div className="py-8 flex justify-center">
            <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
          </div>
        </motion.div>
      </main>

      {/* Right Sidebar (Trending/Suggestions) - Optional for large screens */}
      <div className="hidden xl:block w-80 p-8 border-l border-slate-200/60 h-screen sticky top-0">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 mb-6">
          <h3 className="font-semibold text-slate-900 mb-4">Trending Tags</h3>
          <div className="flex flex-wrap gap-2">
            {['#hackathon2026', '#midterms', '#placement', '#webdev', '#campuslife'].map(tag => (
              <span key={tag} className="px-3 py-1 bg-brand-50 text-brand-700 rounded-lg text-sm font-medium hover:bg-brand-100 cursor-pointer transition-colors">
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5">
          <h3 className="font-semibold text-slate-900 mb-4">Upcoming Events</h3>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex flex-col items-center justify-center font-bold">
                <span className="text-xs uppercase">Oct</span>
                <span className="text-lg leading-none">12</span>
              </div>
              <div>
                <h4 className="font-medium text-slate-900 text-sm">Tech Symposium</h4>
                <p className="text-xs text-slate-500">Main Auditorium</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
