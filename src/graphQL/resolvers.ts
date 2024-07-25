import { membersService } from "./../Services/MemberServices";
import { familyServices } from "./../Services/FamilyServices";
import { scheduleServices } from "./../Services/ScheduleServices";
import { leaderServices } from "./../Services/LeaderServices";
import { attendeesServices } from "./../Services/AttendeesServices";

const MemberServices = new membersService();
const FamilyServices = new familyServices();
const ScheduleServices = new scheduleServices();
const LeaderServices = new leaderServices();
const AttendeesServices = new attendeesServices();

export const resolvers = {
  Query: {
    // Member query section
    queryGetMember: async () => {
      return await MemberServices.servicesGetMember();
    },
    memberSearch: async (_: any, args: { search: string }) => {
      return await MemberServices.servicesGetMemberBySearch(args.search);
    },

    queryGetKSP: async (_: any, args: { search: string }) => {
      return await MemberServices.serviceGetMemberByKSP(args.search);
    },

    getMemberByID: async (_: any, args: { id: string }) => {
      return await MemberServices.servicesGetMemberByID(args.id);
    },

    //     Family query section
    queryGetFamily: async () => {
      return await FamilyServices.servicesGetFamily();
    },

    queryGetFamilyByID: async (_: any, args: { id: string }) => {
      return await FamilyServices.servicesGetFamilyByID(args.id);
    },

    // Schedule query section
    queryGetSchedule: async () => {
      return await ScheduleServices.serviceGetSchedule();
    },

    // Leader query section

    queryGetLeaders: async () => {
      return await LeaderServices.serviceGetLeader();
    },

    queryGetLeadersByID: async (_: any, args: { id: string }) => {
      return await LeaderServices.serviceGetLeaderByID(args.id);
    },

    // attendees section

    queryGetAttendees: async () => {
      return await AttendeesServices.serviceGetAttendees();
    },
  },
  // Mutations section

  Mutation: {
    // Member mutation Section
    createMember: async (_: any, args: any) => {
      // block for avoid duplicate

      try {
        const existingMember = await MemberServices.avoidDuplicate(
          args.data.FullName,
          args.data.BirthDate
        );

        if (existingMember) {
          console.log("Member already exists");
          throw new Error("User already exists");
        }

        return await MemberServices.servicesCreateMember(args.data);
      } catch (error) {
        return error;
      }
    },

    updateMember: async (_: any, args: any) => {
      return await MemberServices.servicesUpdateMember(args.id, args.data);
    },

    deleteMember: async (_: any, args: { id: string }) => {
      return await MemberServices.servicesDeleteMember(args.id);
    },

    updateMemberPhoto: async (_: any, args: any) => {
      return await MemberServices.servicesUpdateMember(args.id, args.data);
    },

    // family section
    createFamily: async (_: any, args: any) => {
      return await FamilyServices.servicesCreateFamily(args.data);
    },

    deleteFamily: async (_: any, args: { id: string }) => {
      return await FamilyServices.servicesDeleteFamily(args.id);
    },

    updateFamily: async (_: any, args: { id: string; data: any }) => {
      return await FamilyServices.servicesUpdateFamily(args.id, args.data);
    },

    // Schedule Section

    createSchedule: async (_: any, args: any) => {
      return await ScheduleServices.serviceCreateSchedule(args.data);
    },

    // Leader Section

    createIsLeaders: async (_: any, args: any) => {
      const newLeader = await LeaderServices.serviceCreateLeader(args.data);
      return newLeader;
    },

    // Attendees Section

    createAttendees: async (_: any, args: any) => {
      return await AttendeesServices.serviceCreateAttendees(args.data);
    },

    updateAttendees: async (_: any, args: { id: string; data: any }) => {
      return await AttendeesServices.addMembersToAttendees(
        args.id,
        args.data.Members_ID
      );
    },
  },
};
