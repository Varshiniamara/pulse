import { useState, useRef } from 'react';
import { Search, MessageSquare, Users, Settings, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import usersData from '../../data/json/users_50_sample.json';
import groupsData from '../../data/json/groups_20_sample.json';
import { StoriesBar } from '../stories/StoriesBar';

const BASE_URL = 'http://127.0.0.1:5005';

interface SocialSidebarProps {
  onSelectUser: (user: any) => void;
  onSelectGroup: (group: any) => void;
  onOpenStory: (index: number) => void;
  activeId: string | null;
  currentUser: any;
  unreadCounts: Record<string, number>;
  onPostStory: (file: File) => void;
  stories: any[];
  networkUsers?: any[];
}

export const SocialSidebar = ({ 
  onSelectUser, onSelectGroup, onOpenStory, activeId, currentUser, unreadCounts, onPostStory, stories, networkUsers = []
}: SocialSidebarProps) => {
  const [tab, setTab] = useState<'chats' | 'groups'>('chats');
  const [search, setSearch] = useState('');
  const storyInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const displayUsers = networkUsers.length > 0 ? networkUsers : usersData;
  const filteredUsers = displayUsers.filter(u => (u.name || u.username || '').toLowerCase().includes(search.toLowerCase()));
  const filteredGroups = groupsData.filter(g => g.group_name.toLowerCase().includes(search.toLowerCase()));

  const handleStoryFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onPostStory(file);
  };

  return (
    <aside className="w-80 h-full bg-white border-r border-slate-100 flex flex-col flex-shrink-0 z-20">
      {/* Header */}
      <div className="p-6 pb-2 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-black text-slate-800 uppercase tracking-tighter italic">Pulse</h1>
          <div className="flex gap-1">
             <button onClick={() => navigate('/profile')} className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition">
               <Settings size={20} />
             </button>
             <button className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition">
               <MoreVertical size={20} />
             </button>
          </div>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-4 text-slate-400 group-focus-within:text-violet-600 transition-colors" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search network..."
            className="w-full bg-slate-50 border border-slate-100 pl-12 pr-4 py-3.5 rounded-2xl outline-none focus:border-violet-600 focus:bg-white transition-all text-sm font-semibold"
          />
        </div>
      </div>

      <StoriesBar onOpenStory={onOpenStory} onAddStory={() => storyInputRef.current?.click()} stories={stories} />
      <input type="file" ref={storyInputRef} className="hidden" onChange={handleStoryFile} />

      {/* Tabs */}
      <div className="px-6 flex gap-1 mb-4">
        <button onClick={() => setTab('chats')} className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all relative ${tab === 'chats' ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>
          <div className="flex items-center justify-center gap-2">
            <MessageSquare size={14} /> Messages
            {Object.values(unreadCounts).reduce((a, b) => a + b, 0) > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-lg border-2 border-white">
                {Object.values(unreadCounts).reduce((a, b) => a + b, 0)}
              </span>
            )}
          </div>
        </button>
        <button onClick={() => setTab('groups')} className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'groups' ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>
          <div className="flex items-center justify-center gap-2">
            <Users size={14} /> Groups
          </div>
        </button>
      </div>

      {/* List Area */}
      <div className="flex-1 overflow-y-auto px-4 space-y-1 scrollbar-none">
        {tab === 'chats' ? (
          filteredUsers.map(user => {
            const count = unreadCounts[`user-${user.user_id}`];
            return (
              <button 
                key={user.user_id} 
                onClick={() => onSelectUser(user)}
                className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all ${activeId === `user-${user.user_id}` ? 'bg-violet-50 text-violet-900' : 'hover:bg-slate-50 text-slate-600'}`}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden shadow-sm">
                    <img src={user.profilePicture ? `${BASE_URL}${user.profilePicture}` : `https://i.pravatar.cc/150?u=${user.user_id}`} alt="pfp" className="w-full h-full object-cover" />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 border-2 border-white rounded-full ${user.status?.toLowerCase() === 'online' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                </div>
                <div className="flex-1 text-left overflow-hidden">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-xs uppercase tracking-tight truncate">{user.name || user.username}</h3>
                    {count && <span className="bg-violet-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-lg">{count}</span>}
                  </div>
                  <p className="text-[10px] font-bold opacity-60 truncate">Active member</p>
                </div>
              </button>
            );
          })
        ) : (
          filteredGroups.map(group => {
            const count = unreadCounts[`group-${group.group_id}`];
            return (
              <button 
                key={group.group_id} 
                onClick={() => onSelectGroup(group)}
                className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all ${activeId === `group-${group.group_id}` ? 'bg-violet-50 text-violet-900' : 'hover:bg-slate-50 text-slate-600'}`}
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden shadow-sm flex items-center justify-center text-slate-400 group-hover:text-violet-600">
                  <img src={`https://i.pravatar.cc/150?u=group-${group.group_id}`} alt="gpfp" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 text-left overflow-hidden">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-xs uppercase tracking-tight truncate">{group.group_name}</h3>
                    {count && <span className="bg-violet-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-lg">{count}</span>}
                  </div>
                  <p className="text-[10px] font-bold opacity-60 truncate">Public community active.</p>
                </div>
              </button>
            )
          })
        )}
      </div>

      {/* User Footer */}
      <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
               <div className="w-10 h-10 rounded-xl bg-violet-600 overflow-hidden shadow-lg shadow-violet-100">
                  <img src={currentUser?.profilePicture ? `${BASE_URL}${currentUser.profilePicture}` : `https://i.pravatar.cc/100?u=${currentUser?.userId || 'me'}`} className="w-full h-full object-cover" alt="me" />
               </div>
               <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-50" />
            </div>
            <div className="overflow-hidden">
               <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest leading-none mb-1">{currentUser?.username || 'GUEST'}</p>
               <p className="text-[9px] font-bold text-slate-400 uppercase">ACTIVE SESSION</p>
            </div>
         </div>
         <button onClick={() => window.location.href='/profile'} className="p-2 text-slate-400 hover:text-violet-600 hover:bg-white rounded-xl transition-all shadow-sm">
            <Settings size={20} />
         </button>
      </div>
    </aside>
  );
};
