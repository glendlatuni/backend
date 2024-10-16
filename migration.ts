import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

try {
  // Menghitung jumlah total record
  // const totalMembers = await prisma.members.count();

  // Mengupdate semua record dengan FamilyStatus = true
  // const result = await prisma.members.updateMany({
  //   data: {
  //    MemberStatus: true,
  //   },
  // });


  const updateParents = await prisma.members.updateMany({
    where: {
      AND: [
        { MarriageStatus: null },
        { FamilyPosition: { in: ["Bapak", "Ibu"] } }
      ]
    },
    data: { MarriageStatus: "Kawin" }
  });
  
  const updateChildren = await prisma.members.updateMany({
    where: {
      AND: [
        { MarriageStatus: null },
        { FamilyPosition: { in: ["Anak", "Anak 1", "Anak 2", "Anak 3", "anak"] } }
      ]
    },
    data: { MarriageStatus: "Belum Kawin" }
  });
  
return { updateParents, updateChildren };
 



} catch (error) {
  console.error('Error updating members:', error);
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