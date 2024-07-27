import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class countService {
  // counting members

  async getMemberCount(): Promise<number> {
    return await prisma.members.count();
  }

  // counting family
  async getFamilyCount(): Promise<number> {
    return await prisma.family.count();
  }
}
