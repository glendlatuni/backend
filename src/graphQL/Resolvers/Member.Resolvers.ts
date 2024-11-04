import { membersService } from "../../Services/MemberServices";
import { AuthenticationError, UserInputError } from "apollo-server-core";

const MemberServices = new membersService();

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

export const MemberResolvers = {
  Query: {
    queryGetMember: async (_: any, _args: any, { user }: { user: User }) => {
      const {
        Family: { 
          Rayon: { rayonNumber: Rayon }, 
        },
        Role,
      } = user;

      return await MemberServices.servicesGetMember(
        Rayon,
        Role === "SUPERUSER"
      );
    },

    queryGetMemberCanBeLiturgos: async (
      _: any,
      _args: any,
      { user }: { user: User }
    ) => {
      const {
        Family: { 
          Rayon: { rayonNumber: Rayon }, 
        },
        Role,
      } = user;

      return await MemberServices.ServiceGetMemberCanBeLiturgos(
        Rayon,
        Role === "SUPERUSER"
      );
    },

    memberSearch: async (
      _: any,
      { search }: { search: string },
      { user }: { user: User }
    ) => {
      const {
        Family: { 
          Rayon: { rayonNumber: Rayon }, 
        },
        Role,
      } = user;
      console.log("User data:", user);
      try {
        return await MemberServices.servicesGetMemberBySearch(
          search,
          Rayon,
          Role === "SUPERUSER"
        );
      } catch (error) {
        console.error("Error in memberSearch:", error);
        throw new Error("An error occurred while searching for members");
      }
    },

    queryGetKSP: async (
      _: any,
      { search }: { search: string },
      { user }: { user: User }
    ) => {
      const {
        Family: { 
          Rayon: { rayonNumber: Rayon }, 
        },
        Role,
      } = user;
      return await MemberServices.serviceGetMemberByKSP(
        search,
        Rayon,
        Role === "SUPERUSER"
      );
    },

    getMemberByID: async (_: any, { id }: { id: string }, { user }: { user: User }) => {
      console.log("GetMemberByID called with id:", id);
      console.log("User context:", user);
    
      if (!user) {
        throw new AuthenticationError("You must be logged in to perform this action");
      }
    
      const { Family: { 
        Rayon: { rayonNumber: Rayon }, 
      }, Role } = user;
      
      try {
        const member = await MemberServices.servicesGetMemberByID(id, Rayon, Role === "SUPERUSER");
        console.log("Member found:", member);
        return member;
      } catch (error) {
        console.error("Error in getMemberByID:", error);
        throw error;
      }
    },
  },


  Mutation: {
    createMember: async (_: any, { data }: any, { user }: { user: User }) => {
      if (user.Role === "MEMBERS") {
        throw new AuthenticationError(
          "You are not authorized to perform this action."
        );
      }

      try {
        const existingMember = await MemberServices.avoidDuplicate(
          data.FullName,
          data.BirthDate
        );
        if (existingMember) {
          throw new UserInputError("User already exists");
        }
        return await MemberServices.servicesCreateMember(data);
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

    updateMember: async (
      _: any,
      { id, data }: any,
      { user }: { user: User }
    ) => {
      if (user.Family?.FamilyMembers?.Role === "MEMBERS") {
        throw new AuthenticationError(
          "You are not authorized to perform this action."
        );
      }

      try {
        const updateDataMember = await MemberServices.servicesUpdateMember(
          id,
          data
        );
        if (!updateDataMember) {
          throw new Error("No data found");
        }
        console.log("Member updated successfully:", updateDataMember.FullName);
        return updateDataMember;
      } catch (error) {
        console.error("Error updating member:", error);
        throw error;
      }
    },

    deleteMember: async (
      _: any,
      { id }: { id: string },
      { user }: { user: User }
    ) => {
      if (user.Family?.FamilyMembers?.Role === "MEMBERS") {
        throw new AuthenticationError(
          "You are not authorized to perform this action."
        );
      }

      try {
        return await MemberServices.servicesDeleteMember(id);
      } catch (error) {
        console.error("Error deleting member:", error);
        throw error;
      }
    },

    updateMemberPhoto: async (_: any, { id, data }: any) => {
      try {
        return await MemberServices.servicesUpdateMember(id, data);
      } catch (error) {
        console.error("Error updating member photo:", error);
        throw error;
      }
    },

    updateAdminMemberRole: async (
      _: any,
      { id, data }: any,
      { user }: { user: User }
    ) => {
      if (user.Family?.FamilyMembers?.Role === "MEMBERS") {
        throw new AuthenticationError(
          "You are not authorized to perform this action."
        );
      }

      try {
        return await MemberServices.servicesUpdateMember(id, data);
      } catch (error) {
        console.error("Error updating admin member role:", error);
        throw error;
      }
    },
  },
};
