import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiUser, FiAtSign, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Auth() {
  const { dark } = useTheme();
  const { login, register, loading } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', password: '', fullName: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    let result;
    if (isLogin) {
      result = await login(form.email, form.password);
    } else {
      if (!form.username || !form.email || !form.password) {
        return toast.error('All fields are required');
      }
      result = await register(form.username, form.email, form.password, form.fullName);
    }
    if (result.success) {
      toast.success(isLogin ? 'Welcome back!' : 'Account created!');
      navigate('/');
    } else {
      toast.error(result.message);
    }
  };

  const inputClass = `w-full pl-11 pr-4 py-3.5 rounded-xl text-sm transition-all outline-none
    ${dark
      ? 'bg-dark-700 text-white placeholder-dark-300 focus:bg-dark-600 focus:ring-2 focus:ring-primary-500/40'
      : 'bg-gray-100 text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-primary-500/40 border border-gray-200 focus:border-primary-400'
    }`;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, var(--color-primary-500), transparent 70%)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, var(--color-accent-500), transparent 70%)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 via-accent-500 to-neon-orange flex items-center justify-center"
          >
            <span className="text-white text-2xl font-bold">R</span>
          </motion.div>
          <h1 className={`text-2xl font-display font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
            {isLogin ? 'Welcome Back' : 'Join ReelVibe'}
          </h1>
          <p className={`text-sm mt-1 ${dark ? 'text-dark-300' : 'text-gray-500'}`}>
            {isLogin ? 'Log in to continue' : 'Create your account'}
          </p>
        </div>

        {/* Toggle */}
        <div className={`flex rounded-xl p-1 mb-6 ${dark ? 'bg-dark-700' : 'bg-gray-100'}`}>
          {['Login', 'Register'].map((tab) => (
            <button
              key={tab}
              onClick={() => setIsLogin(tab === 'Login')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all relative
                ${(tab === 'Login' ? isLogin : !isLogin)
                  ? 'text-white'
                  : dark ? 'text-dark-300' : 'text-gray-500'
                }`}
            >
              {(tab === 'Login' ? isLogin : !isLogin) && (
                <motion.div
                  layoutId="authTab"
                  className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab}</span>
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 overflow-hidden"
              >
                <div className="relative">
                  <FiUser className={`absolute left-4 top-4 ${dark ? 'text-dark-300' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className={inputClass}
                    id="auth-fullname"
                  />
                </div>
                <div className="relative">
                  <FiAtSign className={`absolute left-4 top-4 ${dark ? 'text-dark-300' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    placeholder="Username"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                    className={inputClass}
                    id="auth-username"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <FiMail className={`absolute left-4 top-4 ${dark ? 'text-dark-300' : 'text-gray-400'}`} />
            <input
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputClass}
              id="auth-email"
              required
            />
          </div>

          <div className="relative">
            <FiLock className={`absolute left-4 top-4 ${dark ? 'text-dark-300' : 'text-gray-400'}`} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={`${inputClass} pr-11`}
              id="auth-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-4 top-4 ${dark ? 'text-dark-300 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-bold text-sm disabled:opacity-50 glow-primary"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full inline-block" />
                Processing...
              </span>
            ) : isLogin ? 'Log In' : 'Create Account'}
          </motion.button>
        </form>

        {/* Demo Account */}
        <div className={`mt-6 text-center text-sm ${dark ? 'text-dark-300' : 'text-gray-500'}`}>
          <p>Demo: <span className={`font-medium ${dark ? 'text-dark-100' : 'text-gray-700'}`}>demo@reelvibe.com</span> / <span className={`font-medium ${dark ? 'text-dark-100' : 'text-gray-700'}`}>password123</span></p>
        </div>
      </motion.div>
    </div>
  );
}
