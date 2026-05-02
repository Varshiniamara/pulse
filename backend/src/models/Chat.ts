import mongoose, { Schema, Document } from 'mongoose';

export interface IChat extends Document {
  type: '1:1' | 'group';
  chatName?: string; // Required for group chats
  participants: mongoose.Types.ObjectId[];
  groupAdmins: mongoose.Types.ObjectId[]; // To handle moderation
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema: Schema = new Schema({
  type: { type: String, enum: ['1:1', 'group'], required: true },
  chatName: { type: String, trim: true },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  groupAdmins: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { 
  timestamps: true 
});

export default mongoose.model<IChat>('Chat', ChatSchema);