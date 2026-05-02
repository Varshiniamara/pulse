import { useEffect, useRef } from 'react';
import { Message } from '../../types';
import MessageBubble from './MessageBubble';

interface MessageListProps {
  messages: Message[];
  isGroupChat: boolean;
}

function shouldShowAvatar(messages: Message[], index: number): boolean {
  if (messages[index].isMe) return false;
  const next = messages[index + 1];
  return !next || next.isMe || next.senderId !== messages[index].senderId;
}

function shouldShowName(messages: Message[], index: number): boolean {
  const prev = messages[index - 1];
  return !prev || prev.senderId !== messages[index].senderId;
}

function isNewDay(messages: Message[], index: number): boolean {
  if (index === 0) return true;
  const current = new Date((messages[index] as any).timestamp || (messages[index] as any).createdAt || Date.now());
  const prev = new Date((messages[index - 1] as any).timestamp || (messages[index - 1] as any).createdAt || Date.now());
  return current.toDateString() !== prev.toDateString();
}

export default function MessageList({ messages, isGroupChat }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 bg-violet-950">
      {messages.map((message, index) => (
        <div key={message._id}>
          {isNewDay(messages, index) && (
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400 font-medium px-2">
                {new Date((message as any).timestamp || (message as any).createdAt || Date.now()).toLocaleDateString([], {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
          )}
          <MessageBubble
            message={message}
            showAvatar={shouldShowAvatar(messages, index)}
            showName={shouldShowName(messages, index)}
            isGroupChat={isGroupChat}
          />
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
