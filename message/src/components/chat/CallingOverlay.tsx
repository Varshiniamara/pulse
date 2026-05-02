import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhoneOff, Mic, Video, Volume2, MicOff, VideoOff, Activity } from 'lucide-react';

interface CallingOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: { name: string; user_id: string; status?: string };
  type: 'voice' | 'video';
}

export const CallingOverlay = ({ isOpen, onClose, targetUser, type }: CallingOverlayProps) => {
  const [timer, setTimer] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let interval: number;
    let audioInterval: number;

    if (isOpen) {
      interval = window.setInterval(() => setTimer(prev => prev + 1), 1000);
      startMedia();
      
      audioInterval = window.setInterval(() => {
        if (!isMuted) setAudioLevel(Math.random() * 100);
        else setAudioLevel(0);
      }, 100);
    } else {
      stopMedia();
    }
    return () => {
      clearInterval(interval);
      clearInterval(audioInterval);
      stopMedia();
    };
  }, [isOpen, isMuted]);

  const startMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: type === 'video', audio: true });
      streamRef.current = stream;
      if (type === 'video' && videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Hardware access denied:", err);
    }
  };

  const stopMedia = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[500] bg-zinc-950 flex flex-col items-center justify-between overflow-hidden">
          {type === 'video' && (
            <div className="absolute inset-0 z-0">
               <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover transition-opacity duration-1000 ${cameraOff ? 'opacity-0' : 'opacity-40'}`} />
               <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-zinc-950/60" />
            </div>
          )}

          <div className="flex flex-col items-center gap-4 text-center mt-20 z-10">
            <div className="relative">
              <div className="w-32 h-32 rounded-[2.5rem] bg-violet-900 overflow-hidden shadow-2xl relative border-4 border-violet-500/30">
                <img src={`https://i.pravatar.cc/300?u=${targetUser.user_id}`} className="w-full h-full object-cover grayscale-[0.3]" alt="caller" />
              </div>
              <div className={`absolute -top-2 -right-2 w-6 h-6 border-4 border-zinc-950 rounded-full ${targetUser.status === 'Online' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-amber-500 animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.5)]'}`} />
              
              {!isMuted && (
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-end gap-0.5 h-8">
                   {[1,2,3,4,5].map(i => (
                     <motion.div key={i} animate={{ height: [4, audioLevel * (i/5), 4] }} transition={{ repeat: Infinity, duration: 0.2 }} className="w-1 bg-violet-500 rounded-full" />
                   ))}
                </div>
              )}
            </div>
            <div className="mt-8">
              <h2 className="text-4xl font-black text-white tracking-[0.2em] uppercase mb-2">{targetUser.name}</h2>
              <p className="text-violet-400 font-bold uppercase tracking-[0.4em] text-[10px]">
                {isMuted ? 'MICROPHONE MUTED' : (type === 'video' ? 'SECURE VIDEO FEED' : 'HD VOICE NODE')}
              </p>
              <p className="text-white font-mono text-2xl mt-6 tracking-widest">{formatTime(timer)}</p>
            </div>
          </div>

          <div className="flex items-center gap-6 mb-20 z-10">
            <button onClick={() => setIsMuted(!isMuted)} className={`w-16 h-16 rounded-[2rem] border transition-all flex items-center justify-center ${isMuted ? 'bg-rose-500 border-rose-400 text-white shadow-lg shadow-rose-900/40' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}>
              {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
            </button>
            <button onClick={onClose} className="w-24 h-24 rounded-[3rem] bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg transition-all active:scale-95 group">
              <PhoneOff size={40} className="group-hover:rotate-[135deg] transition-transform duration-500" />
            </button>
            {type === 'video' && (
              <button onClick={() => setCameraOff(!cameraOff)} className={`w-16 h-16 rounded-[2rem] border transition-all flex items-center justify-center ${cameraOff ? 'bg-white/10 border-white/20 text-white' : 'bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-900/40'}`}>
                {cameraOff ? <VideoOff size={24} /> : <Video size={24} />}
              </button>
            )}
            {type === 'voice' && (
              <button className="w-16 h-16 rounded-[2rem] bg-white/5 border border-white/10 text-white flex items-center justify-center">
                <Volume2 size={24} />
              </button>
            )}
          </div>

          <div className="absolute bottom-10 flex flex-col items-center gap-2 z-10">
             <div className="flex items-center gap-1.5 opacity-50">
                <Activity size={12} className="text-emerald-500" />
                <span className="text-[8px] font-black text-white uppercase tracking-[0.3em]">Network Latency: 12ms</span>
             </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
