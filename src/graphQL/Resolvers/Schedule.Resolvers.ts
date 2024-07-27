import { scheduleServices } from "../../Services/ScheduleServices";

const ScheduleServices = new scheduleServices();



export const ScheduleResolvers = {

    Query:{
        queryGetSchedule: async () => {
            return await ScheduleServices.serviceGetSchedule();
          },
    },


    Mutation:{
        createSchedule: async (_: any, args: any) => {
            return await ScheduleServices.serviceCreateSchedule(args.data);
          },
      
          updateSchedule: async (_: any, args: { id: string; data: any }) => {
            return await ScheduleServices.serviceUpdateSchedule(args.id, args.data);
          },
      
          deleteSchedule: async (_: any, args: { id: string }) => {
            return await ScheduleServices.serviceDeleteSchedule(args.id);
          },
    }
}