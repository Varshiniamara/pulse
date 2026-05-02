import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface StoriesBarProps {
  onOpenStory: (index: number) => void;
  onAddStory: () => void;
  stories: any[];
}

export const StoriesBar = ({ onOpenStory, onAddStory, stories }: StoriesBarProps) => {

  return (
    <div className="flex items-center gap-4 px-6 py-6 overflow-x-auto scrollbar-none bg-white">
      {/* Add Story Button */}
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onAddStory}
        className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
      >
        <div className="w-14 h-14 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-violet-400 group-hover:text-violet-500 transition-all">
           <Plus size={24} />
        </div>
        <span className="text-[10px] font-black text-slate-400 group-hover:text-violet-600 transition-colors uppercase tracking-widest">Share</span>
      </motion.button>

      {stories.map((story, i) => (
        <motion.div
          key={story.story_id}
          onClick={() => onOpenStory(i)}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          className="flex flex-col items-center gap-1.5 cursor-pointer flex-shrink-0 group"
        >
          <div className="relative p-0.5 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-violet-600 shadow-md transform group-hover:rotate-6 transition-transform">
             <div className="p-0.5 rounded-[calc(1rem+2px)] bg-white">
                <div className="w-14 h-14 rounded-[1rem] overflow-hidden bg-slate-100">
                   <img src={story.profilePic || `https://i.pravatar.cc/100?u=${story.user_id}`} alt="avatar" className="w-full h-full object-cover" />
                </div>
             </div>
          </div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight truncate w-14 text-center group-hover:text-violet-600 transition-colors">
            {story.userName.split(' ')[0]}
          </span>
        </motion.div>
      ))}
    </div>
  );
};
