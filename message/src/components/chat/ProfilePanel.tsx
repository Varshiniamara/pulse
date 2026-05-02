import { X, Bell, Shield, Volume2, MoreHorizontal, Unlock, BellOff } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProfilePanelProps {
  target: any;
  type: 'user' | 'group';
  onClose: () => void;
  isBlocked?: boolean;
  onBlock?: () => void;
  isMuted?: boolean;
  onToggleMute?: () => void;
  currentUser: any;
}

export const ProfilePanel = ({ target, type, onClose, isBlocked, onBlock, isMuted, onToggleMute, currentUser }: ProfilePanelProps) => {
  const images = [1,2,3,4,5,6]; 

  return (
    <motion.aside 
      initial={{ x: 320 }}
      animate={{ x: 0 }}
      exit={{ x: 320 }}
      className="w-80 h-full bg-white border-l border-slate-100 flex flex-col flex-shrink-0 z-20"
    >
      <div className="h-16 px-6 flex items-center justify-between border-b border-slate-50">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
          {type === 'user' ? 'Contact Info' : 'Group Info'}
        </h3>
        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-none">
        <div className="p-8 flex flex-col items-center text-center border-b border-slate-50 bg-gradient-to-b from-slate-50/50 to-transparent">
          <div className="w-32 h-32 rounded-[2.5rem] bg-slate-200 overflow-hidden shadow-2xl mb-4 border-4 border-white relative">
             <img 
               src={target.profilePicture ? `http://localhost:5005${target.profilePicture}` : (type === 'user' ? `https://i.pravatar.cc/300?u=${target.user_id}` : `https://i.pravatar.cc/300?u=group-${target.group_id}`)}
               alt="avatar"
               className={`w-full h-full object-cover transition-all ${isBlocked ? 'grayscale' : ''}`}
             />
             {isBlocked && (
               <div className="absolute inset-0 bg-rose-500/20 flex items-center justify-center">
                  <Shield size={40} className="text-white drop-shadow-lg" />
               </div>
             )}
          </div>
          <h2 className={`text-xl font-black tracking-tight mb-1 ${isBlocked ? 'text-zinc-400' : 'text-slate-900'}`}>
            {type === 'user' ? target.name : target.group_name}
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
             {target.status || 'Active'}
          </p>
          <div className="flex gap-2 w-full">
             <button className="flex-1 py-2.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black tracking-widest uppercase shadow-lg shadow-slate-200">
                Message
             </button>
             <button className="py-2.5 px-3 bg-slate-100 text-slate-600 rounded-2xl hover:bg-violet-50 transition-all">
                <MoreHorizontal size={16} />
             </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
           <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Shared Media</h4>
              <button className="text-[10px] font-black text-violet-600 hover:underline">SEE ALL</button>
           </div>
           <div className="grid grid-cols-3 gap-2">
              {/* Show different media per user using seed */}
              {images.map(i => (
                <div key={i} className="aspect-square bg-slate-100 rounded-xl overflow-hidden hover:opacity-80 cursor-pointer transition border border-slate-50">
                   <img src={`https://picsum.photos/seed/media-${target.user_id || target.group_id}-${i}/300`} className="w-full h-full object-cover" alt="media" />
                </div>
              ))}
           </div>
        </div>

        <div className="p-6 space-y-2 border-t border-slate-50 mb-10">
           <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block">Settings</label>
           
           <button 
             onClick={onToggleMute}
             className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition group"
           >
              <div className="flex items-center gap-3 text-slate-600 group-hover:text-violet-600 font-bold text-[10px] uppercase tracking-widest">
                 {isMuted ? <BellOff size={16} className="text-rose-500" /> : <Bell size={16} />} 
                 {isMuted ? 'Notifications Muted' : 'Silence Notifications'}
              </div>
              <div className={`w-8 h-4 rounded-full relative transition-colors ${isMuted ? 'bg-slate-200' : 'bg-violet-600'}`}>
                 <div className={`absolute top-1 w-2 h-2 bg-white rounded-full transition-all ${isMuted ? 'left-1' : 'right-1'}`} />
              </div>
           </button>

           <button 
             onClick={onBlock}
             className={`w-full flex items-center gap-3 p-3 rounded-2xl transition group font-bold text-[10px] uppercase tracking-widest ${isBlocked ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}
           >
              {isBlocked ? <Unlock size={16} /> : <Shield size={16} />}
              {isBlocked ? 'Unblock User' : 'Block User'}
           </button>
        </div>
      </div>
    </motion.aside>
  );
};
