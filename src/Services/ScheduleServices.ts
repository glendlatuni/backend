import { PrismaClient, Schedule, Members } from "@prisma/client";

const prisma = new PrismaClient();




export class scheduleServices {
  async createSchedule(data: Omit<Schedule, "id">): Promise<Schedule> {
    return await prisma.schedule.create({ data });
  }

  async getSchedule(): Promise<Schedule[]> {
    return await prisma.schedule.findMany();
  }

  async getScheduleByMemberId(id: string): Promise<Members | null> {
    return await prisma.members.findFirst({ 
        
        where: { id : id },
        include: {
            Schedule: true
        } 
    
    });
  }


  async deleteSchedule(id: string): Promise<Schedule | null> {
    return await prisma.schedule.delete({ where: { id } });
  }

  async updateSchedule(
    id: string,
    data: Partial<Schedule>
  ): Promise<Schedule | null> {
    return await prisma.schedule.update({ where: { id }, data });
  }
}
