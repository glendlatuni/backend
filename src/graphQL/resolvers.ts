import { membersService } from './../Services/MemberServices';
import { familyServices } from './../Services/FamilyServices';



const MemberServices = new membersService();
const FamilyServices = new familyServices();


export const resolvers = {

    Query: {
        member : async () => {
return await MemberServices.getMember();
        },

        family : async () => {
return await FamilyServices.getKeluarga();
        },


        memberSearch : async(_: any, args:{search: string}) => {
        return await MemberServices.getMemberBySearch(args.search);
     
        }


    },

    Mutation: {
        
        createMember: async (_: any, args: any) => {
            return await MemberServices.createMember(args.data);
        },

        createFamily: async (_: any, args: any) => {
            return await FamilyServices.createKeluarga(args.data);
        },

        deleteFamily: async(_: any, args:{id:string}) => {
            return await FamilyServices.deleteKeluarga(args.id);
        },

        updateFamily: async(_:any, args:{id:string, data:any}) => {
            return await FamilyServices.updateKeluarga(args.id, args.data);
        }
    }
}




