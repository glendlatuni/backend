import { PrismaClient, Schedule } from "@prisma/client";

const prisma = new PrismaClient();

type memberByRayonFilter = {
  Member: {
    Family: {
      Rayon: {
        number: number | null;
      };
    };
  };
};

function createMemberByRayonFilter(rayon: number | null): memberByRayonFilter {
  return {
    Member: {
      Family: {
        Rayon: {
          number: rayon,
        },
      },
    },
  };
}

export class scheduleServices {
  async serviceCreateSchedule(data: Omit<Schedule, "id">): Promise<Schedule> {
    try {
      const onDuty = await prisma.isLeaders.findUnique({
        where: { id: data.Leaders_id },
        select: {
          id: true,
          onDuty: true,
        },
      });

      // Cek apakah leader ada
      if (!onDuty) throw new Error("invalid leaders ID or not found");
      // Cek apakah leader sedang aktif dalam bertugas
      if (!onDuty.onDuty) throw new Error("Leader not on duty");

      // Fungsi untuk mendapatkan KSP dari member
      async function getMemberKSP(
        memberId: string | null
      ): Promise<string | null> {
        if (!memberId) return null;
        const member = await prisma.members.findUnique({
          where: { id: memberId },
          select: {
            Liturgos: true,
            Family: {
              select: {
       KSP: {
         select: {
           kspname: true,
         }
       },
              },
            },
          },
        });
        return member?.Family?.KSP?.kspname || null;
      }

      // Dapatkan KSP untuk Liturgos dan Member
      const liturgosKSP = await getMemberKSP(data.Liturgos_id);
      const memberKSP = await getMemberKSP(data.Member_id);

      if (liturgosKSP && memberKSP && liturgosKSP !== memberKSP) {
        throw new Error(`Liturgos and Member must be from  ${memberKSP}`);
      }

      // Persiapkan data untuk membuat schedule
      const scheduleData: any = {
        Member_id: data.Member_id,
        Category: data.Category,
        Date: data.Date,
        Day: data.Day,
        Month: data.Month,
        Years: data.Years,
        Time: data.Time,
        Address: data.Address,
        Liturgos_id: data.Liturgos_id,
        Description: data.Description,
        Leaders_id: data.Leaders_id,
      };

      // Jika member_id ada, tambahkan ke scheduleData
      if (data.Member_id) {
        scheduleData.Member_id = data.Member_id;
      }

      // Buat schedule
      return await prisma.schedule.create({
        data: scheduleData,
      });
    } catch (error) {
      console.error("Error in serviceCreateSchedule:", error);
      throw error;
    }
  }

  async serviceGetSchedule(
    rayon: number | null,
    isSuperUser: Boolean = false
  ): Promise<Schedule[]> {
    try {
      const filter = isSuperUser
        ? {}
        : rayon
        ? createMemberByRayonFilter(rayon)
        : {};

      return await prisma.schedule.findMany({
        where: filter,
        include: {
          Member: {
            select: {
              FullName: true,
              Category: true,
              Family: {
                select: {
                  Address: true,
                  Rayon: {
                    select: {
                      rayonNumber: true,
                    }
                  },
                  KSP:{
                    select: {
                      kspname: true
                    }

                  }
                },
              },
            },
          },
          Liturgos: {
            select: {
              FullName: true,
            },
          },
          IsLeaders: {
            select: {
              Title: true,
              Member: {
                select: {
                  FullName: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      console.error("Error in serviceGetSchedule:", error);
      throw error;
    }
  }

  async serviceGetScheduleByID(
    id: string,
    rayon: number,
    isSuperUser: boolean = false
  ): Promise<Schedule | null> {
    try {
      const getSchedule = await prisma.schedule.findFirst({
        where: { id: id },
        include: {
          Liturgos: {
            select: {
              FullName: true,
            },
          },
          IsLeaders: {
            select: {
              Title: true,
              Member: {
                select: {
                  FullName: true,
                },
              },
            },
          },
          Member: {
            select: {
              Family: {
                select: {
       Rayon: {
         select: {
           rayonNumber: true,
         }
       }
                },
              },
            },
          },
        },
      });
      if (!getSchedule) {
        throw new Error("Schedule not found");
      }

      if (
        isSuperUser ||
        getSchedule.Member?.Family?.Rayon.rayonNumber === rayon
      ) {
        return getSchedule;
      }
      return null;
    } catch (error) {
      console.error("Error in serviceGetScheduleByID:", error);
      throw error;
    }
  }

  async serviceDeleteSchedule(id: string): Promise<Schedule | null> {
    try {
      return await prisma.schedule.delete({ where: { id } });
    } catch (error) {
      console.error("Error in serviceDeleteSchedule:", error);
      throw error;
    }
  }

  async serviceGetScheduleBySearch(
    search: string,
    searchFields: (keyof Schedule | "Members.KSP")[] = ["Day"]
  ): Promise<Schedule[]> {
    const whereCondition = searchFields.reduce((acc, field) => {
      if (field === "Members.KSP") {
        acc.Members = {
          KSP: {
            contains: search,
            mode: "insensitive",
          },
        };
      } else {
        acc[field as keyof Schedule] = {
          contains: search,
          mode: "insensitive",
        };
      }

      return acc;
    }, {} as Record<string, any>);

    return await prisma.schedule.findMany({
      where: {
        OR: Object.entries(whereCondition).map(([field, condition]) =>
          field === "Members" ? { Member: condition } : { [field]: condition }
        ),
      },
      include: {
        IsLeaders: true,
        Member: {
          include: {
            Family: true,
          },
        },
      },
    });
  }

  async serviceUpdateSchedule(
    id: string,
    data: Partial<Schedule>
  ): Promise<Schedule | null> {
    try {
      return await prisma.schedule.update({ where: { id }, data });
    } catch (error) {
      console.error("Error in serviceUpdateSchedule:", error);
      throw error;
    }
  }
}
