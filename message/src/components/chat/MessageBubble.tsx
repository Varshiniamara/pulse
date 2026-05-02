import { Check, CheckCheck, FileText } from 'lucide-react';
import Avatar from '../common/Avatar';
import { useAppSelector } from '../../store/hooks'; 
import { toMediaUrl } from '../../config/api';

interface MessageBubbleProps {
  message: any; 
  showAvatar: boolean;
  showName: boolean;
  isGroupChat: boolean;
}

export default function MessageBubble({ message, showAvatar, showName, isGroupChat }: MessageBubbleProps) {
  const currentUser = useAppSelector((state) => state.auth.user);

  const rawSenderId = message.senderId?._id || message.senderId?.id || message.senderId;
  const rawMyId = currentUser?._id || (currentUser as any)?.id;

  const safeSenderId = String(rawSenderId);
  const safeMyId = String(rawMyId);

  const isMe = safeSenderId === safeMyId;

  const content = message.content || ''; 
  const senderUsername = message.senderId?.username || (isMe ? currentUser?.username : 'Unknown User'); 
  const senderProfilePicture = message.senderId?.profilePicture || null;
  const status = message.status || 'delivered'; 
  const mediaUrl = toMediaUrl(message.mediaUrl);
  
  const timestamp = new Date(message.timestamp || message.createdAt || Date.now());
  const timeString = timestamp.toLocaleString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex items-end gap-2 mb-0.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className="w-7 flex-shrink-0">
        {!isMe && showAvatar && (
          <Avatar username={senderUsername} src={senderProfilePicture || undefined} size="sm" />
        )}
      </div>

      <div className={`flex flex-col max-w-[85%] ${isMe ? 'items-end' : 'items-start'}`}>
        {!isMe && isGroupChat && showName && (
          <span className="text-[10px] font-bold text-violet-400 mb-0.5 ml-1 uppercase tracking-wider">{senderUsername}</span>
        )}

        <div className="relative group">
          <div
            className={`px-3 py-1.5 rounded-2xl text-sm leading-snug flex flex-col gap-1.5 ${
              isMe
                ? 'bg-gradient-to-br from-violet-500 to-indigo-500 text-white rounded-br-sm shadow-md shadow-violet-950/20'
                : 'bg-violet-900/40 text-violet-50 rounded-bl-sm border border-violet-800/30 backdrop-blur-sm'
            }`}
          >
            {mediaUrl && message.mediaType === 'image' && (
              <img 
                src={mediaUrl} 
                alt="attachment" 
                className="max-w-full rounded-xl max-h-60 object-cover"
              />
            )}
            
            {mediaUrl && message.mediaType === 'video' && (
              <video 
                src={mediaUrl} 
                controls 
                className="max-w-full rounded-xl max-h-60"
              />
            )}

            {mediaUrl && message.mediaType === 'audio' && (
              <audio src={mediaUrl} controls className="max-w-full" />
            )}

            {mediaUrl && message.mediaType === 'document' && (
              <a 
                href={mediaUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`flex items-center gap-2 p-2 rounded-lg underline text-xs ${isMe ? 'bg-indigo-600/50 text-white' : 'bg-violet-950/50 text-violet-200'}`}
              >
                <FileText size={14} /> {message.mediaName || 'Document'}
              </a>
            )}

            {content && <span className="whitespace-pre-wrap">{content}</span>}
          </div>

          <div className={`flex items-center gap-1 mt-0.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
            <span className="text-[9px] font-bold text-violet-400/60 uppercase tracking-tighter">{timeString}</span>
            {isMe && (
              <span className="text-violet-400/60 scale-75">
                {status === 'read' ? (
                  <CheckCheck size={12} className="text-violet-400" />
                ) : status === 'delivered' ? (
                  <CheckCheck size={12} />
                ) : (
                  <Check size={12} />
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
