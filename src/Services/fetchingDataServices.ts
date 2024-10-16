import { PrismaClient, Members } from "@prisma/client";

const prisma = new PrismaClient();

export class fetchingDataServices {

    async getMembers(): Promise<Members[]> {
        return await prisma.members.findMany();
    }

    async getMemberByID(id: string): Promise<Members | null> {
        return await prisma.members.findUnique({ where: { id } });
    }
}