import { AuthenticationError } from "apollo-server-core";
import { scheduleServices } from "../../Services/ScheduleServices";

const ScheduleServices = new scheduleServices();

interface User {
  Role?: string;
  IsLeaders?: {
    Admin?: boolean;
  };
}

enum searchFields {
  Id = "id",
  Category = "Category",
  Date = "Date",
  Day = "Day",
  Month = "Month",
  Years = "Years",
  Time = "Time",
  Address = "Address",
  Member_id = "Member_id",
  Liturgos_id = "Liturgos_id",
  Description = "Description",
  Members_KSP = "Members.KSP"
}

export const ScheduleResolvers = {
  Query: {
    queryGetSchedule: async () => {
      return await ScheduleServices.serviceGetSchedule();
    },

    queryGetScheduleByID: async (_: any, args: { id: string }) => {
      return await ScheduleServices.serviceGetScheduleByID(args.id);
    },

    queryGetScheduleBySearch: async (_: any, args: { search: string, searchFields: searchFields[] }) => {
      return await ScheduleServices.serviceGetScheduleBySearch(args.search, args.searchFields);
    }
  },

  Mutation: {
    createSchedule: async (_: any, args: any, { user }: { user: User }) => {
      if (user?.Role === "MEMBER" && user?.IsLeaders?.Admin) {
        console.log("You are not authorized to perform this action.");
        console.log("User Admin status:", user?.Role === "MEMBER");

        throw new AuthenticationError(
          "You are not authorized to perform this action."
        );
      }

      console.log("Schedule created successfully:", args.data);
      console.log("Created by Admin:", user?.IsLeaders?.Admin);

      return await ScheduleServices.serviceCreateSchedule(args.data);
    },

    updateSchedule: async (
      _: any,
      args: { id: string; data: any },
      { user }: { user: User }
    ) => {
      if (user?.Role === "MEMBER" && user?.IsLeaders?.Admin) {
        console.log("You are not authorized to perform this action.");
        console.log("User Admin status:", user?.Role === "MEMBER");

        throw new AuthenticationError(
          "You are not authorized to perform this action."
        );
      }

      console.log("Schedule created successfully:", args.data);
      console.log("Created by Admin:", user?.IsLeaders?.Admin);
      return await ScheduleServices.serviceUpdateSchedule(args.id, args.data);
    },

    deleteSchedule: async (
      _: any,
      args: {
        [x: string]: any; id: string 
},
      { user }: { user: User }
    ) => {
      if (user?.Role === "MEMBER" && user?.IsLeaders?.Admin) {
        console.log("You are not authorized to perform this action.");
        console.log("User Admin status:", user?.Role === "MEMBER");

        throw new AuthenticationError(
          "You are not authorized to perform this action."
        );
      }

      console.log("Schedule created successfully:", args.data);
      console.log("Created by Admin:", user?.IsLeaders?.Admin);
      return await ScheduleServices.serviceDeleteSchedule(args.id);
    },
  },
};
