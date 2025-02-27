import { Song } from '../models/song.model.js'
import { Album } from '../models/album.model.js'
import { firebaseApp, storage, ref, getDownloadURL, uploadBytes } from '../lib/firebase.js'
import { v4 as uuidv4 } from 'uuid'
import * as fs from 'fs'

//helper function for firebase uploads
const readFile = async (filePath) => {
  try {
    const fileData = await fs.promises.readFile(filePath);
    return fileData;
  } catch (error) {
    console.error(`Error reading file: ${error}`);
    throw error;
  }
};

const uploadToFirebase = async (file, path) => {
  try {
    const fileExtension = file.name.split('.').pop();
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;
    const fileRef = ref(storage, `${path}/${uniqueFilename}`);

    const metadata = {
      contentType: file.mimetype,
    };

    const fileData = await readFile(file.tempFilePath);
    const snapshot = await uploadBytes(fileRef, fileData, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error(`Error uploading file: ${error}`);
    throw error;
  }
};


export const createSong = async (req, res, next) => {
    try{
        if(!req.files || !req.files.audioFile || !req.files.imageFile){
            return res.status(400).json({ success: false, message: "No file uploaded" })
        }

        const {title, artist, albumId, duration} = req.body;
        const audioFile = req.files.audioFile
        const imageFile = req.files.imageFile

        console.log("Audio file: ", audioFile);
        console.log("Image FIle: ", imageFile);

        const audioUrl = await uploadToFirebase(audioFile, "songs");
        const imageUrl = await uploadToFirebase(imageFile, "images");

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