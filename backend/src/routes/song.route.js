import { Router } from "express";
import { getSongById, getAllSongs, getFeaturedSongs, getMadeForYou, getTrendingSongs } from "../controller/song.controller.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();



// Only admins can get all songs    
router.get('/', protectRoute, requireAdmin, getAllSongs);

// get to a song by its id endpoint with user authentication
router.get('/songs/:songId',protectRoute, getSongById);

// get featured songs endpoint
router.get('/featured',  getFeaturedSongs);
router.get('/made-for-you',  getMadeForYou);
router.get('/trending',  getTrendingSongs);



export default router;