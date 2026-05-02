import mongoose, { Schema, Document } from 'mongoose';

export interface IFlag extends Document {
  messageId: mongoose.Types.ObjectId;
  flaggedBy: mongoose.Types.ObjectId;
  reason: string;
  createdAt: Date;
}

const FlagSchema: Schema = new Schema({
  messageId: { type: Schema.Types.ObjectId, ref: 'Message', required: true },
  flaggedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, required: true }
}, { 
  timestamps: true 
});

export default mongoose.model<IFlag>('Flag', FlagSchema);