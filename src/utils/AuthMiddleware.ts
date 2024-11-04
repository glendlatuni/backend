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

// const authMiddleware = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const authHeader = req.headers.authorization;
//     const token = authHeader?.split(" ")[1];
//     const refreshToken = req.headers["x-refresh-token"] as string;

//     // console.log("Auth Header:", authHeader);
//     // console.log("Token:", token);

//     if (!authHeader || !token) {

//       throw new Error('Authentication required');
//       // // console.log("Token not found");
//       // (req as any).user = null;
//       // return next();
//     }

//     // Verifikasi token
//     let decoded: JwtPayload;
//     try {
//       decoded = jwt.verify(
//         token,
//         process.env.JWT_SECRET || "supersecretkey"
//       ) as JwtPayload;

//       // console.log("Decoded token:", decoded);
//     } catch (jwtError) {
//       // console.log("JWT Verification Error:", jwtError);

//       if (jwtError instanceof jwt.TokenExpiredError && refreshToken) {
//         try {
//           const { user, newAccessToken } = await refreshAccessToken(refreshToken);
//           if (req.res) {
//             req.res.setHeader("X-New-Access-Token", newAccessToken);
//           }
//           (req as any).user = user;
//           return next();
//         } catch (refreshError) {
//           console.log("Refresh Token Error:", refreshError);
//           return res.status(401).json({
//             success: false,
//             message: "Invalid refresh token"
//           });
//         }
//       }

//       return res.status(401).json({
//         success: false,
//         message: "Invalid token"
//       });
//     }

//     // Jika token valid, cari user
//     const user = await prisma.members.findUnique({
//       where: {
//         id: decoded.memberID,
//       },
//       select: {
//         id: true,
//         Role: true,
//         FullName: true,
//         User: {
//           select: {
//             verifyStatus: true,
//           },
//         },
//         Liturgos: true,
//         IsLeaders: true,
//         Family: {
//           select: {
//             id: true,
//             FamilyName: true,
//             Rayon: {
//               select: {
//                 rayonNumber: true,
//               }
//             },
//             KSP: {
//               select: {
//                 kspname: true,
//               }
//             }
//           }
//         }
//       },
//     });

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "User not found"
//       });
//     }

//     (req as any).user = user;
//     return next();

//   } catch (error) {
//     console.log("General Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error"
//     });
//   }
// };

const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    const refreshToken = req.headers["x-refresh-token"] as string;

    if (!authHeader || !token) {
      throw new Error("Authentication required");
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "supersecretkey"
      ) as JwtPayload;

      if (decoded) {
        const user = await prisma.members.findUnique({
          where: { id: decoded.memberID },
          select: {
            id: true,
            Role: true,
            FullName: true,
            Schedule: true,
            User: {
              select: {
                verifyStatus: true,
              },
            },
            Liturgos: true,
            IsLeaders: true,
            Family: {
              select: {
                id: true,
                FamilyName: true,
                Rayon: {
                  select: {
                    rayonNumber: true,
                  },
                },
                KSP: {
                  select: {
                    kspname: true,
                  },
                },
              },
            },
          },
        });

        if (!user) {
          throw new Error("User not found");
        }

        (req as any).user = user;
        return next();
      }
    } catch (jwtError) {
      if (jwtError instanceof jwt.TokenExpiredError && refreshToken) {
        try {
          const { user, newAccessToken } = await refreshAccessToken(
            refreshToken
          );
          if (req.res) {
            req.res.setHeader("X-New-Access-Token", newAccessToken);
          }
          (req as any).user = user;
          return next();
        } catch (refreshError) {
          throw new Error("Invalid refresh token");
        }
      }
      throw new Error("Invalid token");
    }
  } catch (error) {
    // Instead of returning HTTP response, attach error to request
    (req as any).authError = error;
    next();
  }
};

export { authMiddleware };
