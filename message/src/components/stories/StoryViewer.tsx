import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface StoryViewerProps {
  isOpen: boolean;
  onClose: () => void;
  stories: any[];
  initialIndex: number;
}

export const StoryViewer = ({ isOpen, onClose, stories, initialIndex }: StoryViewerProps) => {
  const [index, setIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    setIndex(initialIndex);
    setProgress(0);
  }, [isOpen, initialIndex]);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          if (index < stories.length - 1) {
            setIndex(index + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + 1;
      });
    }, 50); // 5 seconds per story
    return () => clearInterval(interval);
  }, [isOpen, index, stories.length, onClose]);

  if (!isOpen) return null;

  const currentStory = stories[index];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 z-[250] bg-black flex items-center justify-center"
      >
        {/* Progress Bars */}
        <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
          {stories.map((_, i) => (
            <div key={i} className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{ width: i < index ? '100%' : i === index ? `${progress}%` : '0%' }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white overflow-hidden">
               <img src={currentStory?.profilePic || `https://i.pravatar.cc/100?u=${currentStory?.user_id}`} alt="user" className="w-full h-full object-cover" />
            </div>
            <span className="text-white font-bold tracking-wide">{currentStory?.userName}</span>
          </div>
          <button onClick={onClose} className="p-2 text-white/70 hover:text-white transition">
            <X size={28} />
          </button>
        </div>

        {/* Content */}
        <div className="relative w-full max-w-lg aspect-[9/16] bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl">
           <img 
            src={currentStory?.media_url || currentStory?.image_url || `https://picsum.photos/seed/${currentStory?.story_id}/1080/1920`} 
            alt="story-content"
            className="w-full h-full object-cover"
           />
           
           {/* Navigation Regions */}
           <div className="absolute inset-0 flex">
              <div className="w-1/3 h-full cursor-pointer" onClick={() => index > 0 && setIndex(index - 1)} />
              <div className="w-2/3 h-full cursor-pointer" onClick={() => index < stories.length - 1 && setIndex(index + 1)} />
           </div>
        </div>

        {/* Navigation Buttons for PC */}
        <button 
          onClick={() => index > 0 && setIndex(index - 1)}
          className="absolute left-10 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition hidden md:block"
        >
          <ChevronLeft size={32} />
        </button>
        <button 
          onClick={() => index < stories.length - 1 && setIndex(index + 1)}
          className="absolute right-10 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition hidden md:block"
        >
          <ChevronRight size={32} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
