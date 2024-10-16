import {fetchingDataServices} from "../../Services/fetchingDataServices";


const FetchingDataServices = new fetchingDataServices();



export const FetchingDataResolvers = {
    Query: {
        fetchingGetMembers: async () => {
            return await FetchingDataServices.getMembers();
        },

        fetchingGetMemberByID: async (_: any, args: { id: string }) => {
            return await FetchingDataServices.getMemberByID(args.id);
        },
    },
}