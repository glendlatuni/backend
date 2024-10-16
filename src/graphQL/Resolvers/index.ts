// import { mergeResolvers } from "@graphql-tools/merge"
import { MemberResolvers } from "./Member.Resolvers";
import { AttendeesResolvers } from "./Attendees.Resolvers";
import { LeaderResolvers } from "./Leaders.Resolvers";
import { ScheduleResolvers } from "./Schedule.Resolvers";
import { FamilyResolvers } from "./Family.Resolvers";
import { AuthResolvers } from "./AuthResolvers";
import { FetchingDataResolvers } from "./fetchingDataResolvers";
import { CountResolvers } from "./Count.Resolvers";


const margeResolvers = {
  Query: {
    ...MemberResolvers.Query,
    ...AttendeesResolvers.Query,
    ...FamilyResolvers.Query,
    ...LeaderResolvers.Query,
    ...ScheduleResolvers.Query,
    ...AuthResolvers.Query,
    ...FetchingDataResolvers.Query,
    ...CountResolvers.Query
  
  },

  Mutation: {
    ...MemberResolvers.Mutation,
    ...AttendeesResolvers.Mutation,
    ...LeaderResolvers.Mutation,
    ...ScheduleResolvers.Mutation,
    ...FamilyResolvers.Mutation,
    ...AuthResolvers.Mutation,
  },
};

// const margeResolvers: any = mergeResolvers([
//     MemberResolvers,

//     AttendeesResolvers,

//     LeaderResolvers,

//     ScheduleResolvers,

//     FamilyResolvers,

//     AuthResolvers
// ])

export default margeResolvers;
