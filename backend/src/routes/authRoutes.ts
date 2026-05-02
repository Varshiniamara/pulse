import { Router } from 'express';
import { register, login, logout } from '../controllers/authController';
import { protectRoute } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protectRoute, logout);

export default router;