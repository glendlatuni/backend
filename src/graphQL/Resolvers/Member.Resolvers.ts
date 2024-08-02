
import { membersService } from "../../Services/MemberServices";

const MemberServices = new membersService();



export const MemberResolvers = {

    Query:{
        
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
    },

    Mutation:{

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

          updateAdminMemberRole: async (_: any, args: any) => {
            return await MemberServices.servicesUpdateMember(args.id, args.data);
          },

          
    }


}