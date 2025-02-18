import { Song } from '../models/song.model.js'
import { Album } from '../models/album.model.js'
import { firebaseApp, storage } from '../lib/firebase.js'
import { v4 as uuidv4 } from 'uuid'

//helper function for firebase uploads
const uploadToFirebase = async (file) => {
    try {
        const fileExtension = file.name.split('.').pop();
        const uniqueFilename = `${uuidv4()}.${fileExtension}`; // Use uuid for unique names
        const fileRef = storage.ref().child(uniqueFilename); // Reference to the file location in Firebase Storage

        const metadata = {
            contentType: file.mimetype, // Set the correct content type (crucial!)
        };

        // Use putFile for uploading from a local file path (tempFilePath)
        const snapshot = await fileRef.putFile(file.tempFilePath, metadata);
        const downloadURL = await snapshot.ref.getDownloadURL(); // Get the download URL

        return downloadURL;
    } catch (error) {
        console.error("Error uploading to Firebase:", error);
        throw error; // Re-throw the error for proper handling
    }
}



export const createSong = async (req, res, next) => {
    try{
        if(!req.files || !req.files.audioFile || !req.files.imageFile){
            return res.status(400).json({ success: false, message: "No file uploaded" })
        }

        const {title, artist, albumId, duration} = req.body;
        const audioFile = req.files.audioFile
        const imageFile = req.files.imageFile


        const audioUrl = await uploadToFirebase(audioFile);
        const imageUrl = await uploadToFirebase(imageFile);

        const song = new Song({
            title,
            artist,
            audioUrl,
            imageUrl,
            duration,
            albumId: albumId || null
        })

        await song.save();

        // if song belongs to an album, update the albums songs array 
        if(albumId){
            await Album.findByIdAndUpdate(albumId, {
                $push:{songs: song._id}
            })
        }
        

        res.status(201).json(song)
    }catch(error){
        console.log("Error in createSong: ",error);
        next(error)
    }
}


export const deleteSong = async (req,res,next) =>{
    try{
        const { id } = req.params
        const song = await Song.findById(id)

        // if song belongs to an album delete the song from the album (songs array)
        if(song.albumId){
            await Album.findByIdAndUpdate(song.albumId,{
                $pull: { songs: song._id},
            })
        }

        await Song.findByIdAndDelete(id);

        res.status(200).json({ message: "Song successfully deleted!" })

    }catch(error){
        next(error)
    }
}


export const createAlbum = async (req,res,next) => {
    try{
        const { title, artist, releaseYear } = req.body;

        const { imageFile } = req.files;

        const imageUrl = await uploadToFirebase(imageFile);

        const album = new Album({
            title,
            artist,
            imageUrl,
            releaseYear
        });

        await album.save();

        res.status(200).json(album)

    }catch(error){
        console.log("Error in createAlbum", error);
        next(error)
    }

}

export const deleteAlbum = async (req,res,next) => {
    try{

        const { id } = req.params
        
        await Song.deleteMany({ albumId : id});
        await Album.findByIdAndDelete(id);

        res.status(200).json({message: "Album deleted successfully"})

    }catch(error){
        console.log("Error in deleteAlbum ", error);
        next(error)
    }


}

export const checkAdmin = async (req,res,next) => {
    res.status(200).json({admin: true})
}