import { PrismaClient, Schedule, Members, } from "@prisma/client";

const prisma = new PrismaClient();

export class scheduleServices {

  
  async serviceCreateSchedule(data: Omit<Schedule, "id">): Promise<Schedule> {
    // Validasi IsLeader
    if (data.Leaders_id) {
      const isLeader = await prisma.isLeaders.findUnique({
        where: { id: data.Leaders_id },
      });

      if (!isLeader) {
        throw new Error("Invalid IsLeader ID. Leader not found.");
      }
    }

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
      scheduleData.member_id = data.Member_id;
    }

    // Buat schedule
    return await prisma.schedule.create({
      data: scheduleData,
    });
  }



  async serviceGetSchedule(): Promise<Schedule[]> {
    return await prisma.schedule.findMany({
      include: {
        IsLeaders: true,
        Member: true,
      },
    });
  }

  async serviceGetScheduleByID(id: string): Promise<Members | null> {
    return await prisma.members.findFirst({
      where: { id: id },
      include: {
        Schedule: true,
      },
    });
  }

  async serviceDeleteSchedule(id: string): Promise<Schedule | null> {
    return await prisma.schedule.delete({ where: { id } });
  }

  async serviceUpdateSchedule(
    id: string,
    data: Partial<Schedule>
  ): Promise<Schedule | null> {
    return await prisma.schedule.update({ where: { id }, data });
  }
}
