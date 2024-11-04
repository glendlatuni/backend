import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

try {


  const invalidFamilies = await prisma.family.findMany({
    where: {
      OR: [
        { rayonId: null },
        { kspId: null  },
      ]
    }
  });
  console.log('Invalid families:', invalidFamilies);


} catch (error) {
  console.error('Error:', error);
} finally {
  await prisma.$disconnect();
}
  

  // const families = await prisma.family.findMany({
  //   include: {
  //     FamilyMembers: {
  //       select: {
  //         id: true,
  //         FullName: true,
  //         Zones: true,
  //         Family_id: true,
  //       },
  //     },
  //   },
  // });

  // for (const family of families) {
  //   const uniqueZones = Array.from(new Set(family.FamilyMembers.map((member) => member.Zones)));
  //   await prisma.family.update({
  //     where: {
  //       id: family.id,
  //     },
  //     data: {
  //       Rayon: uniqueZones[0], // Asumsi hanya satu zona di satu keluarga
  //     },
  //   });
  // }

  // Hapus field Zones dari model Member
//   await prisma.members.updateMany({
//     data: {
//       Zones: null, // Atur nilai default untuk Zones jika perlu
//     },
   
    
//   });
//   console.log("Zones field deleted successfully");

}
main()