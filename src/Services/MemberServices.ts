import { PrismaClient, Members } from "@prisma/client";

const prisma = new PrismaClient();

export class membersService {
  async servicesCreateMember(data: Omit<Members, "id">): Promise<Members> {
    return await prisma.members.create({ data });
  }

  async servicesDeleteMember(id: string): Promise<Members | null> {
    return await prisma.members.delete({ where: { id } });
  }

  async servicesUpdateMember(
    id: string,
    data: Partial<Members>
  ): Promise<Members | null> {
    return await prisma.members.update({ where: { id }, data });
  }

  async servicesGetMember(): Promise<Members[]> {
    return await prisma.members.findMany({
      include: {
        Family: true,
        Schedule: true,
        Attendees: true,
        

      },
    });
  }

  async servicesGetMemberBySearch(search: string): Promise<Members[]> {
    return await prisma.members.findMany({
      where: {
        FullName: {
          contains: search,
          mode: "insensitive",
        },
      },
      include: {
        Family: true,
        Schedule: true,
        Attendees: true,
      },
    });
  }

  async servicesGetMemberByID(id: string): Promise<Members | null> {
    console.log(`Getting jemaat by ID: ${id}`);
    return await prisma.members.findUnique({ where: { id } });
  }
}
