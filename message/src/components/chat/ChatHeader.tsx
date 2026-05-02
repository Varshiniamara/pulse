import { Phone, Video, Info, Users, MoreHorizontal } from 'lucide-react';
import Avatar from '../common/Avatar';
import { useAppSelector } from '../../store/hooks';
import { useEffect, useRef, useState } from 'react';

interface ChatHeaderProps {
  conversation: any;
  onInfoToggle: () => void;
  showInfo: boolean;
  onVoiceCall: () => void;
  onVideoCall: () => void;
}

const statusLabel: Record<string, string> = {
  online: 'Active Now',
  away: 'Away',
  busy: 'Busy',
  offline: 'Inactive',
};

export default function ChatHeader({ conversation, onInfoToggle, showInfo, onVoiceCall, onVideoCall }: ChatHeaderProps) {
  const currentUser = useAppSelector((state) => state.auth.user);
  const currentUserId = String((currentUser as any)?._id || (currentUser as any)?.id || '');
  
  const { type, isTyping } = conversation;
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const chatId = String(conversation?._id || '');
  const moreMenuRef = useRef<HTMLDivElement | null>(null);

  let displayName = 'Unknown User';
  let displayStatus = 'Offline';
  let displayProfilePicture: string | undefined;

  if (type === 'group') {
    displayName = conversation.chatName || 'Group Chat';
    const memberCount = conversation.participants?.length || 0;
    displayStatus = `${memberCount} members`;
  } else {
    const otherUser = conversation.participants?.find((p: any) => String(p?._id || p?.id || '') !== currentUserId);
    const safeUser = otherUser || conversation.participants?.[0];
    displayName = safeUser?.username || 'Unknown User';
    displayProfilePicture = safeUser?.profilePicture;
    displayStatus = safeUser?.status ? statusLabel[safeUser.status] : 'Inactive';
  }

  return (
    <div className="h-14 px-4 flex items-center justify-between border-b border-violet-800/20 bg-violet-950/40 backdrop-blur-xl flex-shrink-0 z-10">
      {/* LEFT SIDE - Icons moved here as requested */}
      <div className="flex items-center gap-0.5">
        <button onClick={onVoiceCall} className="p-2 rounded-xl h-9 w-9 flex items-center justify-center hover:bg-violet-600 text-violet-400 hover:text-white transition-all" title="Voice call">
          <Phone size={16} />
        </button>
        <button onClick={onVideoCall} className="p-2 rounded-xl h-9 w-9 flex items-center justify-center hover:bg-violet-600 text-violet-400 hover:text-white transition-all" title="Video call">
          <Video size={16} />
        </button>
        <button
          onClick={onInfoToggle}
          className={`p-2 rounded-xl h-9 w-9 flex items-center justify-center transition-all ${showInfo ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20' : 'hover:bg-violet-600 text-violet-400 hover:text-white'}`}
          title="Info"
        >
          <Info size={16} />
        </button>
      </div>

      {/* CENTER/RIGHT - User Info */}
      <div className="flex items-center gap-3 text-right">
        <div className="hidden sm:block">
          <h2 className="font-extrabold text-white text-xs uppercase tracking-widest leading-none mb-1">{displayName}</h2>
          {isTyping ? (
            <p className="text-[10px] font-bold text-emerald-400 animate-pulse tracking-tight">TYPING...</p>
          ) : (
            <p className="text-[9px] font-bold text-violet-400/70 uppercase tracking-tighter">
              {displayStatus}
            </p>
          )}
        </div>
        <div className="relative">
             {type === 'group' ? (
                <div className="w-9 h-9 rounded-xl bg-violet-800 flex items-center justify-center shadow-lg border border-violet-700/50">
                    <Users size={16} className="text-violet-300" />
                </div>
            ) : (
                <Avatar username={displayName} src={displayProfilePicture} size="sm" status={displayStatus === 'Inactive' ? 'offline' : 'online'} showStatus />
            )}
        </div>
      </div>
    </div>
  );
}
