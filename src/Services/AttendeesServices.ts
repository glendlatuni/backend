import { PrismaClient, Attendees } from "@prisma/client";

const prisma = new PrismaClient();

export class attendeesServices {
  async serviceCreateAttendees(
    data: Omit<Attendees, "id">
  ): Promise<Attendees> {
    return await prisma.attendees.create({ data });
  }

  async serviceGetAttendees(): Promise<Attendees[]> {
    return await prisma.attendees.findMany({
      include: {
        Schedule: {
          include: {
            IsLeaders: true,
          },
        },
        Members: true,
      },
    });
  }

  async serviceGetAttendeesByID(id: string): Promise<Attendees | null> {
    return await prisma.attendees.findUnique({ where: { id } });
  }

  async serviceUpdateAttendees(
    id: string,
    data: Partial<Attendees>
  ): Promise<Attendees | null> {
    return await prisma.attendees.update({ where: { id }, data });
  }

  async serviceDeleteAttendees(id: string): Promise<Attendees | null> {
    return await prisma.attendees.delete({ where: { id } });
  }

  async serviceAddRealAttendees(
    id: string,
    data: Partial<Attendees>
  ): Promise<Attendees | null> {
    return await prisma.attendees.update({
      where: { id: id },
      data: data,
    });
  }
  async addMembersToAttendees(id: string, membersIds: string[]): Promise<any> {
    try {
      const attendees = await prisma.attendees.findUnique({
        where: { id: id },
        select: {
          Members_ID: true,
        },
      });

      if (!attendees) {
        throw new Error("Attendees not found");
      }

      const exsistingMembers = new Set(attendees.Members_ID);
      const newMembers = membersIds.filter((id) => !exsistingMembers.has(id));

      const updateAttendees = await prisma.attendees.update({
        where: { id: id },
        data: {
          Members_ID: {
            push: newMembers,
          },
        },
      });

      return updateAttendees;
    } catch (error) {
      throw new Error(`Failed to add members to attendees: ${error.message}`);
    }
  }
}
