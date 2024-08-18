import { PrismaClient, role } from '@prisma/client';

const prisma = new PrismaClient();


async function updateAdmintorole() {
    await prisma.members.updateMany({
        where: { Admin: true },
        data: { Role: role.ADMIN }
      });

      await prisma.members.updateMany({
        where: { Admin: false },
        data: { Role: role.MEMBERS },
      });

      console.log('Roles updated successfully');
}

updateAdmintorole()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });