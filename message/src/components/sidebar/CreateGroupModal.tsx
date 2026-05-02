import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Search, Check, Users } from 'lucide-react';
import Avatar from '../common/Avatar';
import { API_BASE_URL } from '../../config/api';

interface CreateGroupModalProps {
  onClose: () => void;
  onSuccess: (newChat: any) => void;
}

export const CreateGroupModal = ({ onClose, onSuccess }: CreateGroupModalProps) => {
  const [chatName, setChatName] = useState('');
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (search.length > 1) {
      const delayDebounceFn = setTimeout(async () => {
        try {
          const { data } = await axios.get(`${API_BASE_URL}/api/users?search=${search}`);
          setUsers(data);
        } catch (error) {
          console.error('Failed to search users', error);
        }
      }, 300);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setUsers([]);
    }
  }, [search]);

  const toggleUser = (user: any) => {
    if (selectedUsers.find(u => u._id === user._id)) {
      setSelectedUsers(selectedUsers.filter(u => u._id !== user._id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleCreateGroup = async () => {
    if (!chatName.trim() || selectedUsers.length === 0) return;
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/chats/group`, {
        chatName,
        users: selectedUsers.map(u => u._id),
      });
      onSuccess(data);
      onClose();
    } catch (error) {
      console.error('Failed to create group chat', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-violet-950/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl flex flex-col max-h-[80vh] overflow-hidden border border-violet-100">
        {/* Header */}
        <div className="p-6 border-b border-violet-50 flex items-center justify-between bg-gradient-to-r from-violet-50 to-indigo-50">
          <div>
            <h3 className="text-xl font-extrabold text-violet-950">Create Group</h3>
            <p className="text-xs text-violet-500 mt-1">Chat with multiple people at once</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition text-violet-400 hover:text-violet-600 shadow-sm">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {/* Group Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-violet-400 uppercase tracking-widest">Group Name</label>
            <input
              type="text"
              value={chatName}
              onChange={(e) => setChatName(e.target.value)}
              placeholder="Team Pulse, Family..."
              className="w-full px-4 py-3 bg-violet-50/50 border border-violet-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all font-medium text-violet-950"
            />
          </div>

          {/* User Search */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-violet-400 uppercase tracking-widest">Add Members ({selectedUsers.length})</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-400" size={16} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by username or email..."
                className="w-full pl-10 pr-4 py-2.5 bg-violet-50/50 border border-violet-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all text-sm"
              />
            </div>

            {/* Results */}
            <div className="space-y-1">
              {users.map(user => (
                <button
                  key={user._id}
                  onClick={() => toggleUser(user)}
                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-violet-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <Avatar username={user.username} src={user.profilePicture} size="sm" />
                    <div className="text-left">
                      <p className="text-sm font-semibold text-violet-950">{user.username}</p>
                      <p className="text-xs text-violet-400">{user.email}</p>
                    </div>
                  </div>
                  {selectedUsers.find(u => u._id === user._id) ? (
                    <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center text-white">
                      <Check size={14} />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-violet-100" />
                  )}
                </button>
              ))}
            </div>

            {/* Selected Users Pill List */}
            <div className="flex flex-wrap gap-2 pt-2">
              {selectedUsers.map(user => (
                <div key={user._id} className="flex items-center gap-1.5 px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-bold">
                  <span>{user.username}</span>
                  <button onClick={() => toggleUser(user)}><X size={12} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-violet-50 flex gap-3 bg-violet-50/20">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-white border border-violet-100 text-violet-600 rounded-2xl font-bold hover:bg-violet-50 transition shadow-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateGroup}
            disabled={loading || !chatName.trim() || selectedUsers.length === 0}
            className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl font-bold disabled:opacity-50 shadow-lg shadow-violet-200"
          >
            {loading ? 'Creating...' : 'Launch Group'}
          </button>
        </div>
      </div>
    </div>
  );
};
