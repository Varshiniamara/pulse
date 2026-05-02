import { Router } from 'express';
import multer from 'multer';
import { sendMessage, getMessages, deleteMessage, sendMessageWithMedia, markChatMessagesAsRead } from '../controllers/messageController';
import { protectRoute } from '../middleware/authMiddleware';

const router = Router();

// 1. Configure Multer to hold the file in memory
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit
});

// 2. Add upload.single('media') to the route!
router.post('/media', protectRoute, upload.single('media'), sendMessageWithMedia);

// Your existing routes
router.post('/', protectRoute, sendMessage);
router.get('/:chatId', protectRoute, getMessages);
router.patch('/read/:chatId', protectRoute, markChatMessagesAsRead);
router.delete('/:messageId', protectRoute, deleteMessage);

export default router;