import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, ArrowLeft, LogOut, User, Check, Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout, updateUser } from '../store/features/authSlice';
import axios from 'axios';

export const ProfileSettings = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const BASE_URL = 'http://127.0.0.1:5005';
  
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [status, setStatus] = useState<any>(user?.status || 'online');
  const [profilePic, setProfilePic] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('pulse_token');
      const res = await axios.put(`${BASE_URL}/api/users/profile`, {
        username, 
        status, 
        bio
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.status === 200) {
        dispatch(updateUser(res.data.user));
        alert('Pulse: Profile updated successfully.');
        navigate('/');
      }
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.error || err.response?.data?.message || 'Error updating profile';
      alert(`Pulse: ${msg}`);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('profilePicture', file);
      const token = localStorage.getItem('pulse_token');
      try {
        const res = await axios.post(`${BASE_URL}/api/users/profile/picture`, formData, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.status === 200) {
          dispatch(updateUser({ profilePicture: res.data.profilePicture }));
          setProfilePic(`${BASE_URL}${res.data.profilePicture}`);
        }
      } catch (err: any) { 
        console.error(err); 
        const msg = err.response?.data?.error || err.response?.data?.message || 'Error uploading picture';
        alert(`Pulse: ${msg}`);
      }
    }
  };

  const handleDeletePicture = async () => {
    const token = localStorage.getItem('pulse_token');
    try {
      const res = await axios.delete(`${BASE_URL}/api/users/profile/picture`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 200) {
        dispatch(updateUser({ profilePicture: undefined }));
        setProfilePic(null);
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-violet-100 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 overflow-hidden border border-slate-100"
      >
        {/* Header */}
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
           <button onClick={() => navigate('/')} className="p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-slate-950 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
             <ArrowLeft size={16} /> Back
           </button>
           <h1 className="text-sm font-black uppercase tracking-widest text-slate-800 italic">Pulse Profile</h1>
           <div className="w-16" />
        </div>

        <div className="p-10 space-y-10">
           {/* 1. Profile Picture */}
           <section className="flex flex-col items-center gap-6">
              <div className="relative group p-1 rounded-[2.8rem] border-2 border-transparent transition-all duration-500" style={{ 
                borderColor: status === 'online' ? '#10b981' : status === 'busy' ? '#f43f5e' : status === 'away' ? '#f59e0b' : '#cbd5e1' 
              }}>
                 <div className="w-32 h-32 rounded-[2.5rem] bg-slate-50 border-4 border-white shadow-xl relative overflow-hidden">
                    <img 
                      src={profilePic || (user?.profilePicture ? `${BASE_URL}${user.profilePicture}` : `https://i.pravatar.cc/300?u=${user?._id}`)} 
                      className="w-full h-full object-cover" 
                      alt="avatar" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://i.pravatar.cc/300?u=${user?._id}`;
                      }}
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                    >
                       <Camera size={24} />
                    </button>
                 </div>
                 <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              </div>
              <div className="flex gap-3">
                 <button onClick={() => fileInputRef.current?.click()} className="text-[10px] font-black uppercase tracking-widest text-violet-600 hover:bg-violet-50 px-4 py-2 rounded-xl transition-all">
                    Change Photo
                 </button>
                 {user?.profilePicture && (
                    <button onClick={handleDeletePicture} className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 px-4 py-2 rounded-xl transition-all flex items-center gap-1">
                       <Trash2 size={14} /> Remove
                    </button>
                 )}
              </div>
           </section>

           {/* 2 & 3. Username & Bio */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
                 <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-600 transition-colors" size={18} />
                    <input 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-violet-100 focus:bg-white rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-slate-900 transition-all outline-none pl-12"
                      placeholder="Display Name"
                    />
                 </div>
              </div>

              <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center justify-between">
                    Activity Status
                    <div className={`w-2.5 h-2.5 rounded-full shadow-sm transition-all duration-500 ${
                       status === 'online' ? 'bg-emerald-500 shadow-emerald-100' : 
                       status === 'busy' ? 'bg-rose-500 shadow-rose-100' :
                       status === 'away' ? 'bg-amber-500 shadow-amber-100' : 'bg-slate-300'
                    }`} />
                 </label>
                 <div className="relative">
                    <select 
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-violet-100 focus:bg-white rounded-2xl py-3.5 px-4 text-sm font-bold text-slate-900 transition-all outline-none appearance-none cursor-pointer"
                    >
                       <option value="online">Online (Active)</option>
                       <option value="away">Away (Idle)</option>
                       <option value="busy">Busy (DND)</option>
                       <option value="offline">Offline (Ghost)</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                       ▼
                    </div>
                 </div>
              </div>
           </div>

           <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status / Bio</label>
              <textarea 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                className="w-full bg-slate-50 border-2 border-transparent focus:border-violet-100 focus:bg-white rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 transition-all outline-none resize-none"
                placeholder="What's on your mind?"
              />
           </div>

           {/* 5. Save & Logout */}
           <div className="flex flex-col gap-4 pt-4">
              <button 
                onClick={handleSave}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                 <Check size={16} /> Save Profile Changes
              </button>
              
              <button 
                onClick={() => dispatch(logout())}
                className="w-full py-4 bg-rose-50 text-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all flex items-center justify-center gap-2 group"
              >
                 <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> Logout from Session
              </button>
           </div>
        </div>
      </motion.div>
    </div>
  );
};
