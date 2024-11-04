import { AuthenticationError, UserInputError } from 'apollo-server-core';
import { BasicDataService } from './../../Services/basicDataService';


interface User {
    id: string;
    Role: string;
    IsLeaders: {
      Admin: boolean;
    };
    Family: {
      Rayon: {
        rayonNumber: number;
      };
      FamilyMembers?: {
        Role: string;
        Liturgos: boolean;
        IsLeaders: {
          Admin: boolean;
        };
      };
    };
  }

const basicDataService = new BasicDataService();


export const BasicInfoResolvers = {
    Mutation: {
        createBasicData: async(_args: any, {input}: any) => {
            try {
                return await basicDataService.servicesCreateBasicData(input);
            } catch (error) {
                if (
                    error instanceof AuthenticationError ||
                    error instanceof UserInputError
                  ) {
                    throw error;
                  }
                  console.error("Error creating member:", error);
                  throw new Error("An unexpected error occurred");
            }
        }
    },

    Query :{
        queryGetKSPS: async (_: any, _args: any, { user }: { user: User }) => {
            const {
              Family: {
                Rayon: { rayonNumber: Rayon },
              },
              Role,
            } = user;
      
            return await basicDataService.serviceGetKSPS(
                Rayon,
                Role ==="SUPERUSER"
            )
          },

          queryGetKSPbyRayonID : async(_: any, args: { id: string }) => {

      
            return basicDataService.serviceGetKSPbyRayonID(
              args.id,
            )
          },

          queryGetAllRayons: async (_: any, _args: any) => {
 
            return await basicDataService.serviceGetRayons(

            )
          }
    }
}