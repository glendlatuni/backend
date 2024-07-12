import { PrismaClient, keluarga } from "@prisma/client";


const prisma = new PrismaClient();

export class KeluargaService{
    
    async createKeluarga(data: Omit<keluarga, "id">): Promise<keluarga> {
        return await prisma.keluarga.create({ data });
    }


    async getKeluarga(): Promise<keluarga[]> {
        return await prisma.keluarga.findMany({
            include: {
                anggota_keluarga: true
            }
        });
    }
    async getKeluargaById (id: string): Promise<keluarga | null> {
        return await prisma.keluarga.findUnique({ where: { id } });
    }

    async updateKeluarga(id: string, data: Partial<keluarga>): Promise<keluarga | null> {
        return await prisma.keluarga.update({ where: { id }, data });
    }

    async deleteKeluarga(id: string): Promise<keluarga | null> {
        return await prisma.keluarga.delete({ where: { id } });
    }
}