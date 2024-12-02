import { PrismaClient, Members } from "@prisma/client";

const prisma = new PrismaClient();

type memberByRayonFilter = {
  Family: {
    Rayon: number | null;
  };
Liturgos: boolean;
};

function createMemberByRayonFilter(rayon: number | null): memberByRayonFilter {
  return {
    Family: {
      Rayon: rayon,
    },
    Liturgos: true,
  };
}

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
  async serviceUpdateMemberLeadersID(
    id: string,
    data: Partial<Members>
  ): Promise<Members> {
    return await prisma.members.update({ where: { id: id }, data });
  }

  // get members include family, schedule, attendees
  async servicesGetMember(
    rayon: number | null,
    isSuperUser: Boolean = false
  ): Promise<Members[]> {
    const filter = isSuperUser
      ? {}
      : rayon
      ? createMemberByRayonFilter(rayon)
      : {}; 

      
    return await prisma.members.findMany({
      where: filter,
      include: {
        ScheduleAsLiturgos: true,
        Family: true,
        Attendees: true,
        IsLeaders: true,
        Schedule: true,
        User: true,
      },
    });
  }

async ServiceGetMemberCanBeLiturgos(
  rayon: number | null,
  isSuperUser: Boolean = false
): Promise<Members[]> {
  let filter = {Liturgos:true}
  if (!isSuperUser && rayon !== null) {
filter ={
  ...filter,
  ...createMemberByRayonFilter(rayon),
}
  }
  return await prisma.members.findMany({
    where: filter,
    include: {
      ScheduleAsLiturgos: true,
      Family: true,
      Attendees: true,
      IsLeaders: true,
      Schedule: true,
      User: true,
    },
  });
}



  // get members by search of name
  async servicesGetMemberBySearch(
    search: string,
    rayon: number | null, 
    isSuperUser: boolean = false
  ): Promise<Members[]> {
    let  filterZone = {};
if (!isSuperUser && rayon !== null) {
  filterZone = createMemberByRayonFilter(rayon);
}

    return await prisma.members.findMany({
      where: {
        AND: [
          {
            FullName: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          filterZone,
        ],
      },
      include: {
        Family: true,
        Schedule: true,
        Attendees: true,
        IsLeaders:{
          select:{
            Title:true
          }
        }
      },
    });
  }

  // get members by search of KSP
  async serviceGetMemberByKSP(
    search: string,
    rayon: number,
    isSuperUser: boolean = false
  ): Promise<Members[]> {
    const zoneFilter = isSuperUser
      ? {}
      : rayon
      ? createMemberByRayonFilter(rayon)
      : {};
    return await prisma.members.findMany({
      where: {
        AND: [
          {
            Family: {
              KSP: {
                contains: search,
                mode: "insensitive"
              },
            },
          },
          zoneFilter,
        ],
      },

      include: {
        Family: true,
        Schedule: true,
        Attendees: true,
        IsLeaders: true,
      },
    });
  }

  // get member by ID
  async servicesGetMemberByID(
    id: string,
    rayon: number,
    isSuperUser: boolean = false
  ): Promise<Members | null> {
    const member = await prisma.members.findUnique({
      where: { id },
      include: {
        Schedule: true,
        User: true,
        Family: true,
        Attendees: true,
        IsLeaders: true,
      },
    });

    if (!member) {
      throw new Error("Member not found");
    }
    if (isSuperUser || member.Family.Rayon === rayon) {
      return member;
    }

    return null;
  }

  // Update Many Members

  // avoid duplicate
  async avoidDuplicate(
    fullName: string,
    birthDate: Date
  ): Promise<Members | null> {
    return await prisma.members.findFirst({
      where: {
        FullName: fullName,
        BirthDate: birthDate,
      },
    });
  }
}
