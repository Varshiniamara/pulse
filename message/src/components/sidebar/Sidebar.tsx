import { useEffect, useRef, useState } from 'react';
import { PenSquare, Settings, Bell, ChevronDown, LogOut, User as UserIcon, Zap, Users as UsersIcon, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Conversation, User } from '../../types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/features/authSlice';
import { clearChatState, addConversation } from '../../store/features/chatSlice';
import SearchBar from './SearchBar';
import ConversationList from './ConversationList';
import Avatar from '../common/Avatar';
import { StartChatForm } from './StartChatForm'; 
import { CreateGroupModal } from './CreateGroupModal';
import { UserDirectoryModal } from './UserDirectoryModal';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import { useChat } from '../../hooks/useChat';

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (conversation: Conversation) => void;
  currentUser: User;
}

export default function Sidebar({ conversations, activeId, onSelect, currentUser }: SidebarProps) {
  const [search, setSearch] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showDirectoryModal, setShowDirectoryModal] = useState(false);
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const token = useAppSelector((state) => state.auth.token);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const { startDirectMessage } = useChat();

  const totalUnread = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  const handleLogout = async () => {
    try {
      if (token) {
        await axios.post(
          `${API_BASE_URL}/api/auth/logout`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (error) {
      console.error('Logout status update failed', error);
    }
    dispatch(clearChatState());
    dispatch(logout());
  };

  const focusStartChat = () => {
    const el = document.getElementById('start-chat-email-input') as HTMLInputElement | null;
    el?.focus();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!showUserMenu) return;
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  return (
    <aside className="w-64 flex-shrink-0 bg-violet-950 flex flex-col h-full border-r border-violet-800/20 shadow-[4px_0_24px_rgba(0,0,0,0.3)] z-10">
      {/* Header - Icons on the LEFT now */}
      <div className="px-3 pt-3 pb-2">
        <div className="flex items-center gap-1 mb-2 bg-violet-900/40 p-1 rounded-2xl border border-violet-800/30">
          <button
            onClick={() => setShowUserMenu((v) => !v)}
            className="p-1.5 rounded-xl hover:bg-violet-600 text-violet-300 hover:text-white transition-all duration-200"
            title="Account settings"
          >
            <Settings size={18} />
          </button>
          <button
            onClick={() => setShowGroupModal(true)}
            className="p-1.5 rounded-xl hover:bg-violet-600 text-violet-300 hover:text-white transition-all duration-200"
            title="Create group"
          >
            <Plus size={18} />
          </button>
          <button
            onClick={() => setShowDirectoryModal(true)}
            className="p-1.5 rounded-xl hover:bg-violet-600 text-violet-300 hover:text-white transition-all duration-200"
            title="Users directory"
          >
            <UsersIcon size={18} />
          </button>
          
          <div className="flex-1" /> {/* Spacer */}

          <div className="flex items-center gap-1.5 pr-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Zap size={14} className="text-white" />
            </div>
          </div>
        </div>
        
        <SearchBar value={search} onChange={setSearch} />
      </div>

      <StartChatForm />

      <div className="flex-1 overflow-hidden flex flex-col">
          <ConversationList
            conversations={conversations}
            activeId={activeId}
            onSelect={onSelect}
            searchQuery={search}
          />
      </div>

      {/* User footer - Just Profile Picture button as requested */}
      <div className="border-t border-violet-800/20 px-4 py-3 flex items-center justify-center relative" ref={userMenuRef}>
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className={`relative group p-1 rounded-2xl transition-all duration-300 ${showUserMenu ? 'bg-violet-600 scale-110' : 'hover:bg-violet-800'}`}
        >
          <Avatar 
            username={currentUser.name || currentUser.username} 
            src={(currentUser as any)?.profilePicture || undefined}
            size="md" 
            status={currentUser.status || 'online'} 
            showStatus 
          />
          <div className="absolute -top-1 -right-1">
             {totalUnread > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-lg ring-2 ring-violet-950">
                  {totalUnread}
                </span>
             )}
          </div>
        </button>

        {showUserMenu && (
          <div className="absolute bottom-16 left-4 right-4 bg-violet-900/95 backdrop-blur-xl rounded-2xl overflow-hidden border border-violet-700/50 text-sm shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
             <div className="p-3 border-b border-violet-800/50">
                <p className="text-xs font-bold text-violet-400 uppercase tracking-widest leading-none mb-1">Signed in as</p>
                <p className="text-sm font-bold text-white truncate">{currentUser.username}</p>
             </div>
            {(['online', 'away', 'busy', 'offline'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setShowUserMenu(false)}
                className={`w-full flex items-center gap-2.5 px-4 py-2 hover:bg-white/5 transition capitalize ${
                  (currentUser.status || 'online') === s ? 'text-white font-bold' : 'text-violet-300/70'
                }`}
              >
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  s === 'online' ? 'bg-emerald-400' :
                  s === 'away' ? 'bg-yellow-400' :
                  s === 'busy' ? 'bg-rose-400' :
                  'bg-slate-500'
                }`} />
                {s}
              </button>
            ))}
            <div className="h-px bg-violet-800/60 w-full" />
            <button
              onClick={() => { navigate('/profile'); setShowUserMenu(false); }}
              className="w-full flex items-center gap-2.5 px-4 py-3 hover:bg-white/5 transition text-violet-200"
            >
              <UserIcon size={16} />
              <span className="font-medium">Profile Settings</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-4 py-3 hover:bg-rose-500/10 transition text-rose-400"
            >
              <LogOut size={16} />
              <span className="font-bold uppercase tracking-wider text-xs">Sign Out</span>
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {showGroupModal && (
        <CreateGroupModal 
          onClose={() => setShowGroupModal(false)} 
          onSuccess={(newChat) => {
            dispatch(addConversation(newChat));
            onSelect(newChat);
          }}
        />
      )}
      {showDirectoryModal && (
        <UserDirectoryModal 
          onClose={() => setShowDirectoryModal(false)}
          onSelectUser={(email) => {
            startDirectMessage(email);
          }}
        />
      )}
    </aside>
  );
}
