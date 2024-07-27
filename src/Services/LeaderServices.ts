import { PrismaClient, IsLeaders } from "@prisma/client";

const prisma = new PrismaClient();

export class leaderServices {
  // **

  // create leaders / majelis
  async serviceCreateLeader(
    data: Omit<IsLeaders, "id">
  ): Promise<IsLeaders> {

    return await prisma.isLeaders.create({ data });
  }

  // get leaders by id / majelis
  async serviceGetLeaderByID(id: string): Promise<IsLeaders | null> {
    return await prisma.isLeaders.findUnique({
      where: { id },
      include: {
        Member: true,
      },
    });
  }

  // get leaders / majelis
  async serviceGetLeader(): Promise<IsLeaders[]> {
    return await prisma.isLeaders.findMany({
      include: {
        Schedule: true,
      },
    });
  }

  // update leaders / majelis
  async serviceUpdateLeaderByID(
    id: string,
    data: Partial<IsLeaders>
  ): Promise<IsLeaders> {
    return await prisma.isLeaders.update({
      where: { id },
      data,
    });
  }

  // delete leaders
  async serviceDeleteLeaderByID(id: string): Promise<IsLeaders | null> {
    return await prisma.isLeaders.delete({
      where: { id },
    });
  }

  // get leaders by search
  async serviceGetLeaderBySearch(search: string): Promise<IsLeaders[]> {
    return await prisma.isLeaders.findMany({
      where: {
        Name: {
          contains: search,
          mode: "insensitive",
        },
      },
      include: {
        Schedule: true,
        Member: true,
      },
    });
  }
}
