import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAppDispatch } from '../store/hooks';
import { setCredentials } from '../store/features/authSlice';
import { User, Mail, Lock, Eye, EyeOff, Zap, ShieldCheck } from 'lucide-react';
import { API_BASE_URL } from '../config/api';
import { motion } from 'framer-motion';

export const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Validation: Min 6 characters, uppercase, lowercase, special char
  const validatePassword = (pass: string) => {
    const minLength = pass.length >= 6;
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    return minLength && hasUpper && hasLower && hasSpecial;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be 6+ chars with uppercase, lowercase, and special char.');
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        username,
        email,
        password,
      });
      dispatch(setCredentials(data));
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Provisioning failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200">
        <div className="text-center mb-8">
          <Zap size={40} className="text-violet-600 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">New Account</h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Create your identity node</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {error && <div className="bg-rose-50 text-rose-500 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-rose-100">{error}</div>}

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-4 text-slate-400" size={16} />
              <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="alias" className="w-full bg-slate-50 border border-slate-100 pl-12 pr-4 py-3.5 rounded-2xl outline-none focus:border-violet-600 focus:bg-white transition-all text-sm font-semibold" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-4 text-slate-400" size={16} />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@domain.com" className="w-full bg-slate-50 border border-slate-100 pl-12 pr-4 py-3.5 rounded-2xl outline-none focus:border-violet-600 focus:bg-white transition-all text-sm font-semibold" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-4 text-slate-400" size={16} />
              <input type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-50 border border-slate-100 pl-12 pr-4 py-3.5 rounded-2xl outline-none focus:border-violet-600 focus:bg-white transition-all text-sm font-semibold" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-4 text-slate-400">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-4 text-slate-400" size={16} />
              <input type={showConfirm ? 'text' : 'password'} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-50 border border-slate-100 pl-12 pr-4 py-3.5 rounded-2xl outline-none focus:border-violet-600 focus:bg-white transition-all text-sm font-semibold" />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-4 text-slate-400">{showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}</button>
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-violet-600 hover:bg-violet-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-50 mt-4 flex items-center justify-center gap-2">
            <ShieldCheck size={20} />
            {isLoading ? 'Creating...' : 'Register'}
          </button>
        </form>

        <p className="mt-8 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Have an account? <Link to="/login" className="text-violet-600 hover:underline">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
};
