import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { FiUser, FiLock, FiEye, FiBell, FiMoon, FiSun, FiSave, FiLogOut } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Settings() {
  const { dark, toggleTheme } = useTheme();
  const { user, updateUser, logout } = useAuth();
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    bio: user?.bio || '',
    website: user?.website || '',
    isPrivate: user?.isPrivate || false,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await API.put('/auth/profile', form);
      updateUser(data);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = `w-full px-4 py-3 rounded-xl text-sm outline-none transition-all
    ${dark ? 'bg-dark-700 text-white placeholder-dark-400 focus:ring-2 focus:ring-primary-500/40' : 'bg-gray-100 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary-500/40'}`;

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8 px-4">
      <div className="max-w-lg mx-auto">
        <h1 className={`text-2xl font-display font-bold mb-6 ${dark ? 'text-white' : 'text-gray-900'}`}>Settings</h1>

        {/* Account Section */}
        <div className={`rounded-2xl p-5 mb-4 glass`}>
          <h2 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${dark ? 'text-dark-200' : 'text-gray-600'}`}>
            <FiUser size={16} /> Account
          </h2>
          <div className="space-y-4">
            <div>
              <label className={`text-xs font-medium mb-1 block ${dark ? 'text-dark-300' : 'text-gray-500'}`}>Full Name</label>
              <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="Your name" className={inputClass} />
            </div>
            <div>
              <label className={`text-xs font-medium mb-1 block ${dark ? 'text-dark-300' : 'text-gray-500'}`}>Bio</label>
              <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
                maxLength={150} rows={3} placeholder="Tell people about yourself"
                className={`${inputClass} resize-none`} />
              <span className={`text-xs ${dark ? 'text-dark-400' : 'text-gray-400'}`}>{form.bio.length}/150</span>
            </div>
            <div>
              <label className={`text-xs font-medium mb-1 block ${dark ? 'text-dark-300' : 'text-gray-500'}`}>Website</label>
              <input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })}
                placeholder="https://yoursite.com" className={inputClass} />
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div className={`rounded-2xl p-5 mb-4 glass`}>
          <h2 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${dark ? 'text-dark-200' : 'text-gray-600'}`}>
            <FiLock size={16} /> Privacy
          </h2>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className={`text-sm font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>Private Account</p>
              <p className={`text-xs ${dark ? 'text-dark-400' : 'text-gray-400'}`}>Only followers can see your reels</p>
            </div>
            <div className="relative">
              <input type="checkbox" checked={form.isPrivate}
                onChange={(e) => setForm({ ...form, isPrivate: e.target.checked })}
                className="sr-only" />
              <div className={`w-11 h-6 rounded-full transition-colors ${form.isPrivate ? 'bg-primary-500' : dark ? 'bg-dark-600' : 'bg-gray-300'}`}>
                <motion.div
                  animate={{ x: form.isPrivate ? 20 : 2 }}
                  className="w-5 h-5 rounded-full bg-white shadow-sm mt-0.5"
                />
              </div>
            </div>
          </label>
        </div>

        {/* Appearance */}
        <div className={`rounded-2xl p-5 mb-4 glass`}>
          <h2 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${dark ? 'text-dark-200' : 'text-gray-600'}`}>
            <FiEye size={16} /> Appearance
          </h2>
          <button onClick={toggleTheme}
            className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${dark ? 'hover:bg-dark-700' : 'hover:bg-gray-50'}`}>
            <div className="flex items-center gap-3">
              {dark ? <FiMoon className="text-primary-400" /> : <FiSun className="text-yellow-500" />}
              <span className={`text-sm font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>
                {dark ? 'Dark Mode' : 'Light Mode'}
              </span>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${dark ? 'bg-dark-600 text-dark-200' : 'bg-gray-200 text-gray-600'}`}>
              {dark ? 'On' : 'Off'}
            </div>
          </button>
        </div>

        {/* Save */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-bold text-sm mb-3 glow-primary disabled:opacity-50"
        >
          {saving ? 'Saving...' : <><FiSave className="inline mr-1" /> Save Changes</>}
        </motion.button>

        {/* Logout */}
        <button onClick={logout}
          className={`w-full py-3.5 rounded-xl text-sm font-semibold ${dark ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-red-50 text-red-500 hover:bg-red-100'}`}>
          <FiLogOut className="inline mr-1" /> Logout
        </button>
      </div>
    </div>
  );
}
