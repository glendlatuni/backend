import { AuthenticationError, UserInputError } from "apollo-server-core";
import { familyServices } from "../../Services/FamilyServices";

const FamilyServices = new familyServices();

interface User {
  FullName: string;
  Role: string;
  IsLeaders: { Admin?: boolean };
  Family: {
    Rayon: number;
  };
}

export const FamilyResolvers = {
  Query: {
    queryGetFamily: async (_: any, _args: any, User: { user: User }) => {
      const zones = User.user.Family.Rayon;
      const isSuperUser = User.user.Role === "SUPERUSER";

      return await FamilyServices.servicesGetFamily(zones, isSuperUser);
    },

    queryGetFamilyByID: async (_: any, args: { id: string }, context: any) => {
      const zones = context?.user?.Family?.Rayon;

      const isSuperUser = context?.user?.Role === "SUPERUSER";
      return await FamilyServices.servicesGetFamilyByID(
        args.id,
        zones,
        isSuperUser
      );
    },

    familySearch: async (_: any, args: { search: string }, User: { user: User }) => {
      const zones = User.user.Family?.Rayon;
      const isSuperUser = User.user.Role === "SUPERUSER";

      console.log("isSuperUser", isSuperUser);
      console.log("zones", zones);

      try {
        return await FamilyServices.servicesGetFamilyBySearch(args.search, zones, isSuperUser);
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
      const rayon = User.user.Family.Rayon;

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
        console.log("You are not authorized to perform this action.");
        throw new AuthenticationError(
          "You are not authorized to perform this action."
        );
      }
      try {
        const existingFamily = await FamilyServices.avoidDuplicateFamily(
          args.data.FamilyName
        );

        if (existingFamily) {
          throw new UserInputError("Family already exists");
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
      const rayon = User?.user?.Family?.Rayon;
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
