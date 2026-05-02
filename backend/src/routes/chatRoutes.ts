import { Router } from 'express';
import { createOrFetchChat, getUserChats, removeFromGroup,createGroupChat} from '../controllers/chatController';
import { protectRoute } from '../middleware/authMiddleware';

const router = Router();

// All chat routes should be protected
router.use(protectRoute);

router.post('/', createOrFetchChat);
router.get('/', getUserChats);
router.put('/group/remove', removeFromGroup)
router.post('/group', createGroupChat)

export default router;