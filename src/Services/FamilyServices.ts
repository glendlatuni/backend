import { PrismaClient, Family } from "@prisma/client";

const prisma = new PrismaClient();

export class familyServices {
  // create family
  async servicesCreateFamily(data: Omit<Family, "id">): Promise<Family> {
    return await prisma.family.create({ data });
  }

  // get family
  async servicesGetFamily(): Promise<Family[]> {
    return await prisma.family.findMany({
      include: {
        FamilyMembers: true,
      },
    });
  }

  // get family by ID
  async servicesGetFamilyByID(id: string): Promise<Family | null> {
    return await prisma.family.findUnique({
      where: { id },
      include: {
        FamilyMembers: true,
      },
    });
  }

  // update family
  async servicesUpdateFamily(
    id: string,
    data: Partial<Family>
  ): Promise<Family | null> {
    return await prisma.family.update({ where: { id }, data });
  }

  // delete family
  async servicesDeleteFamily(id: string): Promise<Family | null> {
    return await prisma.family.delete({ where: { id } });
  }

  // get family by name
  async servicesGetFamilyBySearch(search: string): Promise<Family[]> {
    return await prisma.family.findMany({
      where: {
        FamilyName: {
          contains: search,
          mode: "insensitive",
        },
      },
      include: {
        FamilyMembers: true,
      },
    });
  }


// get family by KSP
  async servicesGetFamilyByKSP(search: string): Promise<Family[]> {
    return await prisma.family.findMany({
      where: {
        FamilyMembers: {
          some: {
            KSP: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      },
      include: {
        FamilyMembers: true,
      },
    });
  }
}
