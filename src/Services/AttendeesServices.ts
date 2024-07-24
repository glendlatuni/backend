import { PrismaClient, Attendees } from "@prisma/client";

const prisma = new PrismaClient();

export class attendeesServices {

    async serviceCreateAttendees(data: Omit<Attendees, "id">): Promise<Attendees> {
        return await prisma.attendees.create({ data });
    }

    async serviceGetAttendees(): Promise<Attendees[]> {
        return await prisma.attendees.findMany();
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

}