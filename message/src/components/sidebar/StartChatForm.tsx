import React, { useState } from 'react';
import { useChat } from '../../hooks/useChat';
import { Send } from 'lucide-react';

export const StartChatForm = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const { startDirectMessage } = useChat();

  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const result = await startDirectMessage(email);

    if (result?.error) {
      setMessage({ type: 'error', text: result.error });
    } else {
      setEmail('');
    }
    
    setLoading(false);
  };

  return (
    <div className="p-4 border-b border-violet-800/40 bg-violet-950/30 backdrop-blur-md">
      <form onSubmit={handleStartChat} className="flex flex-col gap-2">
        <label className="text-[10px] font-extrabold text-violet-400 uppercase tracking-widest">
          Find Connection
        </label>
        <div className="flex gap-2 text-white">
          <input
            id="start-chat-email-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            className="flex-1 px-3 py-2 text-sm text-white bg-white/5 border border-violet-800/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent transition-all placeholder:text-violet-700"
            required
          />
          <button 
            type="submit" 
            disabled={loading}
            className="w-10 h-10 flex items-center justify-center text-white bg-violet-600 rounded-xl hover:bg-violet-700 transition shadow-lg shadow-violet-900/50 disabled:opacity-50"
          >
            {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send size={16} />}
          </button>
        </div>
        {message.text && (
          <p className={`text-xs mt-1 px-1 font-medium ${message.type === 'error' ? 'text-rose-400' : 'text-emerald-400'}`}>
            {message.text}
          </p>
        )}
      </form>
    </div>
  );
};