export type MessageStatus = 'sent' | 'delivered' | 'read';

export type UserStatus = 'online' | 'offline' | 'away' | 'busy';

export interface User {
  id?: string;
  _id: string;
  name?: string;
  username: string;
  email?: string;
  avatar?: string;
  profilePicture?: string;
  bio?: string;
  phoneNumber?: string;
  status: UserStatus;
  lastSeen?: string;
}

export interface Message {
  _id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  timestamp: string;
  status: MessageStatus;
  isMe: boolean;
  reactions?: { emoji: string; count: number }[];
}

export interface Conversation {
  _id: string;
  type: 'dm' | 'group';
  username: string;
  avatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline?: boolean;
  status?: UserStatus;
  members?: User[];
  memberCount?: number;
  description?: string;
  isTyping?: boolean;
  pinnedMessage?: string;
}

export interface ActiveChat {
  conversation: Conversation;
  messages: Message[];
}
