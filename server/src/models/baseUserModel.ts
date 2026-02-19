import mongoose from 'mongoose';
import { USER_ROLES, type UserRole } from '../utils/constants.js';


export interface IBaseUser extends mongoose.Document{
    name:string,
    email:string,
    password:string,
    role:UserRole
    lastLogin:Date
}

const baseUserSchema = new mongoose.Schema<IBaseUser>({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:USER_ROLES,
        required:true
    },
    lastLogin:{
        type:Date,
        default:Date.now
    }

},{
    timestamps:true
})

export const BaseUserModel = mongoose.model<IBaseUser>('BaseUser',baseUserSchema)