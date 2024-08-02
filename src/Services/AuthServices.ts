import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "898&*(82*()*&!&@(__)#(hsJJjsksosojoccmko(893029830948";

export class AuthServices {
  constructor(private bcrypt: any, private jwt: any) {}

  async register(Email: string, Password: string, Members_Id: string) {
    if (!Email || !Password || !Members_Id) {
      throw new Error("Email, password, and memberId are required");
    }

    // normalisasi email menjadi lowerCase
    const normalizedEmail = Email.toLowerCase().trim();

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
    const hashedPassword = await this.bcrypt.hash(Password, 10);

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

    // Generate token
    const token = this.jwt.sign({ userId: newUser.id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    return { user: newUser, token };
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
      const isPasswordValid = await this.bcrypt.compare(
        Password,
        user.Password
      );
      if (!isPasswordValid) {
        throw new Error("Invalid email or password");
      }

      // Generate token
      const token = this.jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "1d",
      });

      return { user, token };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
