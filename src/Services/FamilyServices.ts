import { PrismaClient, Family } from "@prisma/client";

const prisma = new PrismaClient();

export class familyServices {
  async createKeluarga(data: Omit<Family, "id">): Promise<Family> {
    return await prisma.family.create({ data });
  }

  async getKeluarga(): Promise<Family[]> {
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
  async getKeluargaById(id: string): Promise<Family | null> {
    return await prisma.family.findUnique({ where: { id } });
  }

  async updateKeluarga(
    id: string,
    data: Partial<Family>
  ): Promise<Family | null> {
    return await prisma.family.update({ where: { id }, data });
  }

  async deleteKeluarga(id: string): Promise<Family | null> {
    return await prisma.family.delete({ where: { id } });
  }
}
