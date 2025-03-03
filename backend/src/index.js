import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js'
import { clerkMiddleware } from '@clerk/express'
import fileUpload from 'express-fileupload'
import path from 'path'
import cors from 'cors';
import cron from 'node-cron'
import fs from 'fs'


import userRoutes from './routes/user.route.js'
import adminRoutes from './routes/admin.route.js'
import authRoutes from './routes/auth.route.js'
import songRoutes from './routes/song.route.js'
import albumRoutes from './routes/album.route.js'
import statRoutes from './routes/stat.route.js'
import { createServer } from 'http';
import { initializeSocket } from './lib/socket.js';



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;

const __dirname = path.resolve();


const httpServer = createServer(app);
initializeSocket(httpServer);

app.use(cors({
    origin:'*',
    credentials: true
}));

app.use(express.json());  // to parse the json data in req.body
app.use(clerkMiddleware());  // this will add auth to req object => req.auth.userId

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, 'tmp'),
    createParentPath: true,
    limits:{
        fileSize: 10 * 1024 * 1024  //10 MB max file size 
    },
}))

//cron jobs
// delete temp files in every 1 hour 

const tempdir = path.join(process.cwd(), 'tmp');

cron.schedule("0 * * * *", () => {
    if(fs.existsSync(tempdir)){
        fs.readdir(tempdir, (err, files) => {
            if(err){
                console.log(err);
                return;
            }
            for(const file of files){
                fs.unlink(path.join(tempdir, file), (err) => {
                    
                })
            }
        })
    }
})



app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/stats', statRoutes);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    app.use("*", (req,res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
    })
}    


// error handler

app.use((err,req,res,next)=>{
    res.status(500).json({message: process.env.NODE_ENV === "production"? "Internal server error" : err.message})
})



httpServer.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})


