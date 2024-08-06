import { AuthenticationError } from "apollo-server-core";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const isAdmin = async (user: any) => {
    if (!user) {
        console.log(user)
      throw new AuthenticationError("Not authenticated");
    }
  
    const member = await prisma.members.findUnique({
      where: { id: user.id },
      include: {
        IsLeaders: true,
      },
    });
  
    if (!member) {
        console.log(member)
      throw new AuthenticationError("Member Not Found");
    }
  
    if (member.Admin || member.IsLeaders?.Admin) {
      return true;
    }
  
    throw new AuthenticationError("Kayaknya ko bukan admin");
  };
  