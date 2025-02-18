import { clerkClient } from "@clerk/express";


// checking if the user is logged in by checking the registered users auth id
export const protectRoute =  async (req,res,next) => { 

    if(!req.auth.userId){
        return res.status(401).json({ message: "Unauthorized- you must be logged in!" });
    }

    next();
};


// checking if a user is admin by email address
export const requireAdmin = async(req,res,next) =>{

    try{
        const currentUser = await clerkClient.users.getUser(req.auth.userId);
        const isAdmin = process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress.emailAddress;

        if(!isAdmin){
            return res.status(403).json({message: "Unauthorized - aces denied"})
        }

        next();
    }catch(error){
        return res.status(500).json({ message: "Internal server error",error })
    }
}