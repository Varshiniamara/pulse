import { Message, Chat } from '../../store/features/chatSlice';
import Avatar from '../common/Avatar';
import { useAppSelector } from '../../store/hooks';

interface ConversationItemProps {
  conversation: Chat;
  isActive: boolean;
  onClick: () => void;
}

export default function ConversationItem({ conversation, isActive, onClick }: ConversationItemProps) {
  const currentUser = useAppSelector((state) => state.auth.user);
  const currentUserId = String((currentUser as any)?._id || (currentUser as any)?.id || '');
  
  const { type, lastMessage, lastMessageTime, unreadCount } = conversation;
  
  let displayName = 'Unknown User';
  let displayStatus: 'online' | 'away' | 'busy' | 'offline' = 'offline';
  let profilePicture: string | undefined;

  if (type === 'group') {
    displayName = conversation.chatName || 'Group Chat';
  } else {
    // 1:1 Chat: Find the person who is NOT the current user
    const otherUser = conversation.participants?.find((p: any) => String(p?._id || p?.id || '') !== currentUserId);
    const safeUser = otherUser || conversation.participants?.[0];
    displayName = safeUser?.username || 'Unknown User';
    displayStatus = safeUser?.status || 'offline';
    profilePicture = safeUser?.profilePicture;
  }

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-2xl transition-all duration-200 group text-left mb-1 ${
        isActive
          ? 'bg-violet-600 shadow-lg shadow-violet-900/40 translate-x-1'
          : 'hover:bg-violet-800/40 hover:translate-x-0.5'
      }`}
    >
      <div className="relative flex-shrink-0">
        <Avatar 
          username={displayName} 
          src={profilePicture}
          size="md" 
          status={displayStatus} 
          showStatus={type !== 'group'} 
        />
        {unreadCount ? unreadCount > 0 && (
          <span className="absolute -top-1 -left-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-violet-950 shadow-lg">
            {unreadCount}
          </span>
        ) : null}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className={`text-[11px] font-bold uppercase tracking-wider truncate transition-colors ${isActive ? 'text-white' : 'text-violet-200'}`}>
            {displayName}
          </h3>
          {lastMessageTime && (
            <span className={`text-[9px] font-medium whitespace-nowrap uppercase tracking-tighter ${isActive ? 'text-violet-200' : 'text-violet-400'}`}>
              {lastMessageTime}
            </span>
          )}
        </div>
        <p className={`text-xs truncate transition-colors leading-tight mt-0.5 ${isActive ? 'text-violet-100 font-medium' : 'text-violet-400'}`}>
          {lastMessage || (type === 'group' ? 'New group created' : 'Start a conversation')}
        </p>
      </div>
    </button>
  );
}
