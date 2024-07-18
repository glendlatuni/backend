import { PrismaClient, Family } from "@prisma/client";

const prisma = new PrismaClient();

export class familyServices {
  async createFamily(data: Omit<Family, "id">): Promise<Family> {
    return await prisma.family.create({ data });
  }

  async getFamily(): Promise<Family[]> {
    return await prisma.family.findMany({
      include: {
        FamilyMembers: {
          include: {
            Family: true,
          },
        },
      },
    });
  }
  async getFamilyByID(id: string): Promise<Family | null> {
    return await prisma.family.findUnique({ where: { id } });
  }

  async updateFamily(
    id: string,
    data: Partial<Family>
  ): Promise<Family | null> {
    return await prisma.family.update({ where: { id }, data });
  }

  async deleteFamily(id: string): Promise<Family | null> {
    return await prisma.family.delete({ where: { id } });
  }
}
