import { Router } from 'express';
import multer from 'multer';
import { searchUsers, getProfile, updateProfilePicture, deleteProfilePicture } from '../controllers/userController';
import { protectRoute } from '../middleware/authMiddleware';

const router = Router();

// Configure Multer for profile picture upload
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit for profile pictures
});

// Protect this route so only logged-in users can search
router.get('/', protectRoute, searchUsers);

// Get current user's profile
router.get('/profile/me', protectRoute, getProfile);

// Update profile picture
router.post('/profile/picture', protectRoute, upload.single('profilePicture'), updateProfilePicture);

// Delete profile picture
router.delete('/profile/picture', protectRoute, deleteProfilePicture);

// Update general profile info
import { updateProfile } from '../controllers/userController';
router.put('/profile', protectRoute, updateProfile);

export default router;