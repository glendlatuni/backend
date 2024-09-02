import { AuthenticationError } from "apollo-server-core";
import { leaderServices } from "../../Services/LeaderServices";

const LeaderServices = new leaderServices();

interface User {
  id: string;
  Role: string;
  IsLeaders: {
    Admin: boolean;
  };
  Family: {
    Rayon: number;
    FamilyMembers: {
      Role: string;
      IsLeaders: {
        Admin: boolean;
      };
    };
  };
}

export const LeaderResolvers = {
  Query: {
    queryGetLeaders: async (_: any, _args: any, { user }: { user: User }) => {
      const {
        Family: { Rayon },
        Role,
      } = user;
      try {
        return await LeaderServices.serviceGetLeader(
          Rayon,
          Role === "SUPERUSER"
        );
      } catch (error) {
        console.error("Error in queryGetLeaders:", error);
        throw error;
      }
    },

    getLeaderBySearch: async (
      _: any,
      args: { search: string },
      { user }: { user: User }
    ) => {
      const {
        Family: { Rayon },
        Role,
      } = user;
      return await LeaderServices.serviceGetLeaderBySearch(
        args.search,
        Rayon,
        Role === "SUPERUSER"
      );
    },

    queryGetLeadersByID: async (
      _: any,
      args: { id: string },
      { user }: { user: User }
    ) => {
      const {
        Family: { Rayon },
        Role,
      } = user;
      return await LeaderServices.serviceGetLeaderByID(
        args.id,
        Rayon,
        Role === "SUPERUSER"
      );
    },
  },

  Mutation: {
    createIsLeaders: async (_: any, args: any, { user }: { user: User }) => {
      
    
      
      if (user?.Role === "MEMBERS") {
        console.log("You are not authorized to perform this action.");
        throw new AuthenticationError(
          "You are not authorized to perform this action."
        );
      }

      try {
        const newLeader = await LeaderServices.serviceCreateLeader(args.data);
        console.log("Leader created successfully:", newLeader);

        return newLeader;
      } catch (error) {
        throw error;
      }
    },

    updateIsLeaders: async (
      _: any,
      args: { id: string; data: any },
      { user }: { user: User }
    ) => {
      if (user?.Role === "MEMBERS") {
        console.log("You are not authorized to perform this action.");

        throw new AuthenticationError(
          "You are not authorized to perform this action."
        );
      }

      try {
        console.log("Leader updated successfully:", args.data);

        return await LeaderServices.serviceUpdateLeaderByID(args.id, args.data);
      } catch (error) {
        throw error;
      }
    },

    updateIsLeadersTitle: async (
      _: any,
      args: { id: string; data: any },
      { user }: { user: User }
    ) => {
      if (user?.Role === "MEMBERS") {
        console.log("You are not authorized to perform this action.")

        throw new AuthenticationError(
          "You are not authorized to perform this action."
        );
      }

      try {
        console.log("Leader updated successfully:", args.data);

        return await LeaderServices.serviceUpdateLeaderByID(args.id, args.data);
      } catch (error) {
        throw error;
      }
    },

    UpdateLeaderOnDuty: async (
      _: any,
      args: { id: string; data: any },
      { user }: { user: User }
    ) => {
      if (user?.Role === "MEMBERS") {
        console.log("You are not authorized to perform this action.");


        throw new AuthenticationError(
          "You are not authorized to perform this action."
        );
      }

      console.log("On Duty Leader updated successfully:", args.data);

      return await LeaderServices.serviceUpdateLeaderByID(args.id, args.data);
    },

    updateAdmin: async (
      _: any,
      args: { id: string; data: any },
      { user }: { user: User }
    ) => {
      if (user?.Role === "MEMBERS") {
        console.log("You are not authorized to perform this action.");
        throw new AuthenticationError(
          "You are not authorized to perform this action."
        );
      }

      return await LeaderServices.serviceUpdateLeaderByID(args.id, args.data);
    },
  },
};
