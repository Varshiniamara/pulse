import { Zap } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-violet-50 to-indigo-50 text-center px-8">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center mb-6 shadow-xl shadow-violet-300">
        <Zap size={36} className="text-white" />
      </div>
      <h2 className="text-2xl font-extrabold text-violet-900 mb-2">Welcome to Pulse</h2>
      <p className="text-sm text-violet-500 max-w-xs leading-relaxed">
        Select a conversation from the sidebar to start messaging, or search for someone new.
      </p>
    </div>
  );
}
