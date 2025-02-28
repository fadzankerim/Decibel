import { Router } from 'express'
import { protectRoute } from '../middleware/auth.middleware.js';
import { getAllUsers, getMessages } from '../controller/user.controller.js';

const router = Router();

// getting all users for signed in users
router.get('/', protectRoute,  getAllUsers )

// todo: get user messages endpoint ->
router.get('messages/:userId', protectRoute,  getMessages )

export default router;