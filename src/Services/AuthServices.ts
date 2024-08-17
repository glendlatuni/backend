import { PrismaClient, User } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export class AuthServices {
 

  async register(Email: string, Password: string, Members_Id: string) {
    if (!Email || !Password || !Members_Id) {
      throw new Error("Email, password, and memberId are required");
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

      // Buat user baru
      const newUser = await prisma.user.create({
        data: {
          Email: normalizedEmail,
          Password: hashedPassword,
          Member_id: Members_Id,
        },
        include: {
          Member: true,
        },
      });

      
      const token = jwt.sign({ memberID: newUser.Member_id }, JWT_SECRET, {
        expiresIn: "1d",
      });

      return { user: newUser, token };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

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
      const isPasswordValid = await bcrypt.compare(
        Password,
        user.Password
      );
      if (!isPasswordValid) {
        throw new Error("Invalid email or password");
      }

      // Generate token
      const token = jwt.sign({ memberID: user.Member_id }, JWT_SECRET, {
        expiresIn: "1d",
      });

      return { user, token };
    } catch (error) {
      console.error(error);
      throw error;
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
