import { PrismaClient, Members, } from "@prisma/client";

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
  async servicesGetMember(zones:number | null, isSuperUser:Boolean = false): Promise<Members[]> {
    const filter =  isSuperUser ? {} : zones ? { Zones: zones } : {}; // filter by zone, if superuser no filter
    return await prisma.members.findMany({
      where: filter,
      include: {
        ScheduleAsLiturgos: true,
        Family: true,
        Attendees : true,
        IsLeaders : true,
        Schedule: true,
        User: true,
        
        },
    });
  }

  // get members by search of name
  async servicesGetMemberBySearch(search: string, zones: number, isSuperUser: boolean = false): Promise<Members[]> {
    const zoneFilter = isSuperUser ? {} : { Zones: zones };
    
    return await prisma.members.findMany({
      where: {
        AND: [
          {
            FullName: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          zoneFilter
        ],
      },
      include: {
        Family: true,
        Schedule: true,
        Attendees: true,
        IsLeaders: true,
        User: true,
      },
    });
  }

// get members by search of KSP
  async serviceGetMemberByKSP(search: string, zones: number, isSuperUser: boolean = false): Promise<Members[]> {
    const zoneFilter = isSuperUser ? {} : { Zones: zones };
    return await prisma.members.findMany({
      where: {
        AND: [
          {
            KSP: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          zoneFilter
        ],
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
  async servicesGetMemberByID(id: string, zones: number, isSuperUser: boolean = false): Promise<Members | null> {
  
    const member = await prisma.members.findUnique({ 
      where: { id }, 
      include :  {
        Schedule : true,
        User : true,
        Family : true,
        Attendees : true,
        IsLeaders : true,
      }
    
    });

    if (!member) {
      throw new Error("Member not found");
    }
    if (isSuperUser || member.Zones === zones) {
      return member;
    }
    return null;
  }

  // Update Many Members
  



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