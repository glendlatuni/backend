import { PrismaClient, User } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
// import twilio from "twilio";

// const accountSid = process.env.TWILIO_ACCOUNT_SID || "";
// const authToken = process.env.TWILIO_AUTH_TOKEN || "";
// const client = twilio(accountSid, authToken);

import {
  generateRefreshToken,
  saveRefreshToken,
  verifyRefreshToken,
} from "../utils/RefreshToken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
const prisma = new PrismaClient();

export class AuthServices {
  async register(
    Email: string,
    Password: string,
    Members_Id: string,
    PhoneNumber: string
  ) {
    console.log(Email, Password, Members_Id, PhoneNumber);
    if (!Email || !Password || !Members_Id || !PhoneNumber) {
      console.log(Email, Password, Members_Id, PhoneNumber);
      throw new Error("Email, password, and memberId are required");
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email)) {
      throw new Error("Invalid email format");
    }

    // Validasi password (misalnya: minimal 8 karakter)
    if (Password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }

    // normalisasi email menjadi lowerCase
    const normalizedEmail = Email.toLowerCase().trim();

    try {
      // Cek apakah email sudah terdaftar
      const existingUser = await prisma.user.findUnique({
        where: {
          Email: normalizedEmail,
        },
      });
      if (existingUser) {
        throw new Error("Email already registered");
      }

      // Cek apakah Member dengan ID yang diberikan ada
      const member = await prisma.members.findUnique({
        where: { id: Members_Id },
      });
      if (!member) {
        throw new Error("Member not found");
      }

      // // Hash password
      const hashedPassword = await bcrypt.hash(Password, 10);
      const verificationCode = Math.floor(
        1000 + Math.random() * 9000
      ).toString();

      const expireAt = new Date(Date.now() + 5 * 60 * 1000);

      // Buat user baru
      const newUser = await prisma.user.create({
        data: {
          Email: normalizedEmail,
          Password: hashedPassword,
          Member_id: Members_Id,
          PhoneNumber: PhoneNumber,
          phoneVerificationCodeExpiresAt: expireAt,
          phoneVerificationCode: verificationCode,
        },
        include: {
          Member: true,
        },
      });

      // const formattedPhoneNumber = `+62${PhoneNumber.slice(1)}`;


      // client.messages
      //   .create({
      //     body: `Your verification code is: ${verificationCode}`,
      //     from: "+19546370694", // Ganti dengan nomor Twilio-mu
      //     to: formattedPhoneNumber,
      //   })
      //   .then((message) => console.log(message.sid))
      //   .catch((error) => console.error(error));

      const token = jwt.sign({ memberID: newUser.Member_id }, JWT_SECRET, {
        expiresIn: "15m",
      });

      const refreshToken = generateRefreshToken(newUser.id);

      await saveRefreshToken(newUser.id, refreshToken);

      return { user: newUser, token, refreshToken };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // async verifyCode(userId: string, verificationId: string, verificationCode: string) {
  //   const user = await prisma.user.findUnique({
  //     where: { id: userId },
  //   });

  //   if (!user) {
  //     throw new Error("User not found");
  //   }

  //   try {
  //     const credential = phoneAuthProvider(verificationId, verificationCode);
  //     const userCredential = await adminAuth.signInWithCredential(credential);

  //     if (userCredential.user.uid !== user.firebaseUid) {
  //       throw new Error("Invalid verification");
  //     }

  //     const updatedUser = await prisma.user.update({
  //       where: { id: userId },
  //       data: {

  //         verifyStatus: true,
  //         phoneVerificationCode: null,
  //         phoneVerificationCodeExpiresAt: null,
  //       },
  //       include: {
  //         Member: true,
  //       },
  //     });

  //     const token = jwt.sign({ memberID: updatedUser.Member_id }, JWT_SECRET, {
  //       expiresIn: "15m",
  //     });

  //     const refreshToken = generateRefreshToken(updatedUser.id);
  //     await saveRefreshToken(updatedUser.id, refreshToken);

  //     return { user: updatedUser, token, refreshToken };
  //   } catch (error) {
  //     console.error("Firebase phone verification failed:", error);
  //     throw new Error("Phone verification failed");
  //   }
  // }

  async login(Email: string, Password: string) {
    // normalisasi email menjadi lowerCase
    const normalizedEmail = Email.toLowerCase().trim();

    if (!normalizedEmail || !Password) {
      throw new Error("Email and password are required");
    }

    try {
      // Cari user berdasarkan email
      const user = await prisma.user.findUnique({
        where: { Email: normalizedEmail },
        include: { Member: true },
      });

      if (!user) {
        throw new Error("Invalid email or password");
      }

      // Verifikasi password
      const isPasswordValid = await bcrypt.compare(Password, user.Password);
      if (!isPasswordValid) {
        throw new Error("Invalid email or password");
      }

      // Generate token
      const token = jwt.sign({ memberID: user.Member_id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      const refreshToken = generateRefreshToken(user.id);
      await saveRefreshToken(user.id, refreshToken);

      console.log("Login Success:", user.Member);
      console.log("Token:", token);
      

      return { user, token, refreshToken };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async logout(userId: string) {
    try {
      await prisma.refreshToken.deleteMany({
        where: {
          userId: userId,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const user = await verifyRefreshToken(refreshToken);
      const newAccessToken = jwt.sign(
        { memberID: user?.Member_id },
        JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );
      console.log("New access token generated:", newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error("Error refreshing access token:", error)
      throw new Error("Invalid refresh token");
    }
  }

  async getUserId(id: string): Promise<User | null> {
    try {
      console.log(`Searching for user with id: ${id}`);
      const findUser = await prisma.user.findUnique({ where: { id } });
      console.log(`Found user:`, findUser);
      return findUser;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
