import { PrismaClient } from "@prisma/client";
import { stat } from "fs";

const prisma = new PrismaClient();

type memberByRayonFilter = {
  Family: {
    Rayon: number | null;
  };
};

function createMemberByRayonFilter(rayon: number | null): memberByRayonFilter {
  return {
    Family: {
      Rayon: rayon,
    },
  };
}

export class countService {
  // counting members

  async getMemberCount(): Promise<number> {
    return await prisma.members.count();
  }

  // counting family
  async getFamilyCount(): Promise<number> {
    return await prisma.family.count();
  }

  // counting gender

  async getMemberByGender(
    rayon: number | null,

    isSuperUser: Boolean = false
  ) {
    const filter = isSuperUser
      ? {}
      : rayon
      ? createMemberByRayonFilter(rayon)
      : {};

    const stats = await prisma.members.groupBy({
      where: filter,
      by: ["Gender"],
      _count: {
        id: true,
      },
    });

    return stats.map((stat) => {
      return {
        gender: stat.Gender,
        count: stat._count.id,
      };
    });
  }

  async getMemberByCategory(
    rayon: number | null,

    isSuperUser: Boolean = false
  ){
    const filter = isSuperUser
    ? {}
    : rayon
    ? createMemberByRayonFilter(rayon)
    : {};

    const stats = await prisma.members.groupBy({
      where: filter,
      by: ["Category"],
      _count: {
        id: true,
      },
    });

    return stats.map((stat) => {
      return {
        category: stat.Category,
        count: stat._count.id,
      };
    });


  }
}
