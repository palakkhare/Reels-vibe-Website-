import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { authApi } from '../services/api';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        const res = await authApi.login(email, password);
        localStorage.setItem('campusconnect_token', res.data.token);
        localStorage.setItem('campusconnect_user', JSON.stringify(res.data));
      } else {
        await authApi.register(fullName, email, password);
        const res = await authApi.login(email, password);
        localStorage.setItem('campusconnect_token', res.data.token);
        localStorage.setItem('campusconnect_user', JSON.stringify(res.data));
      }
      navigate('/feed');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/40 z-10 mx-4">
        
        {/* Left Side: Branding / Info */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-brand-600 to-indigo-900 text-white relative">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] opacity-20 mix-blend-overlay bg-cover bg-center"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-display font-bold tracking-tight">CampusConnect</h1>
            </div>
            <h2 className="text-4xl font-display font-bold leading-tight mb-6">
              Your Campus,<br/>Now Connected.
            </h2>
            <p className="text-indigo-100 text-lg max-w-md">
              Join the ultimate academic social network. Collaborate, share resources, and accelerate your college journey.
            </p>
          </div>
          
          <div className="relative z-10">
            <div className="flex -space-x-4">
              {[1,2,3,4].map((i) => (
                <img key={i} className="w-12 h-12 rounded-full border-2 border-indigo-900" src={`https://i.pravatar.cc/100?img=${i}`} alt="User" />
              ))}
              <div className="w-12 h-12 rounded-full border-2 border-indigo-900 bg-white/20 flex items-center justify-center backdrop-blur-sm text-sm font-medium">
                +2k
              </div>
            </div>
            <p className="mt-4 text-sm text-indigo-200">Join 2000+ students from your campus</p>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white/50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-3xl font-display font-bold text-slate-900 mb-2">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h3>
            <p className="text-slate-500 mb-8">
              {isLogin ? 'Enter your details to access your account.' : 'Start your journey with CampusConnect today.'}
            </p>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                  {error}
                </div>
              )}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-white/50 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none" placeholder="John Doe" />
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-white/50 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none" placeholder="you@university.edu" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-white/50 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none" placeholder="••••••••" />
                </div>
              </div>

              {isLogin && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input id="remember-me" type="checkbox" className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-slate-300 rounded" />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">Remember me</label>
                  </div>
                  <a href="#" className="text-sm font-medium text-brand-600 hover:text-brand-500">Forgot password?</a>
                </div>
              )}

              <button type="submit" disabled={loading} className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                {loading ? <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div> : <>{isLogin ? 'Sign In' : 'Sign Up'}<ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[#f4f7f9] text-slate-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-slate-200 rounded-xl shadow-sm bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors">
                  <span className="sr-only">Sign in with Google</span>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                  </svg>
                </button>
                <button className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-slate-200 rounded-xl shadow-sm bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors">
                  <span className="sr-only">Sign in with GitHub</span>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                </button>
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-slate-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => setIsLogin(!isLogin)} 
                className="font-medium text-brand-600 hover:text-brand-500 focus:outline-none"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
