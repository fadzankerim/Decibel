import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId:{
        type: String,   // -Clerk user id- !
        required: true
    },
    receiverId:{
        type: String,
        required : true // -Clerk user id- !
    },
    content:{
        type: String,   // getting content of the message 
        required: true
    }
}, { timestamps : true })

export const Message = mongoose.model('Message', messageSchema);