import { KSP, Prisma, PrismaClient, Rayon } from "@prisma/client";

const prisma = new PrismaClient();

// type kspFilterByRayon = {
//   rayon?: number;
// };

// function createKSPbyRayonFilter(rayon : number | null): kspFilterByRayon {
//   return rayon !== null
//       ? {
//           rayon: rayon
//       }
//       : {};
// }

interface KSPInput {
  name: string;
}

interface RayonInput {
  number: number;
  ksps: KSPInput[];
}

interface ChurchInput {
  id: string;
  churchName: string;
  rayons: RayonInput[];
}

export class BasicDataService {
  async servicesCreateBasicData(input: ChurchInput) {
    const normalizedChurchName = input.churchName.toLowerCase().trim();

    console.log("Nama Gereja adalah:", normalizedChurchName);

    try {
      return await prisma.$transaction(async (prisma) => {
        // Cek apakah gereja sudah ada
        let church = await prisma.church.findFirst({
          where: {
            name: { equals: normalizedChurchName, mode: "insensitive" },
          },
          include: {
            rayons: {
              include: {
                ksps: true,
              },
            },
          },
        });

        console.log("nama gereja yang ditemukan adalah:", church);

        if (!church) {
          console.log("Gereja tidak ditemukan, buat baru");
          church = await prisma.church.create({
            data: {
              name: input.churchName,
            },
            include: {
              rayons: {
                include: {
                  ksps: true,
                },
              },
            },
          });
        }

        for (const rayonData of input.rayons) {
          // Cek apakah rayon sudah ada
          let rayon = church.rayons.find(
            (r) => r.rayonNumber === rayonData.number
          );

          console.log("rayon yang ditemukan adalah:", rayon);

          if (!rayon) {
            console.log("Rayon tidak ditemukan, buat baru");
            rayon = await prisma.rayon.create({
              data: {
                rayonNumber: rayonData.number,
                churchId: church.id,
              },
              include: {
                ksps: true,
              },
            });
          } else {
            throw new Error(
              `Rayon ${rayonData.number} already exists in ${church.name}`
            );
          }

          for (const kspData of rayonData.ksps) {
            console.log("ksp yang ditemukan adalah:", kspData);
            const kspExists = rayon.ksps.some(
              (k) => k.kspname.toLowerCase() === kspData.name.toLowerCase()
            );

            if (kspExists) {
              throw new Error(
                `KSP "${kspData.name}" already exists in Rayon ${rayonData.number}`
              );
            }

            console.log("KSP tidak ditemukan, buat baru");
            await prisma.kSP.create({
              data: {
                kspname: kspData.name,
                rayonId: rayon.id,
              },
            });
          }
        }

        // Ambil data gereja terbaru setelah semua perubahan
        return await prisma.church.findUnique({
          where: { id: church.id },
          include: {
            rayons: {
              include: {
                ksps: true,
              },
            },
          },
        });
      });
    } catch (error) {
      console.error("Error in servicesCreateBasicData:", error);
      throw error;
    }
  }

  async serviceGetKSPS(
    rayon: number | null,
    isSuperUser: Boolean = false
  ): Promise<KSP[]> {
    let filter: Prisma.KSPWhereInput = {};

    if (!isSuperUser && rayon !== null) {
      filter = {
        rayon: {
          rayonNumber: rayon,
        },
      };
    }
    const result = await prisma.kSP.findMany({
      where: filter,
      include: {
        rayon: {
          include: {
            church: true,
          },
        },
        families: {
          select: {
            FamilyName: true,
            Address: true,
          },
        },
      },
    });
    console.log("KSP RESULT,", result);
    return result;
  }

  async serviceGetRayons(): Promise<Rayon[]> {
    const result = await prisma.rayon.findMany({
      include: {
        ksps: true,
        church: true,
        families:{
          include:{
            FamilyMembers: true
          }
        }
      },
    });
    return result;
  }

  async serviceGetKSPbyRayonID(id:string): Promise<Rayon[]>{
    const result = await prisma.rayon.findMany({
      where: {
        id
      },
      include: {
        church: true,
        ksps: true,
      }
      
    });

    if(!result){
      throw new Error("KSP not found or rayon not found");
    }

    return result;


  }
}
