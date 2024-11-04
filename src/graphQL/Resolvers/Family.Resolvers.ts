import { AuthenticationError, UserInputError } from "apollo-server-core";
import { familyServices } from "../../Services/FamilyServices";

const FamilyServices = new familyServices();

interface User {
  id: string;
  FullName: string;
  Role: string;
  IsLeaders: { Admin?: boolean };
  Family: {
    id: string;
    Rayon: {
      rayonNumber: number;
    };
  };
}

export const FamilyResolvers = {
  Query: {
    queryGetFamily: async (_: any, _args: any, User: { user: User }) => {
      const zones = User.user.Family.Rayon.rayonNumber;
      const isSuperUser = User.user.Role === "SUPERUSER";

      

      return await FamilyServices.servicesGetFamily(zones, isSuperUser);
    },

    queryGetFamilyPagination: async ( _: any, args: any, User: { user: User } ) => {
      const zones = User.user.Family.Rayon.rayonNumber;
      const isSuperUser = User.user.Role === "SUPERUSER";
      return await FamilyServices.serviceGetFamilyPagination(zones, isSuperUser, args.page, args.pageSize);
    },

    queryGetCurrentFamilyUser: async (
      _: any,
      _args: any,
      User: { user: User }
    ) => {
      const current = User.user;

      if (!current) {
        throw new AuthenticationError("User not found");
      }

      const user = await FamilyServices.getCurrentFamilyUser(current.id);

      return user;
    },

    queryGetFamilyByID: async (_: any, args: { id: string }, context: any) => {
      const zones = context?.user?.Family?.Rayon.rayonNumber;

      const isSuperUser = context?.user?.Role === "SUPERUSER";

      console.log("isSuperUser", isSuperUser);
      console.log("zones", zones);

      return await FamilyServices.servicesGetFamilyByID(
        args.id,
        zones,
        isSuperUser
      );
    },

    familySearch: async (
      _: any,
      args: { search: string },
      User: { user: User }
    ) => {
      const zones = User.user.Family?.Rayon.rayonNumber;
      const isSuperUser = User.user.Role === "SUPERUSER";

      console.log("isSuperUser", isSuperUser);
      console.log("zones", zones);

      try {
        return await FamilyServices.servicesGetFamilyBySearch(
          args.search,
          zones,
          isSuperUser
        );
      } catch (error) {
        console.error("Error in familySearch:", error);
        throw new Error("An error occurred while searching for families");
      }
    },

    querySearchFamilyByKSP: async (
      _: any,
      args: { search: string },
      User: { user: User }
    ) => {
      const isSuperUser = User.user.Role === "SUPERUSER";
      const rayon = User.user.Family.Rayon.rayonNumber;

      console.log("rayon", rayon);

      try {
        return await FamilyServices.servicesGetFamilyByKSP(
          args.search,
          rayon,
          isSuperUser
        );
      } catch (error) {
        console.log(error);
      }
    },
  },

  Mutation: {
    // family section
    createFamily: async (_: any, args: any, User: { user: User }) => {
      const userRole = User.user.Role;

      if (userRole === "MEMBERS") {
        console.log(`You are ${userRole} not authorized to perform this action.`);
        throw new AuthenticationError(
          "You are not authorized to perform this action."
        );
      }
      try {
        const existingFamily = await FamilyServices.avoidDuplicateFamily(
          args.data.FamilyName
        );

        if (existingFamily) {
          
          throw new UserInputError(`Family ${existingFamily.FamilyName} already exists`);
        }

        const createFamily = await FamilyServices.servicesCreateFamily(
          args.data
        );

        console.log("Family created successfully:", createFamily);
        return createFamily;
      } catch (error) {
        throw error;
      }
    },

    updateFamily: async (
      _: any,
      args: { id: string; data: any },
      User: { user: User }
    ) => {
      const rayon = User?.user?.Family?.Rayon?.rayonNumber;
      const isSuperUser = User?.user?.Role === "SUPERUSER";

      if (User?.user?.Role === "MEMBERS") {
        throw new AuthenticationError(
          "You are not authorized to perform this Update."
        );
      }

      try {
        const updateFamily = await FamilyServices.servicesUpdateFamily(
          args.id,
          rayon,
          isSuperUser,
          args.data
        );
        console.log("Family updated successfully:", updateFamily);

        return updateFamily;
      } catch (error) {
        throw error;
      }
    },
  },
};
