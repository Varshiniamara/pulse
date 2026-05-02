import React from 'react';
import { UserStatus } from '../../types';
import { toMediaUrl } from '../../config/api';

interface AvatarProps {
  username?: string; // Made optional so it won't crash if data is loading
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  status?: UserStatus;
  showStatus?: boolean;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
};

const statusDotSize = {
  xs: 'w-1.5 h-1.5 border',
  sm: 'w-2 h-2 border',
  md: 'w-2.5 h-2.5 border-2',
  lg: 'w-3 h-3 border-2',
};

const statusColors: Record<UserStatus, string> = {
  online: 'bg-emerald-400',
  away: 'bg-amber-400',
  busy: 'bg-rose-400',
  offline: 'bg-slate-400',
};

const avatarColors = [
  'bg-violet-500',
  'bg-indigo-500',
  'bg-purple-500',
  'bg-fuchsia-500',
  'bg-blue-600',
  'bg-violet-600',
  'bg-indigo-600',
  'bg-purple-600',
];

// Added safety fallback if username is undefined
function getAvatarColor(username?: string): string {
  if (!username) return 'bg-slate-600';
  
  const index = username.charCodeAt(0) % avatarColors.length;
  return avatarColors[index];
}

// Added safety fallback if username is undefined
function getInitials(username?: string): string {
  if (!username) return '?';
  
  return username
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function Avatar({ username, src, size = 'md', status, showStatus = false }: AvatarProps) {
  const resolvedSrc = toMediaUrl(src);

  return (
    <div className="relative flex-shrink-0">
      {/* Fixed getAvatarColor(name) -> getAvatarColor(username) */}
      <div className={`${sizeClasses[size]} rounded-xl overflow-hidden flex items-center justify-center font-semibold text-white ${!resolvedSrc ? getAvatarColor(username) : ''}`}>
        {resolvedSrc ? (
          <img src={resolvedSrc} alt={username || 'User Avatar'} className="w-full h-full object-cover" />
        ) : (
          <span>{getInitials(username)}</span>
        )}
      </div>
      
      {showStatus && status && (
        <span className={`absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-white ${statusDotSize[size]} ${statusColors[status]}`} />
      )}
    </div>
  );
}
