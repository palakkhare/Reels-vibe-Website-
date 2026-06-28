import { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Briefcase, GraduationCap, Link as LinkIcon, Mail, Edit3, X, Loader } from 'lucide-react';
import { profilesApi } from '../services/api';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    headline: '',
    bio: '',
    skills: '',
    githubUrl: '',
    linkedinUrl: '',
    portfolioUrl: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await profilesApi.getMe();
      setProfile(response.data);
      setFormData({
        headline: response.data.headline || '',
        bio: response.data.bio || '',
        skills: response.data.skills || '',
        githubUrl: response.data.githubUrl || '',
        linkedinUrl: response.data.linkedinUrl || '',
        portfolioUrl: response.data.portfolioUrl || ''
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await profilesApi.updateMyProfile(formData);
      setProfile(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const skillsArray = profile?.skills ? profile.skills.split(',').map(s => s.trim()).filter(s => s) : [];

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      
      <main className="flex-1 max-w-4xl mx-auto py-8 px-4 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="w-8 h-8 text-brand-600 animate-spin" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Header Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden relative">
              <div className="h-48 bg-gradient-to-r from-brand-600 to-indigo-800 relative">
                <img 
                  src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80" 
                  alt="Cover" 
                  className="w-full h-full object-cover mix-blend-overlay opacity-50"
                />
              </div>
              
              <div className="px-8 pb-8">
                <div className="relative flex justify-between items-end -mt-16 mb-4">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${profile?.fullName}&background=0ea5e9&color=fff&size=200`} 
                    alt="Profile" 
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover bg-white"
                  />
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-5 py-2 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" /> Edit Profile
                    </button>
                  </div>
                </div>
                
                <div>
                  <h1 className="text-3xl font-display font-bold text-slate-900">{profile?.fullName}</h1>
                  <p className="text-lg text-slate-600 font-medium mt-1">
                    {profile?.headline || 'Update your headline...'}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> Silicon Valley Campus</span>
                    <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {profile?.email}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column (About & Details) */}
              <div className="md:col-span-1 space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
                  <h3 className="font-bold text-slate-900 mb-3">About</h3>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {profile?.bio || 'No bio provided yet.'}
                  </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
                  <h3 className="font-bold text-slate-900 mb-4">Links</h3>
                  <div className="space-y-3 text-sm">
                    {profile?.githubUrl && (
                      <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-600 hover:text-brand-600 transition-colors truncate">
                        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                        </svg> <span className="truncate">{profile.githubUrl}</span>
                      </a>
                    )}
                    {profile?.linkedinUrl && (
                      <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-600 hover:text-brand-600 transition-colors truncate">
                        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg> <span className="truncate">{profile.linkedinUrl}</span>
                      </a>
                    )}
                    {profile?.portfolioUrl && (
                      <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-600 hover:text-brand-600 transition-colors truncate">
                        <LinkIcon className="w-5 h-5 flex-shrink-0" /> <span className="truncate">{profile.portfolioUrl}</span>
                      </a>
                    )}
                    {(!profile?.githubUrl && !profile?.linkedinUrl && !profile?.portfolioUrl) && (
                      <p className="text-slate-400 italic">No links added.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column (Skills) */}
              <div className="md:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
                  <h3 className="font-bold text-slate-900 mb-4">Top Skills</h3>
                  {skillsArray.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {skillsArray.map((skill, i) => (
                        <span key={i} className="px-3 py-1.5 bg-brand-50 text-brand-700 font-medium rounded-lg text-sm border border-brand-100">
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 italic text-sm">No skills added yet.</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white/90 backdrop-blur-md z-10">
                <h2 className="text-xl font-bold text-slate-900">Edit Profile</h2>
                <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleUpdate} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Headline</label>
                  <input
                    type="text"
                    value={formData.headline}
                    onChange={(e) => setFormData({...formData, headline: e.target.value})}
                    placeholder="e.g. Full Stack Developer | CS '25"
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
                  <textarea
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    placeholder="Tell us about yourself..."
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition-all resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Skills (comma separated)</label>
                  <input
                    type="text"
                    value={formData.skills}
                    onChange={(e) => setFormData({...formData, skills: e.target.value})}
                    placeholder="React, Java, Spring Boot, MySQL"
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">GitHub URL</label>
                    <input
                      type="url"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
                      placeholder="https://github.com/username"
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">LinkedIn URL</label>
                    <input
                      type="url"
                      value={formData.linkedinUrl}
                      onChange={(e) => setFormData({...formData, linkedinUrl: e.target.value})}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-5 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 transition-colors shadow-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
