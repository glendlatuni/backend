import { PrismaClient, Schedule, Members } from "@prisma/client";

const prisma = new PrismaClient();

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

      // Persiapkan data untuk membuat schedule
      const scheduleData: any = {
        Category: data.Category,
        Address: data.Address,
        Liturgos: data.Liturgos,
        Date: data.Date,
        Day: data.Day,
        Month: data.Month,
        Years: data.Years,
        Time: data.Time,
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

  async serviceGetSchedule(): Promise<Schedule[]> {
    try {
      return await prisma.schedule.findMany({
        include: {
          IsLeaders: true,
          Member: {
            include: {
              Family: true,
            },
          },
        },
      });
    } catch (error) {
      console.error("Error in serviceGetSchedule:", error);
      throw error;
    }
  }

  async serviceGetScheduleByID(id: string): Promise<Members | null> {
    try {
      return await prisma.members.findFirst({
        where: { id: id },
        include: {
          Schedule: true,
        },
      });
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
    searchFields: (keyof Schedule| "Members.KSP")[] = ['Day']
  ): Promise<Schedule[]> {
    const whereCondition = searchFields.reduce((acc, field) => {
      if (field === "Members.KSP") {
        acc.Members = {
          KSP: {
            contains: search,
            mode: 'insensitive',
          }
        }
      }else{
        acc[field as keyof Schedule] = {
          contains: search,
          mode: 'insensitive',
        };
      }
      
      
      return acc;
    }, {} as Record<string, any>);
  
    return await prisma.schedule.findMany({
      where: {
        OR: Object.entries(whereCondition).map(([field, condition]) => 
          field === 'Members' ? { Member: condition } : { [field]: condition }
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
