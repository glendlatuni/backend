import { PrismaClient, Family, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

type familyByRayonFilter = {
  Rayon?: {
    rayonNumber: number | null;
  };
};

function createFamilyByRayonFilter(rayon: number | null): familyByRayonFilter {
  return rayon !== null
    ? {
        Rayon: {
          rayonNumber: rayon,
        },
      }
    : {};
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
    let filter: Prisma.FamilyWhereInput = {};

    if (!isSuperUser && rayon !== null) {
      filter = {
        Rayon: {
          rayonNumber: rayon,
        },
      };
    }

    return await prisma.family.findMany({
      where: filter,

      include: {
        Rayon: {
          select: {
            id: true,
            rayonNumber: true,
            church: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        KSP: {
          select: {
            id: true,
            kspname: true,
          },
        },
        FamilyMembers: {
          select: {
            id: true,
            FullName: true,
            Category: true,
            Gender: true,
            IsLeaders: true,
            BirthPlace: true,
            BirthDate: true,
          },
        },
      },
    });
  }

  async serviceGetFamilyPagination(
    rayon: number | null,
    isSuperUser: Boolean = false,
    page: number = 1,
    pageSize: number = 10
  ): Promise<{ data: Family[]; totalCount: number; totalPages: number }> {
    let filter: Prisma.FamilyWhereInput = {};

    if (!isSuperUser && rayon !== null) {
      filter = {
        Rayon: {
          rayonNumber: rayon,
        },
      };
    }
    const skip = (page - 1) * pageSize;

    const [data, totalCount] = await Promise.all([
      prisma.family.findMany({
        where: filter,
        include: {
          FamilyMembers: {
            select: {
              id: true,
              FullName: true,
              Category: true,
              Gender: true,
              IsLeaders: true,
              BirthPlace: true,
              BirthDate: true,
            },
          },
        },
        skip: skip,
        take: pageSize,
      }),
      prisma.family.count({ where: filter }),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return { data, totalCount, totalPages };
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
        FamilyMembers:true,
        Rayon: {
          select: {
            id: true,
            rayonNumber: true,
          },
        },
      },
    });
    if (!family) {
      throw new Error("Family not found");
    }
    if (isSuperUser ? {} : family.Rayon.rayonNumber === rayon) {
      return family;
    }
    return null;
  }

  async getCurrentFamilyUser(userId: string): Promise<Family | null> {
    return await prisma.family.findFirst({
      where: {
        FamilyMembers: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        KSP: true,
        Rayon: true,
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

  // update family
  async servicesUpdateFamily(
    id: string,
    rayon: number | null,
    isSuperUser: Boolean = false,
    data: Partial<Family>
  ): Promise<Family | null> {
    const family = await prisma.family.findUnique({
      where: { id },
      include: {
        Rayon: {
          select: {
            rayonNumber: true,
          },
        },
      },
    });

    if (!family) {
      throw new Error("Family not found");
    }
    if (!isSuperUser && family.Rayon.rayonNumber !== rayon) {
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
    let filterZone: Prisma.FamilyWhereInput = {};

    if (!isSuperUser && rayon !== null) {
      filterZone = {
        Rayon: {
          rayonNumber: rayon,
        },
      };
    }
    return await prisma.family.findMany({
      where: {
        AND: [
          {
            KSP: {
              kspname: {
                contains: search,
                mode: "insensitive",
              },
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
