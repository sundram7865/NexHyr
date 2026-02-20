import jwt,{ type JwtPayload } from "jsonwebtoken";

import type{ Request, Response, NextFunction } from "express";

interface CustomJwtPayload extends JwtPayload {
  userId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}


export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const token = authHeader.split(" ")[1];
    if(!token){
      return res.status(401).json({message:"Token not provided"})
    }
    const secretKey = process.env.JWT_SECRET as string;
    if(!secretKey){
      return res.status(500).json({message:"JWT Secret key not configured"})
    }
    const decoded = jwt.verify(
      token,
      secretKey
    ) as CustomJwtPayload;

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// AUTHORIZATION
export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied. Role not allowed.",
      });
    }

    next();
  };
};
