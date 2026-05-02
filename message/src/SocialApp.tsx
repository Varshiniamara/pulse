import { useState, useEffect, useRef } from 'react';
import { SocialSidebar } from './components/sidebar/SocialSidebar';
import { SocialChatWindow } from './components/chat/SocialChatWindow';
import { ProfilePanel } from './components/chat/ProfilePanel';
import { StoryViewer } from './components/stories/StoryViewer';
import { AnimatePresence } from 'framer-motion';
import { useAppSelector } from './store/hooks';
import { io, Socket } from 'socket.io-client';
import usersData from './data/json/users_50_sample.json';
import storiesData from './data/json/stories_24hrs.json';
import personalMessages from './data/json/personal_chat_messages.json';
import groupMessages from './data/json/group_chat_messages.json';
import axios from 'axios';

const SOCKET_URL = 'http://127.0.0.1:5005';

export const SocialApp = () => {
  const currentUser = useAppSelector((state) => state.auth.user);
  const [activeTarget, setActiveTarget] = useState<any>(usersData[0]);
  const [targetType, setTargetType] = useState<'user' | 'group'>('user');
  const [showProfile, setShowProfile] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState<string[]>(JSON.parse(localStorage.getItem('pulse_blocked') || '[]'));
  const [storyState, setStoryState] = useState<{ isOpen: boolean; initialIndex: number }>({ isOpen: false, initialIndex: 0 });
  const [mutedNodes, setMutedNodes] = useState<string[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  
  const [allPersonalMessages, setAllPersonalMessages] = useState<any[]>(() => {
    return personalMessages.map(m => ({
      ...m,
      image_url: m.image_url?.startsWith('https://example.com') 
        ? `https://picsum.photos/seed/msg-${m.message_id}/800/600` 
        : m.image_url
    }));
  });
  const [allGroupMessages, setAllGroupMessages] = useState<any[]>(() => {
    return groupMessages.map(m => ({
      ...m,
      image_url: m.image_url?.startsWith('https://example.com') 
        ? `https://picsum.photos/seed/group-msg-${m.message_id}/800/600` 
        : m.image_url
    }));
  });
  const [repliedMsg, setRepliedMsg] = useState<any | null>(null);
  const [reactions, setReactions] = useState<Record<string, string[]>>({});
  const [networkUsers, setNetworkUsers] = useState<any[]>([]);
  
  // Real Storage for Stories
  const [dynamicStories, setDynamicStories] = useState(() => {
    return storiesData.map((s, i) => {
      const user = usersData.find(u => u.user_id === s.user_id);
      return { 
        ...s, 
        userName: user?.name || 'User',
        media_url: `https://picsum.photos/seed/story-${s.user_id}-${i}/1080/1920` 
      };
    });
  });

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);
    if (currentUser?._id) socketRef.current.emit('setup', currentUser._id);
    socketRef.current.on('message received', (newMessage) => {
      if (newMessage.group_id) setAllGroupMessages(p => [...p, newMessage]);
      else setAllPersonalMessages(p => [...p, newMessage]);
    });

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('pulse_token');
        const res = await axios.get(`${SOCKET_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const formatted = res.data.map((u: any) => ({
          ...u,
          user_id: u._id,
          name: u.username
        }));
        setNetworkUsers(formatted);
        if (formatted.length > 0 && !activeTarget) {
           const initial = formatted.find((u: any) => u.user_id !== currentUser?._id) || formatted[0];
           setActiveTarget(initial);
           handleSelectUser(initial); // Trigger the chat initialization logic
        }
      } catch (err) {
        console.error("Pulse: Network users fetch failed", err);
        setNetworkUsers(usersData); // Fallback to sample
      }
    };

    fetchUsers();

    return () => { socketRef.current?.disconnect(); };
  }, [currentUser]);

  const handleSendMessage = async (text: string, media?: File) => {
    try {
      const token = localStorage.getItem('pulse_token');
      let savedMessage: any;

      if (media) {
        const formData = new FormData();
        formData.append('media', media);
        formData.append('content', text);
        formData.append('chatId', activeChatId || activeTarget.user_id);

        const res = await axios.post(`${SOCKET_URL}/api/messages/media`, formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        savedMessage = res.data;
      } else {
        const res = await axios.post(`${SOCKET_URL}/api/messages`, {
          content: text,
          chatId: activeChatId || activeTarget.user_id
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        savedMessage = res.data;
      }

      // Construct socket payload from saved message or local fallback
      const socketPayload = {
        ...savedMessage,
        message_id: savedMessage._id || Date.now().toString(),
        message: savedMessage.content || text,
        sender_id: currentUser?._id,
        receiver_id: targetType === 'user' ? activeTarget.user_id : null,
        group_id: targetType === 'group' ? activeTarget.group_id : null,
        chatId: activeChatId || activeTarget.user_id,
        image_url: savedMessage.mediaUrl || null
      };

      socketRef.current?.emit('new message', socketPayload);
      
      if (targetType === 'user') setAllPersonalMessages(p => [...p, socketPayload]);
      else setAllGroupMessages(p => [...p, socketPayload]);
      
      setRepliedMsg(null);
    } catch (err) {
      console.error("Pulse: Message send failed", err);
      // Local fallback if API fails
      const fallbackMsg = {
        message_id: Date.now().toString(),
        message: text,
        sender_id: currentUser?._id || 'me',
        receiver_id: targetType === 'user' ? activeTarget.user_id : null,
        group_id: targetType === 'group' ? activeTarget.group_id : null,
        chatId: activeChatId || activeTarget.user_id,
        timestamp: new Date().toISOString()
      };
      socketRef.current?.emit('new message', fallbackMsg);
      if (targetType === 'user') setAllPersonalMessages(p => [...p, fallbackMsg]);
      else setAllGroupMessages(p => [...p, fallbackMsg]);
    }
  };

  const handleAddReaction = (messageId: string, emoji: string) => {
    setReactions(prev => {
      const current = prev[messageId] || [];
      if (current.includes(emoji)) return prev;
      return { ...prev, [messageId]: [...current, emoji] };
    });
  };

  const handlePostStory = (file: File) => {
    const newStory = {
      story_id: Date.now().toString(),
      user_id: currentUser?._id || 'me',
      userName: currentUser?.username || 'You',
      media_url: URL.createObjectURL(file), // Real image node
      timestamp: new Date().toISOString(),
      expires_after_hours: "24",
      posted_time: new Date().toISOString(),
      image_url: URL.createObjectURL(file)
    };
    setDynamicStories([newStory, ...dynamicStories]);
    alert('Pulse: Story shared successfully.');
  };

  // Extract counts for sidebar
  const unreadCounts: Record<string, number> = {
    'user-1': 2, 'user-5': 5, 'group-1': 12
  };

  return (
    <div className="h-screen w-screen bg-white overflow-hidden flex font-sans selection:bg-violet-200">
      <SocialSidebar 
        onSelectUser={handleSelectUser} 
        onSelectGroup={handleSelectGroup}
        onOpenStory={(i) => setStoryState({ isOpen: true, initialIndex: i })}
        activeId={targetType === 'user' ? `user-${activeTarget.user_id}` : `group-${activeTarget.group_id}`}
        currentUser={currentUser}
        unreadCounts={unreadCounts}
        onPostStory={handlePostStory}
        stories={dynamicStories}
        networkUsers={networkUsers}
      />
      
      <main className="flex-1 h-full flex flex-row relative">
        <SocialChatWindow 
          activeTarget={activeTarget} 
          type={targetType} 
          messages={targetType === 'user' ? allPersonalMessages : allGroupMessages}
          onSend={handleSendMessage}
          onReply={setRepliedMsg}
          replyingTo={repliedMsg}
          cancelReply={() => setRepliedMsg(null)}
          reactions={reactions}
          onReact={handleAddReaction}
          onOpenProfile={() => setShowProfile(!showProfile)}
          currentUser={currentUser}
        />
        
        <AnimatePresence>
          {showProfile && (
            <ProfilePanel 
              target={activeTarget} 
              type={targetType} 
              onClose={() => setShowProfile(false)} 
              isBlocked={targetType === 'user' && blockedUsers.includes(activeTarget.user_id)}
              onBlock={() => setBlockedUsers(b => b.includes(activeTarget.user_id) ? b.filter(id => id !== activeTarget.user_id) : [...b, activeTarget.user_id])}
              isMuted={mutedNodes.includes(targetType === 'user' ? activeTarget.user_id : activeTarget.group_id)}
              onToggleMute={() => {
                const id = targetType === 'user' ? activeTarget.user_id : activeTarget.group_id;
                setMutedNodes(m => m.includes(id) ? m.filter(x => x !== id) : [...m, id]);
              }}
              currentUser={currentUser}
            />
          )}
        </AnimatePresence>
      </main>

      <StoryViewer 
        isOpen={storyState.isOpen}
        onClose={() => setStoryState({ ...storyState, isOpen: false })}
        stories={dynamicStories}
        initialIndex={storyState.initialIndex}
      />
    </div>
  );

  async function handleSelectUser(user: any) {
    setActiveTarget(user);
    setTargetType('user');
    setRepliedMsg(null);
    
    // If it's a real user (MongoDB ID), fetch or create a chat session
    if (user.user_id && user.user_id.length > 10) {
      try {
        const token = localStorage.getItem('pulse_token');
        const res = await axios.post(`${SOCKET_URL}/api/chats`, {
          participantId: user.user_id,
          isGroup: false
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setActiveChatId(res.data._id);
        socketRef.current?.emit('join chat', res.data._id);
      } catch (err) {
        console.error("Pulse: Chat initialization failed", err);
        setActiveChatId(user.user_id); // Fallback
        socketRef.current?.emit('join chat', user.user_id);
      }
    } else {
      setActiveChatId(user.user_id);
      socketRef.current?.emit('join chat', user.user_id);
    }
  }

  function handleSelectGroup(group: any) {
    setActiveTarget(group);
    setTargetType('group');
    setRepliedMsg(null);
    setActiveChatId(group.group_id);
    socketRef.current?.emit('join chat', group.group_id);
  }
};
