import { useState, useRef, useEffect } from 'react';
import { Phone, Video, Paperclip, Smile, Send, X, FileText, CheckCheck, Flag, Reply, Search, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CallingOverlay } from './CallingOverlay';

interface SocialChatWindowProps {
  activeTarget: any;
  type: 'user' | 'group';
  messages: any[];
  onSend: (text: string, file?: File) => void;
  onReply: (msg: any) => void;
  replyingTo: any | null;
  cancelReply: () => void;
  reactions: Record<string, string[]>;
  onReact: (id: string, emoji: string) => void;
  onOpenProfile: () => void;
  currentUser: any;
}

const emojis = ['❤️', '😂', '🔥', '👍', '🙏', '😭', '😮', '👏', '✅', '❌', '🚀', '✨'];
const BASE_URL = 'http://127.0.0.1:5005';

export const SocialChatWindow = ({ 
  activeTarget, type, messages, onSend, onReply, replyingTo, cancelReply, reactions, onReact, onOpenProfile, currentUser
}: SocialChatWindowProps) => {
  const [inputText, setInputText] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCall, setShowCall] = useState<{ isOpen: boolean; type: 'voice' | 'video' }>({ isOpen: false, type: 'voice' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [reactionPin, setReactionPin] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showSearch) scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, showSearch]);

  const filteredMessages = messages.filter(m => {
    const isRelevant = type === 'user' 
      ? (String(m.sender_id) === String(activeTarget.user_id) || String(m.receiver_id) === String(activeTarget.user_id))
      : String(m.group_id) === String(activeTarget?.group_id);
    
    if (!isRelevant) return false;
    if (searchTerm) return m.message.toLowerCase().includes(searchTerm.toLowerCase());
    return true;
  });

  const handleSend = () => {
    if (!inputText.trim() && !selectedFile) return;
    onSend(inputText, selectedFile || undefined);
    setInputText('');
    setSelectedFile(null);
    setPreviewUrl(null);
    setShowEmojis(false);
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-slate-50 overflow-hidden relative">
      <header className="h-16 px-6 bg-white border-b border-slate-100 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
            <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 overflow-hidden shadow-sm">
              <img src={activeTarget.profilePicture ? `${BASE_URL}${activeTarget.profilePicture}` : `https://i.pravatar.cc/100?u=${activeTarget.user_id || activeTarget.group_id}`} className="w-full h-full object-cover" alt="target" />
            </div>
            {type === 'user' && (
              <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 border-2 border-white rounded-full ${activeTarget.status?.toLowerCase() === 'online' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
            )}
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest leading-none mb-1">
              {type === 'user' ? activeTarget.name : activeTarget.group_name}
            </h2>
            <p className={`text-[10px] font-bold uppercase tracking-tighter ${activeTarget.status?.toLowerCase() === 'online' ? 'text-emerald-500' : 'text-amber-500'}`}>
              {type === 'user' ? (activeTarget.status?.toLowerCase() === 'online' ? 'Online' : 'Busy') : 'Active Member'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button onClick={() => setShowSearch(!showSearch)} className={`p-2.5 rounded-xl transition ${showSearch ? 'bg-violet-600 text-white shadow-lg' : 'text-slate-400 hover:text-violet-600 hover:bg-violet-50'}`}>
            <Search size={18} />
          </button>
          <button onClick={() => setShowCall({ isOpen: true, type: 'voice' })} className="p-2.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition">
            <Phone size={18} />
          </button>
          <button onClick={() => setShowCall({ isOpen: true, type: 'video' })} className="p-2.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition">
            <Video size={18} />
          </button>
          <button onClick={onOpenProfile} className="p-2.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition">
            <Info size={18} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {showSearch && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-6 py-3 bg-white border-b border-slate-100 flex items-center gap-3">
             <Search size={14} className="text-slate-400" />
             <input autoFocus value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search..." className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-black text-slate-600 uppercase tracking-widest" />
             <button onClick={() => {setShowSearch(false); setSearchTerm('');}} className="p-1 text-slate-400 hover:text-rose-500"><X size={16} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
        {filteredMessages.map((msg: any) => {
          const userId = currentUser?._id || 'current_user';
          const isMe = String(msg.sender_id) === String(userId) || msg.sender_id === 'me' || msg.sender_id === 'current_user';
          const msgReactions = reactions[msg.message_id] || [];
          return (
            <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={msg.message_id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <div 
                onDoubleClick={() => setReactionPin(msg.message_id)}
                className={`group relative max-w-[75%] p-3 rounded-2xl text-sm shadow-sm transition-all hover:shadow-md ${isMe ? 'bg-violet-600 text-white rounded-tr-sm' : 'bg-white text-slate-700 rounded-tl-sm border border-slate-100'}`}
              >
                {msg.replyTo && (
                  <div className={`mb-2 p-2.5 rounded-xl text-[11px] font-medium border-l-[3px] shadow-sm ${isMe ? 'bg-white/10 border-white/40 text-white/90' : 'bg-slate-50 border-violet-500 text-slate-500'}`}>
                    <p className="truncate italic">"{msg.replyTo.message}"</p>
                  </div>
                )}
                {msg.image_url && (
                  <img 
                    src={msg.image_url.startsWith('blob:') || msg.image_url.startsWith('http') ? msg.image_url : `${BASE_URL}${msg.image_url}`} 
                    className="rounded-xl mb-2 w-full object-cover max-h-60" 
                    alt="media" 
                  />
                )}
                <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <span className={`text-[9px] font-bold uppercase opacity-60 ${isMe ? 'text-violet-100' : 'text-slate-400'}`}>11:24 AM</span>
                  {isMe && <CheckCheck size={12} className="text-violet-100 opacity-60" />}
                </div>

                {/* Reactions Display */}
                {msgReactions.length > 0 && (
                  <div className={`absolute -bottom-4 ${isMe ? 'right-0' : 'left-0'} flex -space-x-1 z-30`}>
                    {msgReactions.map((r, i) => (
                      <div key={i} className="bg-white px-2 py-0.5 rounded-full shadow-lg text-[11px] border border-slate-100 flex items-center justify-center animate-in zoom-in-75 duration-300 hover:scale-125 transition-transform cursor-default">
                        {r}
                      </div>
                    ))}
                  </div>
                )}

                <div className="absolute -bottom-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white p-1 rounded-full shadow-lg border border-slate-100 z-10">
                   <button onClick={() => onReply(msg)} className="text-slate-400 hover:text-violet-600 p-0.5"><Reply size={12} /></button>
                   <button onClick={() => setReactionPin(msg.message_id)} className="text-slate-400 hover:text-amber-500 p-0.5"><Smile size={12} /></button>
                   <button className="text-rose-500 hover:text-rose-600 p-0.5"><Flag size={12} /></button>
                </div>

                {reactionPin === msg.message_id && (
                  <div className={`absolute bottom-full mb-3 ${isMe ? 'right-0' : 'left-0'} bg-white/90 backdrop-blur-xl shadow-2xl rounded-[1.5rem] p-3 border border-white/50 flex gap-2.5 z-[100] animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                    {emojis.slice(0, 8).map(e => (
                      <button 
                        key={e} 
                        onClick={() => {onReact(msg.message_id, e); setReactionPin(null);}} 
                        className="text-2xl hover:scale-150 active:scale-90 transition-all duration-200"
                      >
                        {e}
                      </button>
                    ))}
                    <div className="w-px h-6 bg-slate-200/50 mx-1 self-center" />
                    <button onClick={() => setReactionPin(null)} className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all">
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <footer className="p-4 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto flex flex-col gap-2">
          {replyingTo && (
            <div className="flex items-center justify-between p-3 bg-violet-50 rounded-2xl border border-violet-100">
               <div className="flex items-center gap-3">
                  <Reply size={16} className="text-violet-600" />
                  <p className="text-xs text-slate-600 truncate italic">"{replyingTo.message}"</p>
               </div>
               <button onClick={cancelReply} className="p-1 text-slate-400"><X size={18} /></button>
            </div>
          )}

          {selectedFile && (
            <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-2xl border border-slate-100">
              {previewUrl ? <img src={previewUrl} className="w-12 h-12 rounded-xl object-cover" alt="prev" /> : <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center"><FileText size={20} /></div>}
              <div className="flex-1 overflow-hidden"><p className="text-xs font-bold text-slate-700 truncate">{selectedFile.name}</p></div>
              <button onClick={() => {setSelectedFile(null); setPreviewUrl(null);}} className="p-1.5 text-slate-400 hover:text-rose-500"><X size={18} /></button>
            </div>
          )}

          <div className="flex items-end gap-2 relative">
            <input type="file" ref={fileInputRef} onChange={(e) => {
               const file = e.target.files?.[0];
               if (file) {
                 setSelectedFile(file);
                 if (file.type.startsWith('image/')) setPreviewUrl(URL.createObjectURL(file));
               }
            }} className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} className="p-3 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-2xl transition"><Paperclip size={20} /></button>
            <div className="flex-1 bg-slate-50 rounded-2xl flex items-end px-4 py-2 border border-slate-100">
               <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Type a message..." className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-1.5 resize-none max-h-32 text-slate-700 font-medium" rows={1} />
               <button onClick={() => setShowEmojis(!showEmojis)} className="p-2 text-slate-400 hover:text-amber-500 transition"><Smile size={20} /></button>
            </div>
            {showEmojis && (
               <div className="absolute bottom-16 right-0 bg-white shadow-2xl rounded-3xl p-4 border border-slate-100 grid grid-cols-4 gap-3 z-50 animate-in slide-in-from-bottom-5">
                  {emojis.map(e => <button key={e} onClick={() => {setInputText(p => p + e); setShowEmojis(false);}} className="text-2xl hover:scale-150 transition-transform">{e}</button>)}
               </div>
            )}
            <button onClick={handleSend} className="p-3.5 bg-violet-600 text-white rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all">
               <Send size={20} />
            </button>
          </div>
        </div>
      </footer>
      <CallingOverlay isOpen={showCall.isOpen} onClose={() => setShowCall({ ...showCall, isOpen: false })} targetUser={activeTarget} type={showCall.type} />
    </div>
  );
};
