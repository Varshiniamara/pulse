import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 1. Define Types
export interface Message {
  _id: string;
  chatId: string;
  content: string;
  senderId: { _id: string; username: string };
  isDeleted: boolean;
  status?: 'sent' | 'delivered' | 'read';
  timestamp: string;
}

export interface Chat {
  _id: string; // Or id: string, depending on your setup
  type: '1:1' | 'group';
  participants: any[]; // Or your User[] interface
  chatName?: string;
  groupAdmins?: any[];
  
  // --- ADD THESE NEW PROPERTIES ---
  lastMessage?: string | any; // 'any' is safe here if it could be a string or an object from MongoDB
  lastMessageTime?: string;
  isTyping?: boolean;
  unreadCount?: number;
  memberCount?: number;
}
interface ChatState {
  conversations: Chat[];
  activeConversation: Chat | null;
  activeMessages: Message[];
}

const initialState: ChatState = {
  conversations: [],
  activeConversation: null,
  activeMessages: [],
};

// 2. Create the Slice
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<Chat[]>) => {
      // Map MongoDB _id to id for your Sidebar component
      state.conversations = action.payload.map(chat => ({ ...chat, id: chat._id }));
    },
    setActiveConversation: (state, action: PayloadAction<Chat | null>) => {
      state.activeConversation = action.payload;
    },
    setActiveMessages: (state, action: PayloadAction<Message[]>) => {
      state.activeMessages = action.payload;
    },
    addMessage: (state, action) => {
  // 1. Check if a message with this exact MongoDB _id already exists in our state
  const messageExists = state.activeMessages.some(
    (msg) => msg._id === action.payload._id
  );

  // 2. Only push it to the array if it DOES NOT exist yet
  if (!messageExists) {
    state.activeMessages.push(action.payload);
  }
  
  // Optional: Also update the lastMessage on the conversation in the sidebar
  const conversation = state.conversations.find(c => c._id === action.payload.chatId);
  if (conversation) {
    conversation.lastMessage = action.payload.content;
    conversation.lastMessageTime = action.payload.timestamp;
    if (state.activeConversation?._id !== conversation._id) {
      conversation.unreadCount = (conversation.unreadCount || 0) + 1;
    }
    // conversation.lastMessageTime = ... 
  }
},
    updateMessageAsDeleted: (state, action: PayloadAction<string>) => {
      const messageId = action.payload;
      const message = state.activeMessages.find(msg => msg._id === messageId);
      if (message) {
        message.isDeleted = true;
        message.content = "This message was deleted";
      }
    },
    addConversation: (state, action: PayloadAction<Chat>) => {
  // Check if it's already in the sidebar to prevent duplicates
  const exists = state.conversations.find(c => c._id === action.payload._id);
  if (!exists) {
    // Add the new chat to the top of the list and map the _id
    state.conversations.unshift({ ...action.payload, _id: action.payload._id });
  }
},
    markConversationRead: (state, action: PayloadAction<string>) => {
      const conversation = state.conversations.find((c) => c._id === action.payload);
      if (conversation) {
        conversation.unreadCount = 0;
      }
    },
    markMyMessagesReadInChat: (state, action: PayloadAction<string>) => {
      const chatId = action.payload;
      state.activeMessages = state.activeMessages.map((msg) => {
        if (msg.chatId === chatId) {
          return { ...msg, status: 'read' };
        }
        return msg;
      });
    },
    clearChatState: (state) => {
      state.activeConversation = null;
      state.activeMessages = [];
      state.conversations = [];
    },
  },
});

export const { 
  setConversations, 
  setActiveConversation, 
  setActiveMessages, 
  addMessage, 
  addConversation,
  updateMessageAsDeleted,
  markConversationRead,
  markMyMessagesReadInChat,
  clearChatState,
} = chatSlice.actions;

export default chatSlice.reducer;