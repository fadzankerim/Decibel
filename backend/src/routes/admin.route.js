import { Router } from 'express'
import { createSong , deleteSong, createAlbum, deleteAlbum, checkAdmin } from '../controller/admin.controller.js';
import { protectRoute, requireAdmin } from '../middleware/auth.middleware.js';


const router = Router();

// Auth middleware implementation, every route gets a protective layer
router.use(protectRoute, requireAdmin);


// checking if the user is admin endpoint
router.get('/check', checkAdmin);


//  handle songs endpoints
router.post('/songs', createSong);
router.delete('/songs/:id', deleteSong);


// handle albums endpoint
router.post('/albums', createAlbum);
router.delete('/albums/:id', deleteAlbum);


export default router;