import { AuthenticationError } from "apollo-server-core";
import { leaderServices } from "../../Services/LeaderServices";

const LeaderServices = new leaderServices();

interface User {
  Member?: {
    Admin?: boolean;
    IsLeaders?: {
      Admin?: boolean;
    };
  };
}

export const LeaderResolvers = {
  Query: {
    queryGetLeaders: async () => {
      return await LeaderServices.serviceGetLeader();
    },

    queryGetLeadersByID: async (_: any, args: { id: string }) => {
      return await LeaderServices.serviceGetLeaderByID(args.id);
    },
  },

  Mutation: {
    createIsLeaders: async (_: any, args: any, { user }: { user: User }) => {
      if (!user?.Member?.Admin && !user?.Member?.IsLeaders?.Admin) {
        console.log("You are not authorized to perform this action.");
        console.log("User Admin status:", user?.Member?.Admin);

        throw new AuthenticationError(
          "You are not authorized to perform this action."
        );
      }

      try {
        const newLeader = await LeaderServices.serviceCreateLeader(args.data);
        console.log("Leader created successfully:", newLeader);
        console.log("Created by Admin:", user?.Member.IsLeaders);

        return newLeader;
      } catch (error) {
        throw new error();
      }
    },

    updateIsLeaders: async (
      _: any,
      args: { id: string; data: any },
      { user }: { user: User }
    ) => {
      if (!user?.Member?.Admin && !user?.Member?.IsLeaders?.Admin) {
        console.log("You are not authorized to perform this action.");
        console.log("User Admin status:", user?.Member?.Admin);

        throw new AuthenticationError(
          "You are not authorized to perform this action."
        );
      }

      console.log("Leader updated successfully:", args.data);
      console.log("Updated by Admin:", user?.Member.IsLeaders);

      return await LeaderServices.serviceUpdateLeaderByID(args.id, args.data);
    },

    deleteIsLeaders: async (
      _: any,
      args: { id: string },
      { user }: { user: User }
    ) => {
      if (!user?.Member?.Admin && !user?.Member?.IsLeaders?.Admin) {
        console.log("You are not authorized to perform this action.");
        console.log("User Admin status:", user?.Member?.Admin);

        throw new AuthenticationError(
          "You are not authorized to perform this action."
        );
      }

      console.log("Leader deleted successfully:", args.id);
      console.log("Deleted by Admin:", user?.Member.IsLeaders);
      return await LeaderServices.serviceDeleteLeaderByID(args.id);
    },

    leaderOnDuty: async (
      _: any,
      args: { id: string; data: any },
      { user }: { user: User }
    ) => {
      if (!user?.Member?.Admin && !user?.Member?.IsLeaders?.Admin) {
        console.log("You are not authorized to perform this action.");
        console.log("User Admin status:", user?.Member?.Admin);

        throw new AuthenticationError(
          "You are not authorized to perform this action."
        );
      }

      console.log("On Duty Leader updated successfully:", args.data);
      console.log("Updated by Admin:", user?.Member.IsLeaders);

      return await LeaderServices.serviceUpdateLeaderByID(args.id, args.data);
    },

    updateAdmin: async (
      _: any,
      args: { id: string; data: any },
      { user }: { user: User }
    ) => {
      if (!user?.Member?.Admin && !user?.Member?.IsLeaders?.Admin) {
        console.log("You are not authorized to perform this action.");
        console.log("User Admin status:", user?.Member?.Admin);
        throw new AuthenticationError(
          "You are not authorized to perform this action."
        );
      }

      console.log("On Duty Leader updated successfully:", args.data);
      console.log("Updated by Admin:", user?.Member.IsLeaders);

      return await LeaderServices.serviceUpdateLeaderByID(args.id, args.data);
    },
  },
};
