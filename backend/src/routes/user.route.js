import { Router } from 'express'
import { protectRoute } from '../middleware/auth.middleware.js';
import { getAllUsers } from '../controller/user.controller.js';

const router = Router();

// getting all users for signed in users
router.get('/', protectRoute,  getAllUsers )

// todo: get user messages endpoint ->

export default router;