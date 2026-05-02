import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAppDispatch } from '../store/hooks';
import { setCredentials } from '../store/features/authSlice';
import { Mail, Lock, Eye, EyeOff, Zap, ArrowRight } from 'lucide-react';
import { API_BASE_URL } from '../config/api';
import { motion } from 'framer-motion';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
      dispatch(setCredentials(data));
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Access Denied.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 font-sans">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-violet-100">
             <Zap size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Sign In</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Access your Pulse node</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && <div className="bg-rose-50 text-rose-500 p-4 rounded-2xl text-xs font-bold border border-rose-100">{error}</div>}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-4 text-slate-400" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@pulse.com"
                className="w-full bg-slate-50 border border-slate-100 pl-12 pr-4 py-3.5 rounded-2xl outline-none focus:border-violet-600 focus:bg-white transition-all text-sm font-semibold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-4 text-slate-400" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-100 pl-12 pr-4 py-3.5 rounded-2xl outline-none focus:border-violet-600 focus:bg-white transition-all text-sm font-semibold"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-slate-400 hover:text-violet-600 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-violet-100 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? 'Verifying...' : 'Initialize'}
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="mt-8 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
          New here? <Link to="/register" className="text-violet-600 hover:underline">Register Node</Link>
        </p>
      </motion.div>
    </div>
  );
};
