import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();


export class countService{

    // counting members

    async getJemaatCount(): Promise<number> {
        return await prisma.members.count();
    }


    // counting family 
    async getKeluargaCount(): Promise<number> {
        return await prisma.family.count();
    }

}