import type{ Request,Response } from "express";
import mongoose from "mongoose";
import { BaseUserModel } from "../models/baseUserModel.js";
import bcrypt from "bcryptjs";
import { USER_ROLES } from "../utils/constants.js";
import jwt from "jsonwebtoken"
export const createUser = async(req:Request,res:Response)=>{
    try{
    const {name,email,password,role}=req.body ;
        if(!name){
            return res.status(400).json({
                message:"Name is required"
            })
        }
        if(!email){
            return res.status(400).json({
                message:"Email is required"
            })
        }
        if(!password){
            return res.status(400).json({
                message:"Password is required"
            })
        }
        if(!role){
            return res.status(400).json({
                message:"Role is required"
            })
        }
        if(!USER_ROLES.includes(role)){
            return res.status(400).json({
                message:"Invalid Role"
            })
        }
        const isUserexists= await BaseUserModel.findOne({email:email})
        if(isUserexists){
            return res.status(400).json({
                message:"User with this email already exists"
            })
        }
        const hashedPassword=await bcrypt.hash(password,10) as string;
        const newUser = await BaseUserModel.create({
            name:name,
            email:email,
            password:hashedPassword,
            role:role
        })
        await newUser.save();
        res.status(201).json({
            message:"User created Succcessfully",
            newUser
        })
    }catch(error){
        return res.status(500).json({message:"Error in creating user",error})
    }
}

export const loginUser = async(req:Request,res:Response)=>{
    try{
        const {email,password}=req.body;
        if(!email){
            return res.status(400).json({
                message:"Email is Required"
            })
        }
        if(!password){
            return res.status(400).json({
                message:"Password is Required"
            })
        }
        const user= await BaseUserModel.findOne({email:email})
        if(!user){
            return res.status(400).json({
                message:"user doesn't exists"
            })
        }
        const isPasswordMatch = await bcrypt.compare(password,user.password)
        if(!isPasswordMatch){
            return res.status(400).json({
                message:"Invalid Credentials"
            })
        }
        user.lastLogin=new Date();
        await user.save();
        const secretKey = process.env.JWT_SECRET as string;
        if(!secretKey){
            return res.status(400).json({
                message:"JWT secret not provided"
            })
        }
        const token=jwt.sign({
            user
        },secretKey,
        {expiresIn:"1h"}
        )
        if(!token){
            return res.status(500).json({
                message:"Error in generating token"
            })
        }
        res.status(200).json({
            message:"Login Successful",token
        })
    }catch(error){
        return res.status(500).json({message:"Error in login",error})
    }
}