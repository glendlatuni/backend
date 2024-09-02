// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// async function migrate() {
  // Update semua Family yang belum memiliki Rayon
  // await prisma.family.updateMany({
  //   where: {
  //     Rayon: null,
  //   },
  //   data: {
  //     Rayon: 0, 
  //   },
  // });

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
// }

// migrate();