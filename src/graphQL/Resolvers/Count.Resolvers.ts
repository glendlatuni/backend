import { countService } from "../../Services/CountServices";

const CountServices = new countService();

interface User {
  id: string;
  Role: string;
  IsLeaders: {
    Admin: boolean;
  };
  Family: {
    Rayon: {
      rayonNumber: number;
    }
    FamilyMembers?: {
      Role: string;
      Liturgos: boolean;
      IsLeaders: {
        Admin: boolean;
      };
    };
  };
}

export const CountResolvers = {
  Query: {
    getFamilyCount: async () => {
      return CountServices.getFamilyCount();
    },
    getMemberCount: async () => {
      return CountServices.getMemberCount();
    },
    getMemberByGender: async (_: any, _args: any, { user }: { user: User } ) => {
      const {
        Family: { 
          Rayon: { rayonNumber: Rayon }, 
        },
        Role,
      } = user;
      
        return CountServices.getMemberByGender(
            Rayon,
            Role === "SUPERUSER"
        );
    },
    getMemberByCategory: async (_: any, _args: any, { user }: { user: User } ) => {
      const {
        Family: { 
          Rayon: { rayonNumber: Rayon }, 
        },
        Role,
      } = user;
      
        return CountServices.getMemberByCategory(
            Rayon,
            Role === "SUPERUSER"
        );
    },
  },
};
