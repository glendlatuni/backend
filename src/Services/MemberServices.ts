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

  async serviceUpdateMemberLeadersID(id: string, data: Partial<Members>): Promise<Members> {
    return await prisma.members.update({ where: { id : id }, data });
  }

  async servicesGetMember(): Promise<Members[]> {
    return await prisma.members.findMany({
      include: {
        Family: true,
        Attendees : true,
        IsLeaders : true,
        Schedule: true,
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
        IsLeaders: true,
      },
    });
  }


  async serviceGetMemberByKSP(search: string): Promise<Members[]> {
    return await prisma.members.findMany({
      where: {
        KSP: {
          contains: search,
          mode: "insensitive",
        },
      },
      include:{
        Family: true,
        Schedule: true,
        Attendees: true,
        IsLeaders: true,
      }
    })
  }

  async servicesGetMemberByID(id: string): Promise<Members | null> {
    console.log(`Getting member by ID: ${id}`);
    return await prisma.members.findUnique({ 
      where: { id }, 
      include :  {
        Schedule : true
      }
    
    });
  }


  async avoidDuplicate(fullName:string, birthDate:Date): Promise<Members | null> {

    return await prisma.members.findFirst({
      where: {
        FullName: fullName,
        BirthDate: birthDate
      }
    })
  }

}