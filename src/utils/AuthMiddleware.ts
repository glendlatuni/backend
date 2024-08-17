import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();


interface JwtPayload {
    memberID: string;
  }
 const  authMiddleware =  async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    const token = req.headers.authorization?.split(' ')[1] || "";



 if(!token){
    (req as any).user = null;
    return next(); // Tidak memblokir akses jika token tidak ada
 }

 try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey') as JwtPayload;
    const user = await prisma.members.findUnique({
        where: {
            id: decoded.memberID
        },
        select:{
            id : true,
            Admin: true,
            Zones : true,
            FullName: true,
            IsLeaders: true


        }
    })

    if(!user){
        return res.status(401).json({
            success: false,
            message: "You are not authorized to access this resource",
           });
    }

    (req as any).user = user;
    next();
 } catch (error) {
    res.status(401).json({
        success: false,
        message: "Invalid token",
    })
 }
};

 const checkAdmin =  (req: Request, res: Response, next: NextFunction) => {
     const {user} = req as any;
if(user?.Member?.Admin || user?.Member?.IsLeaders?.Admin){
    next();
}else{
    res.status(401).json({
        success: false,
        message: "Bukan admin kntl",
    })
}
}

export {authMiddleware, checkAdmin}