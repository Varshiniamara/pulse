import mongoose, { Schema, Document } from 'mongoose';

// Define the allowed media types so TypeScript and Mongoose enforce it
export type MediaType = 'image' | 'video' | 'document' | 'audio' | null;

export interface IMessage extends Document {
  chatId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  content: string;
  mediaUrl?: string;
  mediaType?: MediaType; // Tells React whether to use <img>, <video>, etc.
  mediaName?: string;    // Super important for showing "syllabus.pdf"
  status: 'sent' | 'delivered' | 'read';
  isDeleted: boolean;
  timestamp: Date;
}

const MessageSchema: Schema = new Schema({
  chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  
  // 1. Removed 'required: true'. Default is an empty string if they only send a file.
  content: { type: String, default: '' }, 
  
  // 2. The Media Fields
  mediaUrl: { type: String },
  mediaType: { type: String, enum: ['image', 'video', 'document', 'audio'] },
  mediaName: { type: String }, // Stores the original file name
  
  status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' },
  isDeleted: { type: Boolean, default: false }
}, { 
  timestamps: { createdAt: 'timestamp', updatedAt: false } 
});

export default mongoose.model<IMessage>('Message', MessageSchema);