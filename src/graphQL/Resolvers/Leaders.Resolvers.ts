import { leaderServices } from "../../Services/LeaderServices";

const LeaderServices = new leaderServices();

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
    createIsLeaders: async (_: any, args: any) => {
      const newLeader = await LeaderServices.serviceCreateLeader(args.data);
      return newLeader;
    },

    updateIsLeaders: async (_: any, args: { id: string; data: any }) => {
      return await LeaderServices.serviceUpdateLeaderByID(args.id, args.data);
    },

    deleteIsLeaders: async (_: any, args: { id: string }) => {
      return await LeaderServices.serviceDeleteLeaderByID(args.id);
    },

    leaderOnDuty: async (_: any, args: { id: string; data: any }) => {
      return await LeaderServices.serviceUpdateLeaderByID(args.id, args.data);
    },
  },
};
