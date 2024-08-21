import { membersService } from "../../Services/MemberServices";
import { AuthenticationError, UserInputError } from "apollo-server-core";
const MemberServices = new membersService();

interface User {
  Role?: string;
  IsLeaders?: {
    Admin?: boolean;
  };
}

export const MemberResolvers = {
  Query: {
    queryGetMember: async (_: any, _args: any, context: any) => {
      const zones = context.user?.Zones;
      const isSuperUser = context.user?.Role === "SUPERUSER";
      return await MemberServices.servicesGetMember(zones, isSuperUser);
    },
    memberSearch: async (_: any, args: { search: string}, context: any) => {
      const zones = context.user?.Zones;
      const isSuperUser = context.user?.Role === "SUPERUSER";
      return await MemberServices.servicesGetMemberBySearch(args.search, zones, isSuperUser);
    },

    queryGetKSP: async (_: any, args: { search: string}, context: any) => {
      const zones = context.user?.Zones;
      const isSuperUser = context.user?.Role === "SUPERUSER";
      return await MemberServices.serviceGetMemberByKSP(args.search, zones, isSuperUser);
    },

    getMemberByID: async (_: any, args: { id: string }, context: any) => {
      const zones = context.user?.Zones;
      const isSuperUser = context.user?.Role === "SUPERUSER";
      return await MemberServices.servicesGetMemberByID(args.id, zones, isSuperUser);
    },
  },

  Mutation: {
    createMember: async (_: any, args: any, { user }: { user: User }) => {
     
      if (user?.Role === "MEMBER" && !user?.IsLeaders?.Admin) {
        console.log("You are not authorized to perform this action.");

        throw new AuthenticationError(
          "You are not authorized to perform this action."
        );
      }

      try {
         // block for avoid duplicate
        const existingMember = await MemberServices.avoidDuplicate(
          args.data.FullName,
          args.data.BirthDate
        );

        if (existingMember) {
          throw new UserInputError("User already exists");
        }

        const createNewMember = await MemberServices.servicesCreateMember(
          args.data
        );

        return createNewMember;
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
    },

    updateMember: async (_: any, args: any, { user }: { user: User }) => {
      if (user?.Role === "MEMBER" && !user?.IsLeaders?.Admin) {
        console.log("You are not authorized to perform this action.");

        throw new AuthenticationError(
          "You are not authorized to perform this action."
        );
      }

      try {
        const updateDataMember = await MemberServices.servicesUpdateMember(
          args.id,
          args.data
        );

        if (updateDataMember === null) {
          throw new Error("No data found");
        }

        console.log("Member updated successfully:", updateDataMember.FullName);

        console.log("Updated by Admin:", user?.IsLeaders);

        return updateDataMember;
      } catch (error) {}
    },

    deleteMember: async (
      _: any,
      args: { id: string },
      { user }: { user: User }
    ) => {
      if (user?.Role === "MEMBER" && !user?.IsLeaders?.Admin) {
        console.log("You are not authorized to perform this action.");

        throw new AuthenticationError(
          "You are not authorized to perform this action."
        );
      }

      try {
        const deleteMember = await MemberServices.servicesDeleteMember(args.id);

        return deleteMember;
      } catch (error) {
        throw new error();
      }
    },

    updateMemberPhoto: async (_: any, args: any) => {
      try {
        return await MemberServices.servicesUpdateMember(args.id, args.data);
      } catch (error) {
        throw new error();
      }
    },

    updateAdminMemberRole: async (
      _: any,
      args: any,
      { user }: { user: User }
    ) => {
      if (user?.Role === "MEMBER" && !user?.IsLeaders?.Admin) {
        console.log("You are not authorized to perform this action.");

        throw new AuthenticationError(
          "You are not authorized to perform this action."
        );
      }

      try {
        return await MemberServices.servicesUpdateMember(args.id, args.data);
      } catch (error) {
        throw new error();
      }
    },
  },
};
