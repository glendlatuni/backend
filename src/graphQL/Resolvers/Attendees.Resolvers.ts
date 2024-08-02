import { attendeesServices } from "../../Services/AttendeesServices";

const AttendeesServices = new attendeesServices();


export const AttendeesResolvers = {
    Query: {
  
      queryGetAttendees: async () => {
        return await AttendeesServices.serviceGetAttendees();
      },
    },

  
    Mutation: {
  
      createAttendees: async (_: any, args: any) => {
        return await AttendeesServices.serviceCreateAttendees(args.data);
      },
  
      updateAttendees: async (_: any, args: { id: string; data: any }) => {
        return await AttendeesServices.addMembersToAttendees(
          args.id,
          args.data.Members_Id
        );
      },
  
      updateRealAttendees: async (_: any, args: { id: string; data: any }) => {
        return await AttendeesServices.serviceAddRealAttendees(
          args.id,
          args.data
        );
      },
    },
  };
  