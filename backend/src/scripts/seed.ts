import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import Chat from '../models/Chat';
import Message from '../models/Message';
import bcrypt from 'bcryptjs';

dotenv.config();

const users = [
  { username: 'Sarah Chen', email: 'sarah@example.com', password: 'password123' },
  { username: 'Marcus Williams', email: 'marcus@example.com', password: 'password123' },
  { username: 'Priya Patel', email: 'priya@example.com', password: 'password123' },
  { username: 'James Carter', email: 'james@example.com', password: 'password123' },
  { username: 'Olivia Kim', email: 'olivia@example.com', password: 'password123' },
  { username: 'Ryan Torres', email: 'ryan@example.com', password: 'password123' },
  { username: 'Dana Lee', email: 'dana@example.com', password: 'password123' },
  { username: 'David Miller', email: 'david@example.com', password: 'password123' },
  { username: 'Elena Voz', email: 'elena@example.com', password: 'password123' },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pulse_app');
    
    // Clear existing
    await User.deleteMany({ email: { $in: users.map(u => u.email) } });
    await Chat.deleteMany({});
    await Message.deleteMany({});
    
    // Hash passwords and create users
    const createdUsers = await Promise.all(users.map(async (u) => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(u.password, salt);
      return User.create({ ...u, password: hashedPassword });
    }));

    console.log('Dummy users created!');

    const varsh = await User.findOne({ username: 'varsh' });
    const targetUserId = varsh?._id || createdUsers[0]._id;

    // Create MANY 1:1 chats
    for (const user of createdUsers) {
      if (String(user._id) === String(targetUserId)) continue;

      const chat = await Chat.create({
        type: '1:1',
        participants: [targetUserId, user._id]
      });

      await Message.create({
        chatId: chat._id,
        senderId: user._id,
        content: `Hey! This is ${user.username}. Great to see you on Pulse!`
      });
    }

    // Create VARIETY of Groups
    const groupData = [
      { name: 'Pulse Engineering', participants: [targetUserId, createdUsers[0]._id, createdUsers[1]._id] },
      { name: 'Design Sync', participants: [targetUserId, createdUsers[2]._id, createdUsers[4]._id] },
      { name: 'Marketing Pulse', participants: [targetUserId, createdUsers[5]._id, createdUsers[6]._id] },
      { name: 'Random Chat', participants: [targetUserId, ...createdUsers.map(u => u._id)] },
      { name: 'Weekend Plans', participants: [targetUserId, createdUsers[7]._id, createdUsers[8]._id] },
    ];

    for (const g of groupData) {
      const group = await Chat.create({
        type: 'group',
        chatName: g.name,
        participants: g.participants,
        groupAdmins: [targetUserId]
      });

      await Message.create({
        chatId: group._id,
        senderId: createdUsers[Math.floor(Math.random() * createdUsers.length)]._id,
        content: `Welcome to the ${g.name} group!`
      });
    }

    console.log('Massive dummy data seeded successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seed();
