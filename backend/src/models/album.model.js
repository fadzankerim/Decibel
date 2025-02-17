import mongoose, { mongo } from "mongoose";

const albumSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    artist:{
        type: String,
        required: true
    },
    imageUrl:{
        type: String,
        required: true
    },
    releaseYear:{
        type: Number,
        required: true
    },
    songs:[
        {
            type: mongoose.Schema.Types.ObjectId, // every song is a type of the song model 
            ref: 'Song' 
        }
    ]
}, { timestamps: true });

export const Album = mongoose.model('Album', albumSchema)