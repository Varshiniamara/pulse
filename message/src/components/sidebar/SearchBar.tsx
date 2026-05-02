import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-400 pointer-events-none" />
      <input
        type="text"
        placeholder="Search connections..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/5 border border-violet-800/50 text-white placeholder-violet-700 rounded-xl py-2 pl-9 pr-8 text-sm outline-none focus:ring-2 focus:ring-violet-500/50 transition-all font-medium"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-violet-400 hover:text-white transition"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
