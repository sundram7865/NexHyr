import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
export const connectDB= async ()=>{
    const MONGO_URI=process.env.MONGO_URI as string;
    try{
        await mongoose.connect(MONGO_URI)
        console.log("Connected to MongoDB")
    }catch(error){
       console.log("Eror in connecting to db",error)
    }
}