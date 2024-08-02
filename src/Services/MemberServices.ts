import { PrismaClient, Members } from "@prisma/client";

const prisma = new PrismaClient();

export class membersService {
  // create member [-]
  async servicesCreateMember(data: Omit<Members, "id">): Promise<Members> {
    return await prisma.members.create({ data });
  }
// delete member[-]
  async servicesDeleteMember(id: string): Promise<Members | null> {
    return await prisma.members.delete({ where: { id } });
  }
// update member[-]
  async servicesUpdateMember(
    id: string,
    data: Partial<Members>
  ): Promise<Members | null> {
    return await prisma.members.update({ where: { id }, data });
  }

  // for updating member who later became leader [-]
  async serviceUpdateMemberLeadersID(id: string, data: Partial<Members>): Promise<Members> {
    return await prisma.members.update({ where: { id : id }, data });
  }

  // get members include family, schedule, attendees
  async servicesGetMember(): Promise<Members[]> {
    return await prisma.members.findMany({
      include: {
        Family: true,
        Attendees : true,
        IsLeaders : true,
        Schedule: true,
        User: true,
        },
    });
  }

  // get members by search of name
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

// get members by search of KSP
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


// get member by ID
  async servicesGetMemberByID(id: string): Promise<Members | null> {
    console.log(`Getting member by ID: ${id}`);
    return await prisma.members.findUnique({ 
      where: { id }, 
      include :  {
        Schedule : true
      }
    
    });
  }



  // avoid duplicate
  async avoidDuplicate(fullName:string, birthDate:Date): Promise<Members | null> {

    return await prisma.members.findFirst({
      where: {
        FullName: fullName,
        BirthDate: birthDate
      }
    })
  }

}