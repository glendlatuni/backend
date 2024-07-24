import { PrismaClient, IsLeaders } from "@prisma/client";

const prisma = new PrismaClient();

export class leaderServices {


  async serviceCreateLeader(data: Omit<IsLeaders, "id">): Promise<IsLeaders> {
    return await prisma.isLeaders.create({ data });
  }

  async serviceGetLeaderByID(id: string): Promise<IsLeaders | null> {
    return await prisma.isLeaders.findUnique({
      where: { id },
      include: {
        Member: true,
      },
    });
  }

  async serviceGetLeader(): Promise<IsLeaders[]> {
    return await prisma.isLeaders.findMany({
      include: {
        Schedule: true,
      },
    });
  }

  async serviceUpdateLeaderByID(
    id: string,
    data: Partial<IsLeaders>
  ): Promise<IsLeaders> {
    return await prisma.isLeaders.update({
      where: { id },
      data,
    });
  }


  async serviceDeleteLeaderByID(id: string): Promise<IsLeaders | null> {
    return await prisma.isLeaders.delete({
      where: { id },
    });
  }


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
