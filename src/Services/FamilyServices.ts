import { PrismaClient, Family } from "@prisma/client";

const prisma = new PrismaClient();

export class familyServices {
  async servicesCreateFamily(data: Omit<Family, "id">): Promise<Family> {
    return await prisma.family.create({ data });
  }

  async servicesGetFamily(): Promise<Family[]> {
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
  async servicesGetFamilyByID(id: string): Promise<Family | null> {
    return await prisma.family.findUnique({ where: { id } });
  }

  async servicesUpdateFamily(
    id: string,
    data: Partial<Family>
  ): Promise<Family | null> {
    return await prisma.family.update({ where: { id }, data });
  }

  async servicesDeleteFamily(id: string): Promise<Family | null> {
    return await prisma.family.delete({ where: { id } });
  }
}
