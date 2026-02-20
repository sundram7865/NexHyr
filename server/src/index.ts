import express from  'express'
import type { Request,Response } from 'express';
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'
import userRouter from './routes/userRoutes.js'
dotenv.config();
connectDB()
const app=express();
const PORT =process.env.PORT || 3000;
app.get('/health',(req:Request,res:Response)=>{
    res.send("api is healthy")
})
app.use(express.json())
app.use('/api/users',userRouter)
app.listen(PORT,()=>{
console.log(`server is running on port ${PORT}`)
})