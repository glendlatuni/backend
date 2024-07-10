import { PrismaClient, jemaat } from "@prisma/client";



const prisma = new PrismaClient();


export class JemaatService{

    async createJemaat(data: Omit<jemaat, "id">): Promise<jemaat> {
        return await prisma.jemaat.create({ data });
    }

    async deleteJemaat (id: string): Promise<jemaat | null> {
        return await prisma.jemaat.delete({ where: { id } });
    }

    async updateJemaat(id: string, data: Partial<jemaat>): Promise<jemaat | null> {
        return await prisma.jemaat.update({ where: { id }, data });
    }

    async getJemaat(): Promise<jemaat[]> {
        return await prisma.jemaat.findMany({
            include: {
                keluarga: true,
                jadwal: true,
                kehadiran: true
            }
        });
    }

    async getJemaatById(id: string): Promise<jemaat | null> {
        console.log(`Getting jemaat by ID: ${id}`);
        return await prisma.jemaat.findUnique({ where: { id } });
    }



}