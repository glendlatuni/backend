import { PrismaClient, Members } from "@prisma/client";

const prisma = new PrismaClient();

export class membersService {
  async createMember(data: Omit<Members, "id">): Promise<Members> {
    return await prisma.members.create({ data });
  }

  async deleteMember(id: string): Promise<Members | null> {
    return await prisma.members.delete({ where: { id } });
  }

  async updateMember(
    id: string,
    data: Partial<Members>
  ): Promise<Members | null> {
    return await prisma.members.update({ where: { id }, data });
  }

  async getMember(): Promise<Members[]> {
    return await prisma.members.findMany({
      include: {
        Family: true,
        Schedule: true,
        Attendees: true,
      },
    });
  }

  async getMemberById(id: string): Promise<Members | null> {
    console.log(`Getting jemaat by ID: ${id}`);
    return await prisma.members.findUnique({ where: { id } });
  }
}
