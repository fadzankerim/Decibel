import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
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
    audioUrl:{
        type:String,
        required: true
    },
    duration:{
        type: Number,
        required: true
    },
    albumId:{
        type: mongoose.Schema.Types.ObjectId, //from album model 
        ref: "Album",
        required: false
    }

}, { timestamps: true }); //created at , updated at 

export const Song = mongoose.model('Song', songSchema);

