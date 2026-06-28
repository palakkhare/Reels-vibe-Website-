import Sidebar from '../components/layout/Sidebar';
import { motion } from 'framer-motion';
import { Users, Calendar as CalendarIcon, ArrowRight, Plus } from 'lucide-react';

const MOCK_CLUBS = [
  {
    id: 1,
    name: "Google Developer Student Club",
    category: "Technical",
    members: 450,
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Learn, build, and connect with fellow developers.",
    isJoined: true
  },
  {
    id: 2,
    name: "Photography Society",
    category: "Arts & Culture",
    members: 120,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Capturing campus memories, one frame at a time.",
    isJoined: false
  },
  {
    id: 3,
    name: "Robotics & AI Lab",
    category: "Technical",
    members: 85,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Building the autonomous future together.",
    isJoined: false
  },
  {
    id: 4,
    name: "Entrepreneurship Cell",
    category: "Business",
    members: 300,
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Fostering startup culture on campus.",
    isJoined: true
  }
];

export default function Clubs() {
  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      
      <main className="flex-1 max-w-6xl mx-auto py-8 px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-slate-900">Clubs & Societies</h1>
              <p className="text-slate-500 mt-1">Discover communities, join clubs, and attend exclusive events.</p>
            </div>
            <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 transition-colors shadow-sm">
              <Plus className="w-5 h-5" />
              <span>Create Club</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {MOCK_CLUBS.map((club) => (
              <div key={club.id} className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden flex flex-col hover:shadow-md transition-shadow group">
                <div className="h-40 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10"></div>
                  <img 
                    src={club.image} 
                    alt={club.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-medium rounded-lg border border-white/30">
                      {club.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-display font-bold text-xl text-slate-900 mb-2">{club.name}</h3>
                  <p className="text-sm text-slate-500 mb-4 flex-1">{club.description}</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                      <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {club.members}</span>
                      <span className="flex items-center gap-1.5"><CalendarIcon className="w-4 h-4" /> 2 Events</span>
                    </div>
                    
                    <button className={`p-2 rounded-xl transition-colors ${
                      club.isJoined 
                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
                        : 'bg-brand-50 text-brand-600 hover:bg-brand-100'
                    }`}>
                      {club.isJoined ? 'Joined' : 'Join'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
