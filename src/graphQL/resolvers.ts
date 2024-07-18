import { membersService } from "./../Services/MemberServices";
import { familyServices } from "./../Services/FamilyServices";

const MemberServices = new membersService();
const FamilyServices = new familyServices();

export const resolvers = {
  Query: {
    queryGetMember: async () => {
      return await MemberServices.servicesGetMember();
    },

    queryGetFamily: async () => {
      return await FamilyServices.servicesGetFamily();
    },

    memberSearch: async (_: any, args: { search: string }) => {
      return await MemberServices.servicesGetMemberBySearch(args.search);
    },
  },

// Mutations section

  Mutation: {
    createMember: async (_: any, args: any) => {
      return await MemberServices.servicesCreateMember(args.data);
    },

    createFamily: async (_: any, args: any) => {
      return await FamilyServices.servicesCreateFamily(args.data);
    },

    deleteFamily: async (_: any, args: { id: string }) => {
      return await FamilyServices.servicesDeleteFamily(args.id);
    },

    updateFamily: async (_: any, args: { id: string; data: any }) => {
      return await FamilyServices.servicesUpdateFamily(args.id, args.data);
    },
  },
};
