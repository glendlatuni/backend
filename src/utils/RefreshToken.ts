import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

function generateRefreshToken(userId: string): string {
return jwt.sign({userId}, process.env.JWT_SECRET || "supersecretkey", {
expiresIn: "7d",
})
}


async function saveRefreshToken(userId: string, token: string) {
    const expireAt = new Date();
    expireAt.setDate(expireAt.getDate() + 7);

    await prisma.refreshToken.create({
        data: {
            token,
            userId,
            expiresAt: expireAt,
        }
    })
}


export async function verifyRefreshToken(token: string) {
    const refreshTokenRecord = await prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });
  
    if (!refreshTokenRecord || refreshTokenRecord.expiresAt < new Date()) {
      throw new Error('Invalid or expired refresh token');
    }
  
    try {
      jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  
    return refreshTokenRecord.user;
  }


export {generateRefreshToken, saveRefreshToken}