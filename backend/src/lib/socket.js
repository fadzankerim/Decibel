import {Server} from 'socket.io';
import { Message } from '../models/messages.model.js';


export const initializeSocket = (server) => {
    const io = new Server(server,{
        cors:{
            origin:"http://localhost:3000",
            credentials: true,
        }
    });

    // when a user logs in the should get a socketId by default

    const userSockets = new Map(); // {userId : socketId} 
    const userActivities = new Map(); // {userId : [activity1, activity2...]}

    io.on('connection',(socket) => {
        socket.on('user_connected', (userId) => {
            userSockets.set(userId, socket.id);
            userActivities.set(userId, "Idle");

            // broadcast message to all connected sockets(users) that a user has joined 
            io.emit("user_connected", userId);

            //users emit their online status
            socket.emit("users_online", Array.from(userSockets.keys()));
            
            //server emits user activities
            io.emit("activities", Array.from(userActivities.keys()))
        });

        socket.on('update_activity', ({userId, activity}) => {
            console.log("Acivity updated ", userId, activity);
            userActivities.set(userId, activity);
            io.emit("activity_updated", {userId, activity});

        })

        socket.on("send_message", async(data)=>{
            try {
                const {senderId, receiverId, content} = data;

                const message = await Message.create({senderId, receiverId, content});

                // send to receiver in rel time if they are online

                const receiverSocketId = userSockets.get(receiverId);

                if(receiverSocketId){
                    io.to(receiverSocketId).emit("new_message", message);
                }

                socket.emit("message_sent", message);


            } catch (error) {
                console.error("Error sending message: ", error);
                socket.emit("message_error", error.message);
            }
        })

        socket.on("disconnect", () => {
            let disconnectedUserId;

            for(const[userId, socketId] of userSockets.entries()){
                // find the disconnected user

                if(socketId === socket.id){
                    disconnectedUserId = userId;
                    userSockets.delete(userId);
                    userActivities.delete(userId)
                    break;
                }
                                    
            }

            if(disconnectedUserId){
                io.emit("user_disconnected", disconnectedUserId);
            }
        })
    })
}