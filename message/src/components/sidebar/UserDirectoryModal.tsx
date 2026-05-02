import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Search } from 'lucide-react';
import Avatar from '../common/Avatar';
import { API_BASE_URL } from '../../config/api';

interface UserDirectoryModalProps {
  onClose: () => void;
  onSelectUser: (email: string) => void;
}

export const UserDirectoryModal = ({ onClose, onSelectUser }: UserDirectoryModalProps) => {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // If search is empty, maybe fetch recent or all (constrained by backend)
        const query = search ? `?search=${search}` : '';
        const { data } = await axios.get(`${API_BASE_URL}/api/users${query}`);
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users', error);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-violet-950/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl flex flex-col max-h-[80vh] overflow-hidden border border-violet-100">
        {/* Header */}
        <div className="p-6 border-b border-violet-50 flex items-center justify-between bg-gradient-to-r from-violet-50 to-indigo-50">
          <div>
            <h3 className="text-xl font-extrabold text-violet-950">User Directory</h3>
            <p className="text-xs text-violet-500 mt-1">Discover people to connect with</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition text-violet-400 hover:text-violet-600 shadow-sm">
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-400" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2.5 bg-violet-50/50 border border-violet-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all text-sm"
            />
          </div>
        </div>

        {/* List */}
        <div className="p-2 flex-1 overflow-y-auto min-h-[300px]">
          {loading && users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-violet-400">
              <div className="w-8 h-8 border-4 border-violet-400 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm font-medium">Scanning Pulse Network...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-violet-400">No users found on the network.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {users.map(user => (
                <button
                  key={user._id}
                  onClick={() => {
                    onSelectUser(user.email);
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-violet-50 transition text-left group"
                >
                  <Avatar username={user.username} src={user.profilePicture} size="md" status={user.status} showStatus />
                  <div className="flex-1">
                    <p className="font-bold text-violet-950 group-hover:text-violet-700 transition-colors uppercase text-xs tracking-wider">{user.username}</p>
                    <p className="text-sm text-violet-500">{user.email}</p>
                  </div>
                  <div className="px-3 py-1 bg-violet-100 text-violet-600 rounded-lg text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    MESSAGE
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
