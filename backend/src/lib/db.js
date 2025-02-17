import mongoose from "mongoose"


export const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URL)
        console.log(`Connected to mongoDB using ${conn.connection.host}`);
    }catch(err){
        console.log('error: ', err.message());
        process.exit(1) //1 is failure 0 is success
    }
}

