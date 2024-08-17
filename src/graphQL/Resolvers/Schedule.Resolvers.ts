import { AuthenticationError } from "apollo-server-core";
import { scheduleServices } from "../../Services/ScheduleServices";

const ScheduleServices = new scheduleServices();

enum searchFields {
  Id = "id",
  Category = "Category",
  Date = "Date",
  Day = "Day",
  Month = "Month",
  Years = "Years",
  Time = "Time",
  Address = "Address",
  Liturgos = "Liturgos",
  Description = "Description"
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
    createSchedule: async (_: any, args: any, { user }: { user: any }) => {
      if (!user?.Member?.Admin && !user?.Member?.IsLeaders?.Admin) {
        console.log("You are not authorized to perform this action.");
        console.log("User Admin status:", user?.Member?.Admin);

        throw new AuthenticationError(
          "You are not authorized to perform this action."
        );
      }

      console.log("Schedule created successfully:", args.data);
      console.log("Created by Admin:", user?.Member.IsLeaders);

      return await ScheduleServices.serviceCreateSchedule(args.data);
    },

    updateSchedule: async (
      _: any,
      args: { id: string; data: any },
      { user }: { user: any }
    ) => {
      if (!user?.Member?.Admin && !user?.Member?.IsLeaders?.Admin) {
        console.log("You are not authorized to perform this action.");
        console.log("User Admin status:", user?.Member?.Admin);

        throw new AuthenticationError(
          "You are not authorized to perform this action."
        );
      }

      console.log("Schedule updated successfully:", args.data);
      console.log("Updated by Admin:", user?.Member.IsLeaders);
      return await ScheduleServices.serviceUpdateSchedule(args.id, args.data);
    },

    deleteSchedule: async (
      _: any,
      args: { id: string },
      { user }: { user: any }
    ) => {
      if (!user?.Member?.Admin && !user?.Member?.IsLeaders?.Admin) {
        console.log("You are not authorized to perform this action.");
        console.log("User Admin status:", user?.Member?.Admin);

        throw new AuthenticationError(
          "You are not authorized to perform this action."
        );
      }

      console.log("Schedule deleted successfully:", args.id);
      console.log("Deleted by Admin:", user?.Member.IsLeaders);
      return await ScheduleServices.serviceDeleteSchedule(args.id);
    },
  },
};
