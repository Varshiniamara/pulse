import React, { useState } from 'react';
import { Shield, AlertTriangle, UserX, MessageSquare, Trash2, CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import usersData from '../data/json/users_50_sample.json';

const mockFlags = [
  { id: 1, type: 'Spam', user: 'User5', message: 'Hello from User5 to User22...', time: '10m ago' },
  { id: 2, type: 'Harassment', user: 'User32', message: 'Wait, this isn\'t right!', time: '1h ago' },
  { id: 3, type: 'Inappropriate', user: 'User12', message: 'Shared a suspicious link.', time: '2h ago' },
];

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'flags' | 'users' | 'activity'>('flags');

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-rose-500/30">
      {/* Navbar */}
      <nav className="h-16 border-b border-white/5 bg-zinc-900/50 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-50">
        <div className="flex items-center gap-4">
           <button onClick={() => navigate('/')} className="p-2 hover:bg-white/10 rounded-xl transition">
             <ArrowLeft size={20} />
           </button>
           <div className="flex items-center gap-2">
             <Shield className="text-rose-500" size={24} />
             <h1 className="text-lg font-black uppercase tracking-widest">Pulse Admin Control</h1>
           </div>
        </div>
        <div className="flex items-center gap-3">
           <div className="text-right">
             <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest leading-none">Security Officer</p>
             <p className="text-xs font-bold mt-1">Admin Account</p>
           </div>
           <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500" />
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
           {[
             { label: 'Active Sessions', val: '2,842', color: 'text-violet-400' },
             { label: 'Pending Flags', val: '12', color: 'text-rose-400' },
             { label: 'Blocked Nodes', val: '156', color: 'text-zinc-500' },
             { label: 'Messages/Min', val: '48.5k', color: 'text-emerald-400' },
           ].map((s, i) => (
             <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">{s.label}</p>
                <h3 className={`text-2xl font-black ${s.color}`}>{s.val}</h3>
             </div>
           ))}
        </div>

        {/* Main Interface */}
        <div className="flex gap-1 p-1 bg-white/5 rounded-2xl w-fit mb-8">
           <button onClick={() => setTab('flags')} className={`px-6 py-2 rounded-xl text-xs font-bold transition ${tab === 'flags' ? 'bg-rose-500 text-white shadow-lg shadow-rose-900/40' : 'text-zinc-500 hover:text-zinc-300'}`}>FLAGGED CONTENT {mockFlags.length}</button>
           <button onClick={() => setTab('users')} className={`px-6 py-2 rounded-xl text-xs font-bold transition ${tab === 'users' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>USER MANAGEMENT</button>
           <button onClick={() => setTab('activity')} className={`px-6 py-2 rounded-xl text-xs font-bold transition ${tab === 'activity' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>SYSTEM LOGS</button>
        </div>

        {tab === 'flags' && (
          <div className="space-y-4">
             {mockFlags.map(f => (
               <div key={f.id} className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center justify-between group hover:bg-white/10 transition-all border-l-4 border-l-rose-500">
                  <div className="flex items-center gap-6">
                     <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                        <AlertTriangle size={24} />
                     </div>
                     <div>
                        <div className="flex items-center gap-3 mb-1">
                           <span className="text-[10px] font-black bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full uppercase tracking-widest">{f.type}</span>
                           <h4 className="text-sm font-bold text-zinc-300">{f.user} • {f.time}</h4>
                        </div>
                        <p className="text-sm text-zinc-500 italic">"{f.message}"</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button className="p-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl transition" title="Dismiss">
                        <CheckCircle size={18} />
                     </button>
                     <button className="p-3 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl transition" title="Block User">
                        <UserX size={18} />
                     </button>
                     <button className="p-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl transition" title="Delete Message">
                        <Trash2 size={18} />
                     </button>
                  </div>
               </div>
             ))}
          </div>
        )}

        {tab === 'users' && (
          <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
             <table className="w-full text-left">
                <thead className="bg-white/5 text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-white/10">
                   <tr>
                      <th className="px-6 py-4">Node Profile</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Risk Level</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                   {usersData.slice(0, 8).map(u => (
                     <tr key={u.user_id} className="hover:bg-white/5 transition">
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-zinc-800" />
                              <div>
                                 <p className="text-xs font-bold text-white leading-none mb-1">{u.name}</p>
                                 <p className="text-[10px] text-zinc-500 tracking-wider">MODERATOR_ACTIVE</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-xs font-bold text-emerald-400">{u.status.toUpperCase()}</td>
                        <td className="px-6 py-4">
                           <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                              <div className="w-1/4 h-full bg-emerald-500" />
                           </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button className="text-[10px] font-black text-rose-500 hover:underline tracking-widest">RESTRICT</button>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
        )}
      </div>
    </div>
  );
};
