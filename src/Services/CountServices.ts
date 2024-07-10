import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();


export class countService{

    async getJemaatCount(): Promise<number> {
        return await prisma.jemaat.count();
    }

    async getKeluargaCount(): Promise<number> {
        return await prisma.keluarga.count();
    }

}