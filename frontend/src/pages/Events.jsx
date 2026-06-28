import Sidebar from '../components/layout/Sidebar';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Ticket } from 'lucide-react';

const MOCK_EVENTS = [
  {
    id: 1,
    title: "Annual Tech Symposium 2026",
    club: "Computer Science Dept",
    date: "Oct 15, 2026",
    time: "10:00 AM - 5:00 PM",
    location: "Main Auditorium",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    registered: 450,
    isRegistered: true
  },
  {
    id: 2,
    title: "RoboWars: Clash of Bots",
    club: "Robotics & AI Lab",
    date: "Oct 22, 2026",
    time: "2:00 PM - 8:00 PM",
    location: "Engineering Block B",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    registered: 120,
    isRegistered: false
  },
  {
    id: 3,
    title: "Startup Pitch Deck Workshop",
    club: "Entrepreneurship Cell",
    date: "Nov 02, 2026",
    time: "4:00 PM - 6:00 PM",
    location: "Seminar Hall 1",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    registered: 85,
    isRegistered: false
  }
];

export default function Events() {
  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      
      <main className="flex-1 max-w-5xl mx-auto py-8 px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-slate-900">Upcoming Events</h1>
              <p className="text-slate-500 mt-1">Don't miss out on what's happening around campus.</p>
            </div>
            
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-brand-50 text-brand-700 font-medium rounded-xl hover:bg-brand-100 transition-colors">
                My Tickets
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {MOCK_EVENTS.map(event => (
              <div key={event.id} className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden flex flex-col md:flex-row group">
                <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-900/40 to-transparent z-10 md:hidden"></div>
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-sm font-medium text-brand-600">{event.club}</p>
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                        {event.registered} attending
                      </span>
                    </div>
                    <h2 className="text-2xl font-display font-bold text-slate-900 mb-4">{event.title}</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 sm:col-span-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <button className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all ${
                      event.isRegistered
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        : 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm'
                    }`}>
                      <Ticket className="w-5 h-5" />
                      <span>{event.isRegistered ? 'Ticket Generated' : 'Register Now'}</span>
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
