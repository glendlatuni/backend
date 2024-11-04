import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { GraphQLError } from "graphql/error";


const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

function generateRefreshToken(userId: string): string {
return jwt.sign({userId}, JWT_SECRET, {
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

  console.log("SAYA MENCARI TOKEN", token);
  
  

    const refreshTokenRecord = await prisma.refreshToken.findUnique({
      where: { token  },
      include: { user: true },
    });

    console.log("Mendapat refresh token",refreshTokenRecord?.token);
  
    if (!refreshTokenRecord || refreshTokenRecord.expiresAt < new Date()) {
      console.error("Invalid or expired refresh token");
      throw new GraphQLError('expired refresh token', {
        extensions: {
          code: 'EXPIRED_REFRESH_TOKEN'
        }
      });
    }
  
    try {
      jwt.verify(token, JWT_SECRET);
    } catch (error) {
      console.error("JWT verification failed:", error);
      throw new GraphQLError('Invalid refresh token', {
        extensions: {
          code: 'INVALID_REFRESH_TOKEN'
        }
      });
    }
  
    return refreshTokenRecord.user;
  }


export {generateRefreshToken, saveRefreshToken}