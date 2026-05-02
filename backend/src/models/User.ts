import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password?: string;
  profilePicture?: string;
  bio?: string;
  phoneNumber?: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: null },
  bio: { type: String, default: '' },
  phoneNumber: { type: String, default: '' },
  status: { type: String, enum: ['online', 'offline', 'away', 'busy'], default: 'offline' }
}, { 
  timestamps: true 
});

export default mongoose.model<IUser>('User', UserSchema);