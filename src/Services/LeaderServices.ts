import { PrismaClient, IsLeaders } from "@prisma/client";
import { AuthenticationError } from "apollo-server-core";

const prisma = new PrismaClient();

type memberByRayonFilter = {
  Member: {
    Family: {
      Rayon: number | null;
    };
  };
};

function createMemberByRayonFilter(rayon: number | null): memberByRayonFilter {
  return {
    Member: {
      Family: {
        Rayon: rayon,
      },
    },
  };
}

export class leaderServices {
  // **

  // create leaders / majelis
  async serviceCreateLeader(data: Omit<IsLeaders, "id">): Promise<IsLeaders> {

    if(data.Members_id){
      const Existingleader = await prisma.isLeaders.findUnique({
        where: { Members_id: data.Members_id },
      })
      if (Existingleader) {
        throw new Error("Leader already exists");
      }
    }


    const leader = await prisma.isLeaders.create({
      data,
    });
    return leader;

    

  }

  // get leaders by id / majelis
  async serviceGetLeaderByID(
    id: string,
    rayon: number | null,
    isSuperUser: Boolean = false
  ): Promise<IsLeaders | null> {
    const leader = await prisma.isLeaders.findUnique({
      where: { id },
      include: {
        Member: {
          select: {
            Family: true,
            FullName: true,
          },
        },
      },
    });

    if (!leader) {
      throw new Error("Leader not found");
    }
    if (isSuperUser || leader.Member?.Family.Rayon === rayon) {
      return leader;
    }
    throw new AuthenticationError("Data you are trying to access is restricted");
  }

  // get leaders / majelis
  async serviceGetLeader(
    rayon: number | null,
    isSuperUser: Boolean = false
  ): Promise<IsLeaders[]> {
    const filter = isSuperUser
      ? {}
      : rayon
      ? createMemberByRayonFilter(rayon)
      : {};
    return await prisma.isLeaders.findMany({
      where: filter,
      include: {
        Schedule: {
          select: {
            Category: true,
            Date: true,
            Day: true,
          }
        },
        Member: {
          select: {
            FullName: true,
            Family: {
              select: {
                Rayon: true,
                
              }
            }
          }
        },
        
      },
    });
  }

  // update leaders / majelis
  async serviceUpdateLeaderByID(
    id: string,
    data: Partial<IsLeaders>
  ): Promise<IsLeaders> {
    const existingLeader = await prisma.isLeaders.findUnique({
      where: { id },
    });
    if (!existingLeader) {
      throw new Error("Leader not found");
    }

    const leader = await prisma.isLeaders.update({
      where: { id },
      data,
    });

    return leader;
  }


  

  // get leaders by search
  async serviceGetLeaderBySearch(
    search: string,
    rayon: number | null,
    isSuperUser: Boolean = false
  ): Promise<IsLeaders[]> {
    let filterZone = {};
    if (!isSuperUser && rayon !== null) {
      filterZone = createMemberByRayonFilter(rayon);
    }
    return await prisma.isLeaders.findMany({
      where: {
        AND: [
          {
            Member: {
              FullName: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          },
          filterZone,
        ],
      },
      include: {
        Schedule: true,
        Member: {
          select: {
            FullName: true,
          },
        },
      },
    });
  }
}
