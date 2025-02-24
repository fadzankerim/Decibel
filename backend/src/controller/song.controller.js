import { Song } from '../models/song.model.js'

export const getSongById = async (req,res,next) =>{
    try{
        const { songId } = req.params;
        const song = await Song.findById(songId);

        if(!song){
            return res.status(404).json({ message: "Song not found" });
        }

        res.status(200).json(song)

    }catch(error){
        next(error)
    }
}

export const getAllSongs = async (req,res,next) =>{
    try{
        // getting all songs in a sorted matter where -1 is from newest to oldest
        const songs = await Song.find().sort({createdAt: -1});
        res.status(200).json(songs);

    }catch(error){
        next(error)
    }    
}

export const getFeaturedSongs = async (req,res,next) =>{
    try{
        // fetching 6 random songs using mongoDB aggregation pipeline
        const songs = await Song.aggregate([
            {
                $sample:{ size: 6 }
            },
            {
                $project:{ _id: 1, title: 1, artist: 1, imageUrl: 1, audioUrl: 1 }
            }
        ]);

        res.status(200).json(songs);
    }catch(error){
        next(error);
    }
}

export const getMadeForYou = async (req,res,next) =>{
    try{
        // fetching 4 random songs using mongoDB aggregation pipeline
        const songs = await Song.aggregate([
            {
                $sample:{ size: 4 }
            },
            {
                $project:{ _id: 1, title: 1, artist: 1, imageUrl: 1, audioUrl: 1 }
            }
        ]);
        
        res.status(200).json(songs);
    }catch(error){
        next(error);
    }
}

export const getTrendingSongs = async (req,res,next) =>{
    try{
        // fetching 4 random songs using mongoDB aggregation pipeline
        const songs = await Song.aggregate([
            {
                $sample:{ size: 4 }
            },
            {
                $project:{ _id: 1, title: 1, artist: 1, imageUrl: 1, audioUrl: 1 }
            }
        ]);
        
        res.status(200).json(songs);
    }catch(error){
        next(error);
    }
}