import { PrismaClient, Family, } from "@prisma/client";

const prisma = new PrismaClient();

type familyByZoneFilter = {
  FamilyMembers: {
    some: {
      Zones: number | null;
    };
    }
}

function createFamilyByZoneFilter(zones: number | null): familyByZoneFilter {
  return {
    FamilyMembers: {
      some: {
        Zones: zones,
      },
    },
  };
}


export class familyServices {
  // create family
  async servicesCreateFamily(data: Omit<Family, "id">): Promise<Family> {
    return await prisma.family.create({ data });
  }

  // get family
  async servicesGetFamily(zones:number | null, isSuperUser:Boolean = false): Promise<Family[]> {
    const filter =  isSuperUser ? {} : zones ? createFamilyByZoneFilter(zones) : {};
    return await prisma.family.findMany({
      where: filter,
      include: {
        FamilyMembers: true,
      },
    });
  }

  // get family by ID
  async servicesGetFamilyByID(id: string, zones:number | null, isSuperUser:Boolean = false): Promise<Family | null> {
    const family = await prisma.family.findUnique({
      where: { id },
      include: {
        FamilyMembers: true,
      },
    });
    if(!family) {
      throw new Error("Family not found");
    }

    const zonaNyaman = zones ? createFamilyByZoneFilter(zones) : {}


 

    if(isSuperUser || zonaNyaman ) {
      return family;
    }
    return null;

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
