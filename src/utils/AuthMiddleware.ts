import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";


const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
const prisma = new PrismaClient();

interface JwtPayload {
  memberID: string;
}

async function refreshAccessToken(refreshToken: string) {
  try {
    const refreshTokenRecord = await verifyRefreshToken(refreshToken);
    const newAccessToken = jwt.sign(
      { memberID: refreshTokenRecord.user?.Member_id },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    return { user: refreshTokenRecord.user, newAccessToken };
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
}

async function verifyRefreshToken(token: string) {
  const refreshTokenRecord = await prisma.refreshToken.findUnique({
    where: {
      token,
    },
    include: {
      user: true,
    },
  });

  console.log(refreshTokenRecord);

  if (!refreshTokenRecord || refreshTokenRecord.expiresAt < new Date()) {
    throw new Error("Invalid or Expired refresh token");
  }

  return refreshTokenRecord;
}

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1] || "";
  const refreshToken = req.headers["x-refresh-token"] as string;

  if (!token) {
    (req as any).user = null;
    return next(); // Tidak memblokir akses jika token tidak ada
  }




  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "supersecretkey"
    ) as JwtPayload;
    const user = await prisma.members.findUnique({
      where: {
        id: decoded.memberID,
      },
      select: {
        id: true,
        Role: true,
        FullName: true,
        User:{
          select:{
            verifyStatus: true
        }
        },
        Liturgos: true,
        IsLeaders: true,
        Family: {
          select: {
            id: true,
            Rayon: true,
            KSP: true,
          }
        },
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to access this resource",
      });
    }

    (req as any).user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError && refreshToken) {
      console.log("Token expired. Refreshing...");
      
      try {
        const {user, newAccessToken} = await refreshAccessToken(refreshToken);
       

        if (req.res) {
          req.res.setHeader("X-New-Access-Token", newAccessToken);
        }
        return { user, newAccessToken };
      } catch (refreshError) {
        return { user: null, tokenError: "Invalid refresh token" };
      }
    } else {
      return res.status(401).json({
     errors:[
      {
        message : "Authentication token is invalid or expired",
        extensions:{
          code : "Unauthorized"
        }
      }
     ]
      })
    }
  }
};

export { authMiddleware };
