import { familyServices } from "../../Services/FamilyServices";

const FamilyServices = new familyServices();




export const FamilyResolvers = {

    Query:{
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

    Mutation:{
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
  
    }
}