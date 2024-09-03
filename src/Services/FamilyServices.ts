import { PrismaClient, Family } from "@prisma/client";

const prisma = new PrismaClient();

type familyByRayonFilter = {
  Rayon: number | null;
};

function createFamilyByRayonFilter(rayon: number | null): familyByRayonFilter {
  return {
    Rayon: rayon,
  };
}

export class familyServices {
  // create family
  async servicesCreateFamily(data: Omit<Family, "id">): Promise<Family> {
    return await prisma.family.create({ data });
  }

  // get family
  async servicesGetFamily(
    rayon: number | null,
    isSuperUser: Boolean = false
  ): Promise<Family[]> {
    const filter = isSuperUser ? {} : { Rayon: rayon };

    return await prisma.family.findMany({
      where: filter,
      include: {
        FamilyMembers: {
          select: {
            id: true,
            FullName: true,
            Category: true,
            Gender: true,
            IsLeaders: true,
      
          },
        },
      },
    });
  }

  // get family by ID
  async servicesGetFamilyByID(
    id: string,
    rayon: number | null,
    isSuperUser: Boolean = false
  ): Promise<Family | null> {
    const family = await prisma.family.findUnique({
      where: { id },
      include: {
        FamilyMembers: true,
      },
    });
    if (!family) {
      throw new Error("Family not found");
    }
    if (isSuperUser ? {} : family.Rayon === rayon) {
      return family;
    }
    return null;
  }

  // update family
  async servicesUpdateFamily(
    id: string,
    rayon: number | null,
    isSuperUser: Boolean = false,
    data: Partial<Family>
  ): Promise<Family | null> {
    const family = await prisma.family.findUnique({
      where: { id },
    });

    if (!family) {
      throw new Error("Family not found");
    }
    if (!isSuperUser && family.Rayon !== rayon) {
      throw new Error("You can not perform this update");
    }

    return await prisma.family.update({ where: { id }, data });
  }


  // get family by name
  async servicesGetFamilyBySearch(
    search: string,
    rayon: number | null,
    isSuperUser: Boolean = false
  ): Promise<Family[]> {
    let filterZone = {};
    if (!isSuperUser && rayon !== null) {
      filterZone = createFamilyByRayonFilter(rayon);
    }
    return await prisma.family.findMany({
      where: {
        AND: [
          {
            FamilyName: {
              contains: search,
              mode: "insensitive",
            },
          },
          filterZone,
        ],
      },

      include: {
        FamilyMembers: {

          select: {
            
            FullName: true,
    
          },
        },
      },
    });
  }

  // get family by KSP
  async servicesGetFamilyByKSP(
    search: string,
    rayon: number,
    isSuperUser: Boolean = false
  ): Promise<Family[]> {
    const filterZone = isSuperUser
      ? {}
      : rayon
      ? createFamilyByRayonFilter(rayon)
      : {};
    return await prisma.family.findMany({
      where: {
        AND: [
          {
            KSP: {
              contains: search,
              mode: "insensitive",
            },
          },
          filterZone,
        ],
      },
      include: {
        FamilyMembers: {
          select: {
            FullName: true,
          },
        },
      },
    });
  }

  async avoidDuplicateFamily(familyName: string): Promise<Family | null> {
    return await prisma.family.findFirst({ where: { FamilyName: familyName } });
  }
}
