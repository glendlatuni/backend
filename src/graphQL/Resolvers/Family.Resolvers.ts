import { AuthenticationError } from "apollo-server-core";
import { familyServices } from "../../Services/FamilyServices";

const FamilyServices = new familyServices();

interface User {
    Admin?: boolean;
    IsLeaders?: {
      Admin?: boolean;
    };
  };


export const FamilyResolvers = {
  Query: {
    queryGetFamily: async () => {
      return await FamilyServices.servicesGetFamily();
    },

    queryGetFamilyByID: async (_: any, args: { id: string }) => {
      return await FamilyServices.servicesGetFamilyByID(args.id);
    },

    familySearch: async (_: any, args: { search: string }) => {
      return await FamilyServices.servicesGetFamilyBySearch(args.search);
    },

    querySearchFamilyByKSP: async (_: any, args: { search: string }) => {
      return await FamilyServices.servicesGetFamilyByKSP(args.search);
    },
  },

  Mutation: {
    // family section
    createFamily: async (_: any, args: any, { user }: { user: User }) => {
      if (!user?.Admin && !user?.IsLeaders?.Admin) {
        console.log("You are not authorized to perform this action.");
        console.log("User Admin status:", user);

        throw new AuthenticationError(
          "You are not authorized to perform this action."
        );
      }

      try {
        const createFamily = await FamilyServices.servicesCreateFamily(
          args.data
        );
        console.log("Family created successfully:", createFamily);
        console.log("Created by Admin:", user?.IsLeaders);
        return createFamily;
      } catch (error) {
        throw new error();
      }
    },

    deleteFamily: async (
      _: any,
      args: { id: string },
      { user }: { user: User }
    ) => {
      if (!user?.Admin && !user?.IsLeaders?.Admin) {
        console.log("You are not authorized to perform this action.");
        console.log("User Admin status:", user?.Admin);
        throw new AuthenticationError(
          "You are not authorized to perform this action."
        );
      }

      try {
        const deleteFamily = await FamilyServices.servicesDeleteFamily(args.id);
        console.log("Family deleted successfully:", deleteFamily);
        console.log("Deleted by Admin:", user?.IsLeaders);
        return deleteFamily;
      } catch (error) {
        throw new error();
      }
    },

    updateFamily: async (
      _: any,
      args: { id: string; data: any },
      { user }: { user: User }
    ) => {
      if (!user?.Admin && !user?.IsLeaders?.Admin) {
        console.log("You are not authorized to perform this action.");
        console.log("User Admin status:", user?.Admin);
        throw new AuthenticationError(
          "You are not authorized to perform this action."
        );
      }

      try {
        const updateFamily = await FamilyServices.servicesUpdateFamily(
          args.id,
          args.data
        );
        console.log("Family updated successfully:", updateFamily);
        console.log("Updated by Admin:", user?.IsLeaders);
        return updateFamily;
      } catch (error) {
        throw new error();
      }
    },
  },
};
