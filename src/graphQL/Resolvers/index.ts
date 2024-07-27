import { mergeResolvers } from "@graphql-tools/merge"
import { MemberResolvers } from "./Member.Resolvers"
import { AttendeesResolvers } from "./Attendees.Resolvers"
import { LeaderResolvers } from "./Leaders.Resolvers"
import { ScheduleResolvers } from "./Schedule.Resolvers"
import { FamilyResolvers } from "./Family.Resolvers"



const margeResolvers: any = mergeResolvers([
    MemberResolvers,
    
    AttendeesResolvers,

    LeaderResolvers,

    ScheduleResolvers,

    FamilyResolvers
])

export default margeResolvers

